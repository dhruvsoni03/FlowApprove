const express = require('express');
const { createRequest, getRequests, getRequestById, approveRequest, rejectRequest } = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, createRequest)
  .get(protect, getRequests);

router.route('/:id')
  .get(protect, getRequestById);

router.post('/:id/approve', protect, authorize('manager', 'admin'), approveRequest);
router.post('/:id/reject', protect, authorize('manager', 'admin'), rejectRequest);

module.exports = router;
