// ===== routes/propertyRoutes.js =====
const express = require('express');
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Protected routes - PROPRIETAIRE only
router.post('/', protect, authorize('PROPRIETAIRE'), createProperty);
router.put('/:id', protect, authorize('PROPRIETAIRE', 'ADMIN'), updateProperty);

// Protected routes - PROPRIETAIRE or ADMIN can delete
router.delete('/:id', protect, authorize('PROPRIETAIRE', 'ADMIN'), deleteProperty);

module.exports = router;
