import { Router } from 'express';
import Hike from '../models/Hike.js';
import { authOptional, authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authOptional, async (_req, res) => {
  const hikes = await Hike.find().sort({ createdAt: -1 });
  res.json(hikes);
});

router.get('/:id', authOptional, async (req, res) => {
  const item = await Hike.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.post('/', authRequired, async (req, res) => {
  const payload = { ...req.body, ownerId: req.user._id };
  const item = await Hike.create(payload);
  res.status(201).json(item);
});

router.put('/:id', authRequired, async (req, res) => {
  const item = await Hike.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  if (String(item.ownerId) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  Object.assign(item, req.body);
  await item.save();
  res.json(item);
});

router.delete('/:id', authRequired, async (req, res) => {
  const item = await Hike.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  if (String(item.ownerId) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await item.deleteOne();
  res.status(204).end();
});

router.post('/:id/like', authRequired, async (req, res) => {
  const item = await Hike.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  if (!item.likes.map(String).includes(String(req.user._id))) item.likes.push(req.user._id);
  await item.save();
  res.json({ likes: item.likes });
});

router.post('/:id/unlike', authRequired, async (req, res) => {
  const item = await Hike.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  item.likes = item.likes.filter(u => String(u) !== String(req.user._id));
  await item.save();
  res.json({ likes: item.likes });
});

export default router;
