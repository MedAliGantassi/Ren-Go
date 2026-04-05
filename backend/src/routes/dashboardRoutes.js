// ===== routes/dashboardRoutes.js =====
const express = require('express');
const {
  getClientDashboard,
  getProprietaireDashboard,
  getAdminDashboard
} = require('../controllers/dashboardController');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/client', protect, authorize('CLIENT'), getClientDashboard);
router.get('/proprietaire', protect, authorize('PROPRIETAIRE'), getProprietaireDashboard);
router.get('/admin', protect, authorize('ADMIN'), getAdminDashboard);

module.exports = router;
