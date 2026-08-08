import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { initDatabase } from './database/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize SQLite Database Schema & Initial Data
initDatabase();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Root Status Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'TeeVerse Node.js Express API Server (SQLite Database Powered)',
    version: '1.0.0',
    ownerEmail: 'teenesttt@gmail.com',
    database: 'SQLite (server/database/teeverse.db)',
    endpoints: {
      products: 'GET /api/products',
      createOrder: 'POST /api/orders (Saves to SQLite & emails teenesttt@gmail.com)',
      orders: 'GET /api/orders',
      adminLogin: 'POST /api/admin/login',
    },
  });
});

// Start Node.js Express Server
app.listen(PORT, () => {
  console.log(`\n🚀 TeeVerse Node.js Express Server running on http://localhost:${PORT}`);
  console.log(`🗄️ SQLite Database Active: server/database/teeverse.db`);
  console.log(`📧 Order notifications target email: teenesttt@gmail.com\n`);
});
