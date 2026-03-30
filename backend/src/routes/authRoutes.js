const express = require('express');
const { register, login } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected test route
router.get('/me', protect, (req, res) => {
  res.json({
    message: '✅ Authentication successful!',
    user: req.user
  });
});

module.exports = router;