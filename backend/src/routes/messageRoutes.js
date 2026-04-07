// ===== routes/messageRoutes.js =====
const express = require('express');
const protect = require('../middleware/authMiddleware');
const {
  sendMessage,
  getConversation,
  getMyConversations,
  markAsRead
} = require('../controllers/messageController');

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/:userId', getConversation);
router.get('/', getMyConversations);
router.put('/:id/read', markAsRead);

module.exports = router;
