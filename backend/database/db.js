import pkg from 'pg';
const { Pool } = pkg;
import { products } from '../data/storeData.js';

// Setup PostgreSQL pool with SSL option (required for Render / Supabase / Neon / Cloud Postgres)
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/teeverse';

const isProduction = process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Helper for executing queries
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('❌ PostgreSQL Query Error:', err.message, { text });
    throw err;
  }
}

// Initialize PostgreSQL database schema & initial seed data
export async function initDatabase() {
  console.log(`\n🗄️ Initializing PostgreSQL Database...`);
  console.log(`🔗 Connection String: ${process.env.DATABASE_URL ? '[DATABASE_URL Configured]' : connectionString}`);

  try {
    // 1. PRODUCTS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE,
        price INTEGER NOT NULL,
        mrp INTEGER NOT NULL,
        discount INTEGER,
        category TEXT NOT NULL,
        tags TEXT,
        sizes TEXT,
        colors TEXT,
        images TEXT,
        rating REAL,
        reviewCount INTEGER,
        description TEXT,
        fabric TEXT,
        washCare TEXT,
        fit TEXT,
        inStock INTEGER,
        isNew INTEGER,
        isBestseller INTEGER
      )
    `);

    // 2. ORDERS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        orderId TEXT UNIQUE NOT NULL,
        date TEXT NOT NULL,
        customerName TEXT NOT NULL,
        customerPhone TEXT NOT NULL,
        customerEmail TEXT,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pincode TEXT NOT NULL,
        deliveryOption TEXT,
        paymentMethod TEXT,
        total INTEGER NOT NULL,
        status TEXT DEFAULT 'confirmed',
        itemsJson TEXT NOT NULL,
        paymentScreenshot TEXT
      )
    `);

    // 3. CONTACT QUERIES TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_queries (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'unread'
      )
    `);

    // SEED PRODUCTS IF EMPTY
    const productRes = await pool.query('SELECT COUNT(*) AS count FROM products');
    const productCount = parseInt(productRes.rows[0].count, 10);

    if (productCount === 0) {
      console.log(`🌱 Seeding ${products.length} products into PostgreSQL...`);
      for (const product of products) {
        await pool.query(`
          INSERT INTO products (
            id, name, slug, price, mrp, discount, category, tags, sizes, colors, images, rating, reviewCount, description, fabric, washCare, fit, inStock, isNew, isBestseller
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
          )
          ON CONFLICT (id) DO NOTHING
        `, [
          product.id,
          product.name,
          product.slug,
          product.price,
          product.mrp,
          product.discount ?? 0,
          product.category,
          JSON.stringify(product.tags ?? []),
          JSON.stringify(product.sizes ?? []),
          JSON.stringify(product.colors ?? []),
          JSON.stringify(product.images ?? []),
          product.rating ?? 0,
          product.reviewCount ?? 0,
          product.description ?? '',
          product.fabric ?? '',
          product.washCare ?? '',
          product.fit ?? '',
          product.inStock ? 1 : 0,
          product.isNew ? 1 : 0,
          product.isBestseller ? 1 : 0
        ]);
      }
      console.log(`✅ ${products.length} products seeded successfully!`);
    } else {
      console.log(`📦 Products already exist in PostgreSQL: ${productCount}`);
    }

    // SEED DEFAULT CONTACT QUERY IF EMPTY
    const queryRes = await pool.query('SELECT COUNT(*) AS count FROM contact_queries');
    const queryCount = parseInt(queryRes.rows[0].count, 10);

    if (queryCount === 0) {
      console.log('🌱 Seeding initial contact query into PostgreSQL...');
      await pool.query(`
        INSERT INTO contact_queries (id, date, name, email, phone, subject, message, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING
      `, [
        'q-101',
        new Date().toISOString(),
        'Aarav Patel',
        'aarav.patel@gmail.com',
        '9558613440',
        'Size & Fit Assistance',
        'Looking for advice on 240 GSM drop shoulder oversized tees sizing.',
        'unread'
      ]);
    }

    console.log('✅ PostgreSQL Database ready and verified!');
  } catch (err) {
    console.error('⚠️ PostgreSQL Connection / Setup Note:', err.message);
    if (!process.env.DATABASE_URL) {
      console.log('💡 TIP: Set DATABASE_URL in your environment (e.g. Render Dashboard or .env file) to connect to your PostgreSQL database.');
    }
  }
}

export default { pool, query, initDatabase };