import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import User from '../models/User.js';
import Hike from '../models/Hike.js';

const router = Router();

router.get('/me', authRequired, async (req, res) => {
  const u = req.user;
  res.json({ _id: u._id, email: u.email, displayName: u.displayName, avatarUrl: u.avatarUrl, role: u.role });
});

router.put('/me', authRequired, async (req, res) => {
  const u = req.user;
  if (typeof req.body.displayName === 'string') u.displayName = req.body.displayName;
  if (typeof req.body.avatarUrl === 'string') u.avatarUrl = req.body.avatarUrl;
  await u.save();
  res.json({ _id: u._id, email: u.email, displayName: u.displayName, avatarUrl: u.avatarUrl, role: u.role });
});

router.get('/:id', async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ message: 'User not found' });
  res.json({ _id: u._id, email: u.email, displayName: u.displayName, avatarUrl: u.avatarUrl, role: u.role });
});

router.get('/:id/likes', async (req, res) => {
  const hikes = await Hike.find({ likes: req.params.id }).sort({ createdAt: -1 });
  res.json(hikes);
});

export default router;
