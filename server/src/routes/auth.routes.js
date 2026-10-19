import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
const router = Router();
const publicUser = user => ({ id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role });
const issueToken = user => jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone = '' } = req.body;
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists' });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, phone, passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: issueToken(user), user: publicUser(user) });
  } catch (e) { next(e); }
});
router.post('/login', async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !password || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: issueToken(user), user: publicUser(user) });
  } catch (e) { next(e); }
});
router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));
export default router;
