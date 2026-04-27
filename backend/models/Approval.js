const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  approverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['approved', 'rejected'], required: true },
  comment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Approval', approvalSchema);
