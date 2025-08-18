import mongoose from 'mongoose';

const hikeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { lat: Number, lng: Number, name: String },
  distanceKm: Number,
  elevationGainM: Number,
  difficulty: { type: String, enum: ['easy', 'moderate', 'hard'], default: 'easy' },
  images: [String],
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('Hike', hikeSchema);
