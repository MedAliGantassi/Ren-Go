// ===== controllers/messageController.js =====
const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const { createNotification } = require('./notificationController');

const sanitizeContent = (value) => {
  return String(value || '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const isClientProprietairePair = (roleA, roleB) => {
  return (
    (roleA === 'CLIENT' && roleB === 'PROPRIETAIRE') ||
    (roleA === 'PROPRIETAIRE' && roleB === 'CLIENT')
  );
};

const sendMessage = async (req, res) => {
  try {
    const { receiver, content, reservation } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({
        success: false,
        message: 'receiver and content are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid receiver id'
      });
    }

    if (reservation && !mongoose.Types.ObjectId.isValid(reservation)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reservation id'
      });
    }

    if (req.user.role === 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admins are not allowed to send messages'
      });
    }

    if (req.user._id.toString() === receiver.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot message yourself'
      });
    }

    const receiverUser = await User.findById(receiver).select('name role isActive');
    if (!receiverUser || !receiverUser.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    if (receiverUser.role === 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Cannot send messages to admin'
      });
    }

    if (!isClientProprietairePair(req.user.role, receiverUser.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only CLIENT and PROPRIETAIRE can communicate'
      });
    }

    let linkedReservation = null;
    if (reservation) {
      linkedReservation = await Reservation.findById(reservation)
        .populate('property', 'owner');

      if (!linkedReservation) {
        return res.status(404).json({
          success: false,
          message: 'Reservation not found'
        });
      }

      const isReservationClient = linkedReservation.client.toString() === req.user._id.toString()
        || linkedReservation.client.toString() === receiver.toString();
      const propertyOwnerId = linkedReservation.property?.owner?.toString();
      const isReservationOwner = propertyOwnerId === req.user._id.toString()
        || propertyOwnerId === receiver.toString();

      if (!isReservationClient || !isReservationOwner) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized reservation link'
        });
      }
    }

    const cleanContent = sanitizeContent(content);
    if (!cleanContent) {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty'
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      reservation: reservation || null,
      content: cleanContent
    });

    await message.populate([
      { path: 'sender', select: 'name role' },
      { path: 'receiver', select: 'name role' },
      { path: 'reservation', select: 'dateDebut dateFin status totalPrice' }
    ]);

    await createNotification({
      user: receiver,
      type: 'SYSTEM',
      message: `New message from ${req.user.name}`,
      relatedId: message._id
    });

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id'
      });
    }

    if (req.user._id.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation user'
      });
    }

    const otherUser = await User.findById(userId).select('role isActive');
    if (!otherUser || !otherUser.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!isClientProprietairePair(req.user.role, otherUser.role)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized conversation access'
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
      .populate('sender', 'name role')
      .populate('receiver', 'name role')
      .populate('reservation', 'dateDebut dateFin status')
      .sort({ createdAt: 1 });

    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        isRead: false
      },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMyConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        }
      },
      {
        $addFields: {
          conversationUser: {
            $cond: [{ $eq: ['$sender', currentUserId] }, '$receiver', '$sender']
          }
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationUser',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', currentUserId] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { 'lastMessage.createdAt': -1 } }
    ]);

    const userIds = conversations.map((c) => c._id);
    const users = await User.find({ _id: { $in: userIds } }).select('name role');
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const data = conversations
      .filter((c) => {
        const peer = userMap.get(c._id.toString());
        if (!peer) return false;
        return isClientProprietairePair(req.user.role, peer.role);
      })
      .map((c) => ({
        user: userMap.get(c._id.toString()),
        lastMessage: {
          _id: c.lastMessage._id,
          sender: c.lastMessage.sender,
          receiver: c.lastMessage.receiver,
          reservation: c.lastMessage.reservation,
          content: c.lastMessage.content,
          isRead: c.lastMessage.isRead,
          createdAt: c.lastMessage.createdAt
        },
        unreadCount: c.unreadCount
      }));

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message id'
      });
    }

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only receiver can mark message as read'
      });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getMyConversations,
  markAsRead
};
