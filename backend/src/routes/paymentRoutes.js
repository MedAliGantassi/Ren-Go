// ===== routes/paymentRoutes.js =====
const express = require('express');
const {
  createOnlinePayment,
  confirmCashPayment,
  getMyPayments,
  getReceivedPayments
} = require('../controllers/paymentController');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// CLIENT routes
router.post('/online', protect, authorize('CLIENT'), createOnlinePayment);
router.get('/my', protect, authorize('CLIENT'), getMyPayments);

// PROPRIETAIRE routes
router.put('/cash/:reservationId/confirm', protect, authorize('PROPRIETAIRE'), confirmCashPayment);
router.get('/received', protect, authorize('PROPRIETAIRE'), getReceivedPayments);

module.exports = router;
