import express from 'express';
import db from '../database/db.js';
import { pincodeData } from '../data/storeData.js';
import { sendNewOrderEmailToOwner, sendContactQueryEmailToOwner, OWNER_EMAIL } from '../services/mailer.js';

const router = express.Router();

// Helper to parse JSON fields from SQLite product rows
function formatProductRow(row) {
  if (!row) return null;
  return {
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : [],
    sizes: row.sizes ? JSON.parse(row.sizes) : [],
    colors: row.colors ? JSON.parse(row.colors) : [],
    images: row.images ? JSON.parse(row.images) : [],
    inStock: Boolean(row.inStock),
    isNew: Boolean(row.isNew),
    isBestseller: Boolean(row.isBestseller),
  };
}

// 1. GET /api/products — Fetch products from SQLite DB
router.get('/products', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM products').all();
    const formatted = rows.map(formatProductRow);
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. GET /api/products/:id — Fetch single product from SQLite DB
router.get('/products/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: formatProductRow(row) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2a. POST /api/products — Create a new product in SQLite DB (Admin CRUD)
router.post('/products', (req, res) => {
  const { name, category, price, mrp, discount, description, sizes, colors, tags, images, fabric, washCare, fit, inStock, isNew, isBestseller } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ success: false, message: 'Name, price, and category are required.' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const finalPrice = Number(price);
  const finalMrp = mrp !== undefined ? Number(mrp) : finalPrice;
  const finalDiscount = discount !== undefined ? Number(discount) : (finalMrp > finalPrice ? Math.round(((finalMrp - finalPrice) / finalMrp) * 100) : 0);

  try {
    const stmt = db.prepare(`
      INSERT INTO products (name, slug, price, mrp, discount, category, tags, sizes, colors, images, rating, reviewCount, description, fabric, washCare, fit, inStock, isNew, isBestseller)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
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
    );

    const createdProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Product created successfully!', data: formatProductRow(createdProduct) });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2b. PUT /api/products/:id — Update product in SQLite DB (Admin CRUD)
router.put('/products/:id', (req, res) => {
  const { name, category, price, mrp, discount, description, sizes, colors, tags, images, fabric, washCare, fit, inStock, isNew, isBestseller } = req.body;

  try {
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Product not found' });

    const newName = name || existing.name;
    const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newPrice = price !== undefined ? Number(price) : existing.price;
    const newMrp = mrp !== undefined ? Number(mrp) : existing.mrp;
    const newDiscount = discount !== undefined ? Number(discount) : (newMrp > newPrice ? Math.round(((newMrp - newPrice) / newMrp) * 100) : 0);

    const stmt = db.prepare(`
      UPDATE products SET
        name = ?,
        slug = ?,
        price = ?,
        mrp = ?,
        discount = ?,
        category = ?,
        tags = ?,
        sizes = ?,
        colors = ?,
        images = ?,
        description = ?,
        fabric = ?,
        washCare = ?,
        fit = ?,
        inStock = ?,
        isNew = ?,
        isBestseller = ?
      WHERE id = ?
    `);

    stmt.run(
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
      inStock !== undefined ? (inStock ? 1 : 0) : existing.inStock,
      isNew !== undefined ? (isNew ? 1 : 0) : existing.isNew,
      isBestseller !== undefined ? (isBestseller ? 1 : 0) : existing.isBestseller,
      req.params.id
    );

    const updatedRow = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json({ success: true, message: 'Product updated successfully!', data: formatProductRow(updatedRow) });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2c. DELETE /api/products/:id — Delete product from SQLite DB (Admin CRUD)
router.delete('/products/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    const result = stmt.run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: `Product #${req.params.id} deleted successfully!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. POST /api/orders — Save order in SQLite DB & Dispatch email notification to teenesttt@gmail.com
router.post('/orders', async (req, res) => {
  const { items, shipping, deliveryOption, paymentMethod, total, paymentScreenshot } = req.body;

  if (!shipping || !shipping.name || !shipping.phone || !shipping.address) {
    return res.status(400).json({ success: false, message: 'Missing required shipping information' });
  }

  const orderId = 'TV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const date = new Date().toISOString();
  const itemsJson = JSON.stringify(items || []);

  try {
    const insertOrder = db.prepare(`
      INSERT INTO orders (orderId, date, customerName, customerPhone, customerEmail, address, city, state, pincode, deliveryOption, paymentMethod, total, status, itemsJson, paymentScreenshot)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertOrder.run(
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
    );

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
      message: `Order saved in SQLite DB & Email alert dispatched to ${OWNER_EMAIL}`,
      order: newOrder,
    });
  } catch (err) {
    console.error('Error inserting order into SQLite:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. POST /api/contact — Handle Contact Us Form Submissions, Save to SQLite, & Email Store Owner
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
    // Insert into SQLite database
    const stmt = db.prepare(`
      INSERT INTO contact_queries (id, date, name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(query.id, query.date, query.name, query.email, query.phone, query.subject, query.message, query.status);

    // Send instant email notification to store owner (teenesttt@gmail.com)
    await sendContactQueryEmailToOwner(query);
    res.json({ success: true, message: 'Contact query submitted, saved, and emailed!', data: query });
  } catch (err) {
    console.error('Error processing contact inquiry:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6a. GET /api/contact — Fetch all contact queries from SQLite DB
router.get('/contact', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM contact_queries ORDER BY date DESC').all();
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6b. PATCH /api/contact/:id/status — Update contact query status in SQLite DB
router.patch('/contact/:id/status', (req, res) => {
  const { status } = req.body;
  try {
    const stmt = db.prepare('UPDATE contact_queries SET status = ? WHERE id = ?');
    const result = stmt.run(status, req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }
    res.json({ success: true, message: `Query status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6c. DELETE /api/contact/:id — Delete contact query from SQLite DB
router.delete('/contact/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM contact_queries WHERE id = ?');
    const result = stmt.run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }
    res.json({ success: true, message: `Query #${req.params.id} deleted successfully!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. GET /api/orders — Fetch orders from SQLite DB (Admin Only)
router.get('/orders', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM orders ORDER BY id DESC').all();
    const formatted = rows.map((r) => ({
      orderId: r.orderId,
      date: r.date,
      total: r.total,
      paymentMethod: r.paymentMethod,
      deliveryOption: r.deliveryOption,
      status: r.status,
      paymentScreenshot: r.paymentScreenshot || null,
      shipping: {
        name: r.customerName,
        phone: r.customerPhone,
        email: r.customerEmail,
        address: r.address,
        city: r.city,
        state: r.state,
        pincode: r.pincode,
      },
      items: r.itemsJson ? JSON.parse(r.itemsJson) : [],
    }));
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. PATCH /api/orders/:id/status — Update order status in SQLite DB
router.patch('/orders/:id/status', (req, res) => {
  const { status } = req.body;
  try {
    const stmt = db.prepare('UPDATE orders SET status = ? WHERE orderId = ?');
    const result = stmt.run(status, req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: `Order ${req.params.id} updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Admin Owner Login
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

// 7. Pincode Lookup
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
