import express from 'express';
import { pool, query } from '../database/db.js';
import { pincodeData } from '../data/storeData.js';
import { sendNewOrderEmailToOwner, sendContactQueryEmailToOwner, OWNER_EMAIL } from '../services/mailer.js';

const router = express.Router();

// Helper to parse JSON fields from product rows
function formatProductRow(row) {
  if (!row) return null;
  return {
    ...row,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []),
    sizes: typeof row.sizes === 'string' ? JSON.parse(row.sizes) : (row.sizes || []),
    colors: typeof row.colors === 'string' ? JSON.parse(row.colors) : (row.colors || []),
    images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
    inStock: Boolean(row.instock ?? row.inStock),
    isNew: Boolean(row.isnew ?? row.isNew),
    isBestseller: Boolean(row.isbestseller ?? row.isBestseller),
    reviewCount: row.reviewcount ?? row.reviewCount,
    washCare: row.washcare ?? row.washCare,
  };
}

// 1. GET /api/products — Fetch products from PostgreSQL DB
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    const formatted = result.rows.map(formatProductRow);
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. GET /api/products/:id — Fetch single product from PostgreSQL DB
router.get('/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: formatProductRow(result.rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2a. POST /api/products — Create a new product in PostgreSQL DB (Admin CRUD)
router.post('/products', async (req, res) => {
  const { name, category, price, mrp, discount, description, sizes, colors, tags, images, fabric, washCare, fit, inStock, isNew, isBestseller } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ success: false, message: 'Name, price, and category are required.' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const finalPrice = Number(price);
  const finalMrp = mrp !== undefined ? Number(mrp) : finalPrice;
  const finalDiscount = discount !== undefined ? Number(discount) : (finalMrp > finalPrice ? Math.round(((finalMrp - finalPrice) / finalMrp) * 100) : 0);

  try {
    const result = await pool.query(`
      INSERT INTO products (name, slug, price, mrp, discount, category, tags, sizes, colors, images, rating, reviewCount, description, fabric, washCare, fit, inStock, isNew, isBestseller)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `, [
      name,
      slug,
      finalPrice,
      finalMrp,
      finalDiscount,
      category,
      JSON.stringify(tags || ['trending']),
      JSON.stringify(sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']),
      JSON.stringify(colors || [{ name: 'Charcoal Black', hex: '#1a1a1a' }]),
      JSON.stringify(images || ['placeholder']),
      4.8,
      1,
      description || 'Premium heavyweight cotton streetwear tee.',
      fabric || '100% Combed Cotton, 240 GSM, Bio-washed',
      washCare || 'Machine wash cold, inside out',
      fit || 'Regular Fit',
      inStock !== undefined ? (inStock ? 1 : 0) : 1,
      isNew ? 1 : 0,
      isBestseller ? 1 : 0
    ]);

    res.status(201).json({ success: true, message: 'Product created successfully!', data: formatProductRow(result.rows[0]) });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2b. PUT /api/products/:id — Update product in PostgreSQL DB (Admin CRUD)
router.put('/products/:id', async (req, res) => {
  const { name, category, price, mrp, discount, description, sizes, colors, tags, images, fabric, washCare, fit, inStock, isNew, isBestseller } = req.body;

  try {
    const existingResult = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (existingResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });
    const existing = existingResult.rows[0];

    const newName = name || existing.name;
    const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newPrice = price !== undefined ? Number(price) : existing.price;
    const newMrp = mrp !== undefined ? Number(mrp) : existing.mrp;
    const newDiscount = discount !== undefined ? Number(discount) : (newMrp > newPrice ? Math.round(((newMrp - newPrice) / newMrp) * 100) : 0);

    const updateResult = await pool.query(`
      UPDATE products SET
        name = $1,
        slug = $2,
        price = $3,
        mrp = $4,
        discount = $5,
        category = $6,
        tags = $7,
        sizes = $8,
        colors = $9,
        images = $10,
        description = $11,
        fabric = $12,
        washCare = $13,
        fit = $14,
        inStock = $15,
        isNew = $16,
        isBestseller = $17
      WHERE id = $18
      RETURNING *
    `, [
      newName,
      newSlug,
      newPrice,
      newMrp,
      newDiscount,
      category || existing.category,
      JSON.stringify(tags || JSON.parse(existing.tags || '[]')),
      JSON.stringify(sizes || JSON.parse(existing.sizes || '[]')),
      JSON.stringify(colors || JSON.parse(existing.colors || '[]')),
      JSON.stringify(images || JSON.parse(existing.images || '["placeholder"]')),
      description || existing.description,
      fabric || existing.fabric,
      washCare || existing.washCare,
      fit || existing.fit,
      inStock !== undefined ? (inStock ? 1 : 0) : (existing.instock ?? existing.inStock),
      isNew !== undefined ? (isNew ? 1 : 0) : (existing.isnew ?? existing.isNew),
      isBestseller !== undefined ? (isBestseller ? 1 : 0) : (existing.isbestseller ?? existing.isBestseller),
      req.params.id
    ]);

    res.json({ success: true, message: 'Product updated successfully!', data: formatProductRow(updateResult.rows[0]) });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2c. DELETE /api/products/:id — Delete product from PostgreSQL DB (Admin CRUD)
router.delete('/products/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: `Product #${req.params.id} deleted successfully!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. POST /api/orders — Save order in PostgreSQL DB & Dispatch email notification
router.post('/orders', async (req, res) => {
  const { items, shipping, deliveryOption, paymentMethod, total, paymentScreenshot } = req.body;

  if (!shipping || !shipping.name || !shipping.phone || !shipping.address) {
    return res.status(400).json({ success: false, message: 'Missing required shipping information' });
  }

  const orderId = 'TV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const date = new Date().toISOString();
  const itemsJson = JSON.stringify(items || []);

  try {
    await pool.query(`
      INSERT INTO orders (orderId, date, customerName, customerPhone, customerEmail, address, city, state, pincode, deliveryOption, paymentMethod, total, status, itemsJson, paymentScreenshot)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `, [
      orderId,
      date,
      shipping.name,
      shipping.phone,
      shipping.email || '',
      shipping.address,
      shipping.city || '',
      shipping.state || 'Maharashtra',
      shipping.pincode || '',
      deliveryOption || 'standard',
      paymentMethod || 'cod',
      total || 0,
      'confirmed',
      itemsJson,
      paymentScreenshot || null
    ]);

    const newOrder = {
      orderId,
      date,
      items: items || [],
      shipping,
      deliveryOption: deliveryOption || 'standard',
      paymentMethod: paymentMethod || 'cod',
      total: total || 0,
      status: 'confirmed',
      paymentScreenshot: paymentScreenshot || null,
    };

    // Trigger Email Notification to Store Owner (teenesttt@gmail.com)
    await sendNewOrderEmailToOwner(newOrder);

    res.status(201).json({
      success: true,
      message: `Order saved in PostgreSQL DB & Email alert dispatched to ${OWNER_EMAIL}`,
      order: newOrder,
    });
  } catch (err) {
    console.error('Error inserting order into PostgreSQL:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. GET /api/orders — Fetch orders from PostgreSQL DB (Admin Only)
router.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    const formatted = result.rows.map((r) => ({
      orderId: r.orderid || r.orderId,
      date: r.date,
      total: r.total,
      paymentMethod: r.paymentmethod || r.paymentMethod,
      deliveryOption: r.deliveryoption || r.deliveryOption,
      status: r.status,
      paymentScreenshot: r.paymentscreenshot || r.paymentScreenshot || null,
      shipping: {
        name: r.customername || r.customerName,
        phone: r.customerphone || r.customerPhone,
        email: r.customeremail || r.customerEmail,
        address: r.address,
        city: r.city,
        state: r.state,
        pincode: r.pincode,
      },
      items: (r.itemsjson || r.itemsJson) ? JSON.parse(r.itemsjson || r.itemsJson) : [],
    }));
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. PATCH /api/orders/:id/status — Update order status in PostgreSQL DB
router.patch('/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query('UPDATE orders SET status = $1 WHERE orderId = $2', [status, req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: `Order ${req.params.id} updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. POST /api/contact — Handle Contact Us Form Submissions
router.post('/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }

  const queryId = 'q-' + Date.now();
  const date = new Date().toISOString();
  const query = {
    id: queryId,
    name,
    email,
    phone: phone || '',
    subject: subject || 'General Inquiry',
    message,
    date,
    status: 'unread'
  };

  try {
    await pool.query(`
      INSERT INTO contact_queries (id, date, name, email, phone, subject, message, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [query.id, query.date, query.name, query.email, query.phone, query.subject, query.message, query.status]);

    await sendContactQueryEmailToOwner(query);
    res.json({ success: true, message: 'Contact query submitted, saved, and emailed!', data: query });
  } catch (err) {
    console.error('Error processing contact inquiry:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6a. GET /api/contact — Fetch all contact queries from PostgreSQL DB
router.get('/contact', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_queries ORDER BY date DESC');
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6b. PATCH /api/contact/:id/status — Update contact query status in PostgreSQL DB
router.patch('/contact/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query('UPDATE contact_queries SET status = $1 WHERE id = $2', [status, req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }
    res.json({ success: true, message: `Query status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6c. DELETE /api/contact/:id — Delete contact query from PostgreSQL DB
router.delete('/contact/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM contact_queries WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }
    res.json({ success: true, message: `Query #${req.params.id} deleted successfully!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. Admin Owner Login
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  const validIdentifiers = [OWNER_EMAIL.toLowerCase(), 'admin@teeverse.in', 'admin'];

  if (email && validIdentifiers.includes(email.toLowerCase().trim()) && password === 'TeeVerse@2026') {
    return res.json({
      success: true,
      message: 'Owner Admin Access Granted',
      ownerEmail: OWNER_EMAIL,
    });
  }

  res.status(401).json({
    success: false,
    message: 'Access Denied: Only store owner can login as admin.',
  });
});

// 8. Pincode Lookup
router.get('/pincode/:code', (req, res) => {
  const prefix = req.params.code.substring(0, 3);
  const found = pincodeData[prefix];
  if (found) {
    res.json({ success: true, serviceable: true, data: found });
  } else {
    res.json({
      success: true,
      serviceable: true,
      data: { city: 'Standard Location', state: 'India', deliveryDays: 5, codAvailable: true },
    });
  }
});

export default router;
