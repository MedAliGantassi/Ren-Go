// ===== routes/reservationRoutes.js =====
const express = require('express');
const {
  createReservation,
  getMyReservations,
  cancelReservation,
  getReservationById,
  checkAvailability
} = require('../controllers/reservationController');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public route - check availability
router.get('/check-availability', checkAvailability);

// Protected routes - CLIENT only
router.post('/', protect, authorize('CLIENT'), createReservation);
router.get('/my', protect, authorize('CLIENT'), getMyReservations);
router.delete('/:id', protect, authorize('CLIENT'), cancelReservation);

// Protected route - CLIENT, PROPRIETAIRE, or ADMIN
router.get('/:id', protect, getReservationById);

module.exports = router;
