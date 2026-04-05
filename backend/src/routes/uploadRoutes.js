// ===== routes/uploadRoutes.js =====
const express = require('express');
const {
  uploadPropertyImage,
  uploadMultipleImages,
  deleteImage
} = require('../controllers/uploadController');
const upload = require('../config/upload');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Single image upload
router.post(
  '/single',
  protect,
  authorize('PROPRIETAIRE'),
  upload.single('image'),
  uploadPropertyImage
);

// Multiple images upload (max 5)
router.post(
  '/multiple',
  protect,
  authorize('PROPRIETAIRE'),
  upload.array('images', 5),
  uploadMultipleImages
);

// Delete image
router.delete(
  '/:filename',
  protect,
  authorize('PROPRIETAIRE'),
  deleteImage
);

module.exports = router;
