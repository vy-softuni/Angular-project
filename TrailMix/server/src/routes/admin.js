import { Router } from 'express';
import { authRequired, adminRequired } from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

router.get('/users', authRequired, adminRequired, async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map(u => ({ _id: u._id, email: u.email, displayName: u.displayName, role: u.role })));
});

router.put('/users/:id/role', authRequired, adminRequired, async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ message: 'User not found' });
  const role = req.body.role;
  if (!['user','admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  u.role = role;
  await u.save();
  res.json({ _id: u._id, email: u.email, displayName: u.displayName, role: u.role });
});

export default router;
