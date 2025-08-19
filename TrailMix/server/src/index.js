import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.js';
import hikeRoutes from './routes/hikes.js';
import commentRoutes from './routes/comments.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import uploadsRoutes from './routes/uploads.js';

const app = express();

app.use(cors({ origin: [/^http:\/\/localhost:4200$/, /^http:\/\/127\.0\.0\.1:4200$/], credentials: false }));
app.options('*', cors());
app.use(express.json());
app.use(morgan('dev'));

// Static for uploads
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

// Seeds directory
const seedDir = path.join(__dirname, '..', 'seed-images');
function seedUpload(name) {
  const src = path.join(seedDir, name);
  const dest = path.join(UPLOAD_DIR, name);
  if (fs.existsSync(src) && !fs.existsSync(dest)) fs.copyFileSync(src, dest);
  return `/uploads/${name}`;
}
function ensureSeedUploads() {
  seedUpload('vitosha.png');
  seedUpload('rila-seven-lakes.png');
  seedUpload('musala.png');
}

app.get('/', (_req, res) => res.json({ ok: true, service: 'TrailMix Pro API' }));

app.use('/api/auth', authRoutes);
app.use('/api/hikes', hikeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadsRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trailmixpro';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Mongo connected');
  ensureSeedUploads();

  const { default: User } = await import('./models/User.js');
  const { default: Hike } = await import('./models/Hike.js');

  const usersCount = await User.countDocuments();
  if (usersCount === 0) {
    const admin = await User.create({ email: 'admin@trailmix.dev', displayName: 'Admin', role: 'admin', password: 'adminpass' });
    const demo = await User.create({ email: 'demo@trailmix.dev', displayName: 'Demo', role: 'user', password: 'demopass' });

    await Hike.create([
      {
        title:'Vitosha Ring',
        description:'Scenic loop around Vitosha mountain with city views.',
        location:{lat:42.5647,lng:23.2916,name:'Vitosha - Cherni Vrah area'},
        distanceKm:12.5,
        difficulty:'moderate',
        images:[seedUpload('vitosha.png')],
        ownerId: demo._id
      },
      {
        title:'Rila Seven Lakes',
        description:'Classic route visiting the Seven Rila Lakes.',
        location:{lat:42.2048,lng:23.3042,name:'Rila Seven Lakes'},
        distanceKm:13.2,
        difficulty:'moderate',
        images:[seedUpload('rila-seven-lakes.png')],
        ownerId: demo._id
      },
      {
        title:'Musala Peak',
        description:'Highest peak in the Balkans (2925 m). Route from Borovets / Yastrebets.',
        location:{lat:42.1799,lng:23.5850,name:'Rila - Musala'},
        distanceKm:14.0,
        difficulty:'hard',
        images:[seedUpload('musala.png')],
        ownerId: demo._id
      }
    ]);
    console.log('Seeded admin + demo users and hikes');
  }

  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Mongo connection error:', err);
  process.exit(1);
});
