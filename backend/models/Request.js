const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['leave', 'expense', 'general'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
