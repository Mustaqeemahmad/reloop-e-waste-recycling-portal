import { Router } from 'express';
import mongoose from 'mongoose';
import RecyclingRequest from '../models/RecyclingRequest.js';
import Center from '../models/Center.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
const statuses = ['Pending', 'Approved', 'Pickup Scheduled', 'Collected', 'Recycled', 'Rejected', 'Cancelled'];

router.post('/', protect, async (req, res, next) => {
  try {
    const { items, collectionMethod, pickupAddress = '', center: centerId = null, preferredDate, notes = '' } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Add at least one e-waste item' });
    if (!['home_pickup', 'drop_off'].includes(collectionMethod)) return res.status(400).json({ message: 'Choose home pickup or drop-off' });
    if (items.some(i => !i.category?.trim() || !Number.isFinite(Number(i.quantity)) || Number(i.quantity) < 1)) return res.status(400).json({ message: 'Each item needs a category and quantity of at least 1' });
    if (!preferredDate || Number.isNaN(new Date(preferredDate).getTime()) || new Date(preferredDate) < new Date(new Date().toDateString())) return res.status(400).json({ message: 'Choose a valid date today or later' });
    if (collectionMethod === 'home_pickup' && !pickupAddress.trim()) return res.status(400).json({ message: 'Pickup address is required for home pickup' });
    if (collectionMethod === 'drop_off') {
      if (!centerId || !mongoose.isValidObjectId(centerId)) return res.status(400).json({ message: 'Choose a recycling center for drop-off' });
      if (!(await Center.exists({ _id: centerId }))) return res.status(400).json({ message: 'Selected recycling center was not found' });
    }
    const request = await RecyclingRequest.create({
      user: req.user._id, items: items.map(i => ({ category: i.category.trim(), description: (i.description || '').trim(), quantity: Number(i.quantity) })),
      collectionMethod, pickupAddress: collectionMethod === 'home_pickup' ? pickupAddress.trim() : '',
      center: collectionMethod === 'drop_off' ? centerId : null, preferredDate, notes: notes.trim()
    });
    const populated = await request.populate('center', 'name address city phone');
    res.status(201).json({ request: populated });
  } catch (e) { next(e); }
});
router.get('/my', protect, async (req, res, next) => {
  try {
    const requests = await RecyclingRequest.find({ user: req.user._id }).populate('center', 'name address city').sort({ createdAt: -1 });
    res.json({ requests });
  } catch (e) { next(e); }
});
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && statuses.includes(req.query.status)) filter.status = req.query.status;
    const requests = await RecyclingRequest.find(filter).populate('user', 'name email phone').populate('center', 'name address city').sort({ createdAt: -1 }).limit(300);
    res.json({ requests });
  } catch (e) { next(e); }
});
router.patch('/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    const { status, adminNote = '' } = req.body;
    if (!statuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const request = await RecyclingRequest.findByIdAndUpdate(req.params.id, { status, adminNote: String(adminNote).slice(0, 1000) }, { new: true, runValidators: true })
      .populate('user', 'name email phone').populate('center', 'name address city');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json({ request });
  } catch (e) { next(e); }
});
export default router;
