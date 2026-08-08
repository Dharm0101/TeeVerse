import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'teeverse.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance concurrency
db.pragma('journal_mode = WAL');

// Initialize database schema tables
export function initDatabase() {
  console.log(`\n🗄️ Initializing SQLite Database at: ${dbPath}`);

  // Products Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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

  // Orders Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      itemsJson TEXT NOT NULL
    )
  `);

  // Migration: Add paymentScreenshot column to orders table if it doesn't exist
  try {
    db.exec(`ALTER TABLE orders ADD COLUMN paymentScreenshot TEXT`);
  } catch (err) {
    // Column already exists
  }

  // Contact Queries Table
  db.exec(`
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

  // Default products seeding disabled (empty catalog mode)

  // Seed default contact query if empty
  const queryCountStmt = db.prepare('SELECT COUNT(*) as count FROM contact_queries');
  const { count: queryCount } = queryCountStmt.get();

  if (queryCount === 0) {
    console.log('🌱 Seeding initial contact queries into SQLite database...');
    const insertQuery = db.prepare(`
      INSERT INTO contact_queries (id, date, name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertQuery.run(
      'q-101',
      new Date().toISOString(),
      'Aarav Patel',
      'aarav.patel@gmail.com',
      '9558613440',
      'Size & Fit Assistance',
      'Looking for advice on 240 GSM drop shoulder oversized tees sizing.',
      'unread'
    );
  }

  console.log('✅ SQLite Database ready and verified!');
}

export default db;
