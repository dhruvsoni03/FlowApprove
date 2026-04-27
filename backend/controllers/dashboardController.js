const Request = require('../models/Request');
const User = require('../models/User');

exports.getEmployeeDashboard = async (req, res) => {
  try {
    const total = await Request.countDocuments({ userId: req.user.id });
    const pending = await Request.countDocuments({ userId: req.user.id, status: 'pending' });
    const approved = await Request.countDocuments({ userId: req.user.id, status: 'approved' });
    const rejected = await Request.countDocuments({ userId: req.user.id, status: 'rejected' });
    
    res.status(200).json({ success: true, summary: { total, pending, approved, rejected } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getManagerDashboard = async (req, res) => {
  try {
    const pendingApprovals = await Request.countDocuments({ assignedTo: req.user.id, status: 'pending' });
    const totalProcessed = await Request.countDocuments({ assignedTo: req.user.id, status: { $ne: 'pending' } });
    
    res.status(200).json({ success: true, summary: { pendingApprovals, totalProcessed } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const totalUsers = await User.countDocuments();
    
    res.status(200).json({ success: true, summary: { totalRequests, pendingRequests, totalUsers } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
