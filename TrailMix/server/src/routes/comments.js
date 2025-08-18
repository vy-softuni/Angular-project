import { Router } from 'express';
import { authOptional, authRequired } from '../middleware/auth.js';
import Comment from '../models/Comment.js';
import Hike from '../models/Hike.js';

const router = Router();

router.get('/:hikeId', authOptional, async (req, res) => {
  const list = await Comment.find({ hikeId: req.params.hikeId }).sort({ createdAt: -1 });
  res.json(list.map(c => ({
    _id: c._id, hikeId: c.hikeId, authorId: c.authorId,
    authorName: c.authorName, content: c.content, createdAt: c.createdAt
  })));
});

router.post('/:hikeId', authRequired, async (req, res) => {
  const hike = await Hike.findById(req.params.hikeId);
  if (!hike) return res.status(404).json({ message: 'Hike not found' });
  if (!req.body.content?.trim()) return res.status(400).json({ message: 'Content required' });
  const c = await Comment.create({
    hikeId: hike._id,
    authorId: req.user._id,
    authorName: req.user.displayName,
    content: req.body.content.trim()
  });
  res.status(201).json({
    _id: c._id, hikeId: c.hikeId, authorId: c.authorId,
    authorName: c.authorName, content: c.content, createdAt: c.createdAt
  });
});

router.delete('/item/:id', authRequired, async (req, res) => {
  const c = await Comment.findById(req.params.id);
  if (!c) return res.status(404).json({ message: 'Comment not found' });
  if (String(c.authorId) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await c.deleteOne();
  res.status(204).end();
});

export default router;
