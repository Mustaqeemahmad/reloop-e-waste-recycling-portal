import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
  acceptedCategories: [{ type: String }]
}, { timestamps: true });
export default mongoose.model('Center', schema);
