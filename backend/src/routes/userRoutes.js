const express = require('express');
const { switchRole } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.patch('/switch-role', protect, switchRole);

module.exports = router;
