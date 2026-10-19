import { Router } from 'express';
import User from '../models/User.js';
import Center from '../models/Center.js';
import RecyclingRequest from '../models/RecyclingRequest.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
router.get('/stats', protect, adminOnly, async (_req, res, next) => {
  try {
    const [users, centers, requests, pending, completed, statusCounts] = await Promise.all([
      User.countDocuments({ role: 'user' }), Center.countDocuments(), RecyclingRequest.countDocuments(),
      RecyclingRequest.countDocuments({ status: 'Pending' }),
      RecyclingRequest.countDocuments({ status: { $in: ['Collected', 'Recycled'] } }),
      RecyclingRequest.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }, { $sort: { _id: 1 } }])
    ]);
    res.json({ stats: { users, centers, requests, pending, completed, statusCounts } });
  } catch (e) { next(e); }
});
export default router;
