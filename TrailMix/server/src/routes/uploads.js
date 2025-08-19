import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authRequired } from '../middleware/auth.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), 'uploads')),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safe = (file.originalname || 'upload').replace(/[^a-z0-9\.\-_]+/gi, '_').slice(-60);
    const name = Date.now() + '_' + safe.replace(ext, '') + ext;
    cb(null, name);
  }
});
const MAX_MB = parseInt(process.env.UPLOAD_MAX_MB || '50', 10);
const upload = multer({ storage, limits: { fileSize: MAX_MB * 1024 * 1024 }, fileFilter: (_req, _file, cb) => cb(null, true) });

router.post('/image', authRequired, upload.single('image'), (req, res) => {
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});

router.delete('/', authRequired, (req, res) => {
  const url = req.query.url;
  if (!url || typeof url !== 'string') return res.status(400).json({ message: 'url query required' });
  if (!url.startsWith('/uploads/')) return res.status(400).json({ message: 'Not a local upload' });
  const filePath = path.join(process.cwd(), url.replace('/uploads/', 'uploads/'));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  res.status(204).end();
});

router.use((err, _req, res, _next) => {
  if (err && (err.code === 'LIMIT_FILE_SIZE' || err.message?.includes('File too large'))) {
    const maxMb = parseInt(process.env.UPLOAD_MAX_MB || '50', 10);
    return res.status(413).json({ message: `File too large. Max ${maxMb} MB.` });
  }
  if (err) return res.status(400).json({ message: err.message || 'Upload failed' });
  res.status(500).json({ message: 'Upload failed' });
});

export default router;
