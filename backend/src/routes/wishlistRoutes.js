// ===== routes/wishlistRoutes.js =====
const express = require('express');
const {
  addToWishlist,
  removeFromWishlist,
  getMyWishlist,
  checkInWishlist
} = require('../controllers/wishlistController');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require CLIENT role
router.get('/me', protect, authorize('CLIENT'), getMyWishlist);
router.get('/check/:propertyId', protect, authorize('CLIENT'), checkInWishlist);
router.post('/:propertyId', protect, authorize('CLIENT'), addToWishlist);
router.delete('/:propertyId', protect, authorize('CLIENT'), removeFromWishlist);

module.exports = router;
