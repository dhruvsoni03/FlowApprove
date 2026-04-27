const Request = require('../models/Request');
const User = require('../models/User');
const Approval = require('../models/Approval');
const Notification = require('../models/Notification');

exports.createRequest = async (req, res) => {
  try {
    const { type, title, description, amount } = req.body;
    let assignedTo;
    
    const currentUser = await User.findById(req.user.id);
    
    // Dynamic Routing Logic: if amount > 5000 -> admin, else manager
    if (amount && amount > 5000) {
      const admin = await User.findOne({ role: 'admin' });
      assignedTo = admin ? admin._id : currentUser.managerId;
    } else {
      assignedTo = currentUser.managerId;
    }

    // Fallback if no manager found, assign to first manager or admin
    if (!assignedTo) {
      const anyManager = await User.findOne({ role: { $in: ['manager', 'admin'] } });
      if (anyManager) assignedTo = anyManager._id;
    }

    const request = await Request.create({
      userId: req.user.id,
      type, title, description, amount, assignedTo
    });

    if (assignedTo) {
      const notif = await Notification.create({ 
        userId: assignedTo, 
        message: `New request from ${currentUser.name}: ${title}` 
      });
      const io = req.app.get('io');
      io.to(assignedTo.toString()).emit('notification', notif);
      io.to(assignedTo.toString()).emit('new_request', request);
    }

    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRequests = async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'employee') {
      requests = await Request.find({ userId: req.user.id }).populate('assignedTo', 'name');
    } else if (req.user.role === 'manager') {
      requests = await Request.find({ assignedTo: req.user.id }).populate('userId', 'name');
    } else {
      requests = await Request.find().populate('userId', 'name').populate('assignedTo', 'name');
    }
    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    const approvals = await Approval.find({ requestId: request._id }).populate('approverId', 'name');
    
    res.status(200).json({ success: true, request, approvals });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const { comment } = req.body;
    const request = await Request.findById(req.params.id);
    
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ message: 'Request already processed' });
    if (req.user.role !== 'admin' && request.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to approve this request' });
    }

    request.status = 'approved';
    await request.save();

    await Approval.create({
      requestId: request._id,
      approverId: req.user.id,
      action: 'approved',
      comment
    });

    const notif = await Notification.create({ 
      userId: request.userId, 
      message: `Your request "${request.title}" has been approved.` 
    });
    
    const io = req.app.get('io');
    io.to(request.userId.toString()).emit('notification', notif);
    io.to(request.userId.toString()).emit('request_updated', request);

    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { comment } = req.body;
    const request = await Request.findById(req.params.id);
    
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ message: 'Request already processed' });
    if (req.user.role !== 'admin' && request.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    request.status = 'rejected';
    await request.save();

    await Approval.create({
      requestId: request._id,
      approverId: req.user.id,
      action: 'rejected',
      comment
    });

    const notif = await Notification.create({ 
      userId: request.userId, 
      message: `Your request "${request.title}" has been rejected.` 
    });
    
    const io = req.app.get('io');
    io.to(request.userId.toString()).emit('notification', notif);
    io.to(request.userId.toString()).emit('request_updated', request);

    res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
