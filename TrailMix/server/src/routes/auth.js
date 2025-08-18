import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password || !displayName) return res.status(400).json({ message: 'Missing fields' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });
  const user = new User({ email, displayName, password });
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });
  res.json({ token, user: { _id: user._id, email, displayName, role: user.role, avatarUrl: user.avatarUrl } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.validatePassword(password)) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });
  res.json({ token, user: { _id: user._id, email: user.email, displayName: user.displayName, role: user.role, avatarUrl: user.avatarUrl } });
});

export default router;
