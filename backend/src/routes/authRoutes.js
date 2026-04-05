const express = require('express');
const { register, login, verifyEmail, resendVerification } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected test route
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    message: '✅ Authentication successful!',
    user: req.user
  });
});

module.exports = router;