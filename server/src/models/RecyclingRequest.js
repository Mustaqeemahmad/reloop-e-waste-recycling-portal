import mongoose from 'mongoose';
const itemSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  quantity: { type: Number, required: true, min: 1, max: 10000 }
}, { _id: false });
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [itemSchema], validate: v => v.length > 0 },
  collectionMethod: { type: String, enum: ['home_pickup', 'drop_off'], required: true },
  pickupAddress: { type: String, trim: true, default: '' },
  center: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', default: null },
  preferredDate: { type: Date, required: true },
  notes: { type: String, trim: true, maxlength: 1000, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Pickup Scheduled', 'Collected', 'Recycled', 'Rejected', 'Cancelled'], default: 'Pending', index: true },
  adminNote: { type: String, trim: true, maxlength: 1000, default: '' }
}, { timestamps: true });
export default mongoose.model('RecyclingRequest', schema);
