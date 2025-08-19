import { Router } from 'express';
import { authRequired, adminRequired } from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

router.get('/users', authRequired, adminRequired, async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map(u => ({ _id: u._id, email: u.email, displayName: u.displayName, role: u.role, avatarUrl: u.avatarUrl })));
});

router.put('/users/:id/role', authRequired, adminRequired, async (req, res) => {
  if (String(req.user._id) === String(req.params.id) && req.body.role === 'user') {
    return res.status(403).json({ message: 'Forbidden: you cannot revoke your own admin role.' });
  }
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ message: 'User not found' });
  const role = req.body.role;
  if (!['user','admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  u.role = role;
  await u.save();
  res.json({ _id: u._id, email: u.email, displayName: u.displayName, role: u.role, avatarUrl: u.avatarUrl });
});

export default router;
