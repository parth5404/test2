import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  from: { type: String, ref: 'User', required: true },
  to: { type: String, ref: 'User', required: true },
  message: { type: String },
  razorpayPaymentId: { type: String, required: true },
  razorpayOrderId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
