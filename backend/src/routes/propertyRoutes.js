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

// Protected routes - FOURNISSEUR only
router.post('/', protect, authorize('FOURNISSEUR'), createProperty);
router.put('/:id', protect, authorize('FOURNISSEUR'), updateProperty);

// Protected routes - FOURNISSEUR or ADMIN can delete
router.delete('/:id', protect, authorize('FOURNISSEUR', 'ADMIN'), deleteProperty);

module.exports = router;
