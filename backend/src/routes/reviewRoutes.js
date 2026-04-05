// ===== routes/reviewRoutes.js =====
const express = require('express');
const {
  createReview,
  getPropertyReviews,
  getMyReviews,
  deleteReview
} = require('../controllers/reviewController');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.get('/property/:propertyId', getPropertyReviews);

// CLIENT only routes
router.post('/', protect, authorize('CLIENT'), createReview);
router.get('/me', protect, authorize('CLIENT'), getMyReviews);

// CLIENT or ADMIN can delete
router.delete('/:id', protect, authorize('CLIENT', 'ADMIN'), deleteReview);

module.exports = router;
