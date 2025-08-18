import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authOptional = async (req, _res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return next();
  try {
    const d = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    req.user = await User.findById(d.id);
  } catch {}
  next();
};

export const authRequired = async (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const d = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    req.user = await User.findById(d.id);
    if (!req.user) return res.status(401).json({ message: 'Invalid token' });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminRequired = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};
