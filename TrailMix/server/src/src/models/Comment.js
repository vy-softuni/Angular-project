import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  hikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hike', required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: String,
  content: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
