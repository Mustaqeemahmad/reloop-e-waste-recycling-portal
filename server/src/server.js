import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import centerRoutes from './routes/center.routes.js';
import requestRoutes from './routes/request.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }), authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', centerRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'e-waste-api' }));
app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const port = process.env.PORT || 5000;
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Set MONGO_URI and JWT_SECRET in server/.env');
  process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`E-Waste API running on port ${port}`)))
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
