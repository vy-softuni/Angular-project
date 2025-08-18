import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import hikeRoutes from './routes/hikes.js';
import commentRoutes from './routes/comments.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';

const app = express();

app.use(cors({ origin: [/^http:\/\/localhost:4200$/, /^http:\/\/127\.0\.0\.1:4200$/], credentials: false }));
app.options('*', cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ ok: true, service: 'TrailMix Pro API' }));

app.use('/api/auth', authRoutes);
app.use('/api/hikes', hikeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trailmixpro';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Mongo connected');

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
        location:{lat:42.563,lng:23.287,name:'Vitosha'},
        distanceKm:12.5,
        difficulty:'moderate',
        images:['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop'],
        ownerId: demo._id
      },
      {
        title:'Rila Seven Lakes',
        description:'Classic route visiting the Seven Rila Lakes.',
        location:{lat:42.194,lng:23.303,name:'Rila Lakes'},
        distanceKm:13.2,
        difficulty:'moderate',
        images:['https://images.unsplash.com/photo-1520350094750-5a1b8f4e9b35?w=1200&auto=format&fit=crop'],
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
