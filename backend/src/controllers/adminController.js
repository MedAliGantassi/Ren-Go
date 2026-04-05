// ===== controllers/adminController.js =====
const Config = require('../models/Config');

/**
 * @desc    Get current commission rate
 * @route   GET /api/admin/commission
 * @access  Private (ADMIN only)
 */
const getCommissionRate = async (req, res) => {
  try {
    const rate = await Config.getCommissionRate();
    
    res.status(200).json({
      success: true,
      data: {
        commissionRate: rate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update commission rate
 * @route   PUT /api/admin/commission
 * @access  Private (ADMIN only)
 */
const updateCommissionRate = async (req, res) => {
  try {
    const { commissionRate } = req.body;

    // Validation
    if (commissionRate === undefined || commissionRate === null) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir le taux de commission'
      });
    }

    if (commissionRate < 0 || commissionRate > 100) {
      return res.status(400).json({
        success: false,
        message: 'Le taux de commission doit être entre 0 et 100'
      });
    }

    const config = await Config.updateCommissionRate(commissionRate);

    res.status(200).json({
      success: true,
      message: `Taux de commission mis à jour: ${commissionRate}%`,
      data: {
        commissionRate: config.commissionRate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getCommissionRate,
  updateCommissionRate
};
