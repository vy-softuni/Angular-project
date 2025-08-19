import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  displayName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  avatarUrl: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

userSchema.virtual('password').set(function(pw) { this.passwordHash = bcrypt.hashSync(pw, 10); });
userSchema.methods.validatePassword = function(pw) { return bcrypt.compareSync(pw, this.passwordHash); };

export default mongoose.model('User', userSchema);
