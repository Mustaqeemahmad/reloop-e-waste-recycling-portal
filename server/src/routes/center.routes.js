import { Router } from 'express';
import Center from '../models/Center.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
router.get('/centers', async (_req, res, next) => {
  try { res.json({ centers: await Center.find().sort({ city: 1, name: 1 }) }); } catch (e) { next(e); }
});
router.post('/centers', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, address, city, phone = '', acceptedCategories = [] } = req.body;
    if (!name?.trim() || !address?.trim() || !city?.trim()) return res.status(400).json({ message: 'Name, address and city are required' });
    const center = await Center.create({ name, address, city, phone, acceptedCategories });
    res.status(201).json({ center });
  } catch (e) { next(e); }
});
router.delete('/centers/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const center = await Center.findByIdAndDelete(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.json({ message: 'Center removed' });
  } catch (e) { next(e); }
});
export default router;
