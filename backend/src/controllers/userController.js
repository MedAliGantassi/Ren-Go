const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, roles, currentRole) => {
  return jwt.sign({ id, roles, currentRole }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const switchRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user._id;

    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If role not in roles, add it
    const upperRole = role.toUpperCase();
    if (!user.roles.includes(upperRole)) {
      user.roles.push(upperRole);
    }
    user.currentRole = upperRole;

    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.roles, user.currentRole);

    res.status(200).json({
      success: true,
      message: `Switched to ${role}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
        currentRole: user.currentRole,
        isActive: user.isActive,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { switchRole };
