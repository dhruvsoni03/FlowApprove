const express = require('express');
const { getEmployeeDashboard, getManagerDashboard, getAdminDashboard } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/employee', protect, getEmployeeDashboard);
router.get('/manager', protect, authorize('manager', 'admin'), getManagerDashboard);
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

module.exports = router;
