// ===== routes/adminRoutes.js =====
const express = require('express');
const {
  getCommissionRate,
  updateCommissionRate
} = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// ADMIN only routes
router.get('/commission', protect, authorize('ADMIN'), getCommissionRate);
router.put('/commission', protect, authorize('ADMIN'), updateCommissionRate);

module.exports = router;
