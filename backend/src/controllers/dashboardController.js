// ===== controllers/dashboardController.js =====
const Property = require('../models/Property');
const Reservation = require('../models/Reservation');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const { sendErrorResponse } = require('../config/validators');

/**
 * @desc    Get CLIENT dashboard statistics
 * @route   GET /api/dashboard/client
 * @access  Private (CLIENT only)
 */
const getClientDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get reservation stats
    const [totalReservations, activeReservations, completedReservations, cancelledReservations] = await Promise.all([
      Reservation.countDocuments({ client: userId }),
      Reservation.countDocuments({ client: userId, status: { $in: ['EN_ATTENTE', 'CONFIRMEE'] } }),
      Reservation.countDocuments({ client: userId, status: 'CONFIRMEE', dateFin: { $lt: new Date() } }),
      Reservation.countDocuments({ client: userId, status: 'ANNULEE' })
    ]);

    // Get total spent
    const paymentStats = await Payment.aggregate([
      { $match: { client: userId, status: 'SUCCESS' } },
      { $group: { _id: null, totalSpent: { $sum: '$amount' }, totalPayments: { $sum: 1 } } }
    ]);

    const totalSpent = paymentStats.length > 0 ? paymentStats[0].totalSpent : 0;
    const totalPayments = paymentStats.length > 0 ? paymentStats[0].totalPayments : 0;

    // Get recent reservations
    const recentReservations = await Reservation.find({ client: userId })
      .populate('property', 'titre images localisation prix')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get reviews count
    const reviewsCount = await Review.countDocuments({ reviewer: userId });

    res.status(200).json({
      success: true,
      data: {
        reservations: {
          total: totalReservations,
          active: activeReservations,
          completed: completedReservations,
          cancelled: cancelledReservations
        },
        payments: {
          total: totalPayments,
          totalSpent
        },
        reviews: {
          total: reviewsCount
        },
        recentReservations
      }
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get PROPRIETAIRE dashboard statistics
 * @route   GET /api/dashboard/proprietaire
 * @access  Private (PROPRIETAIRE only)
 */
const getProprietaireDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get property stats
    const [totalProperties, activeProperties, inactiveProperties] = await Promise.all([
      Property.countDocuments({ owner: userId }),
      Property.countDocuments({ owner: userId, isActive: true }),
      Property.countDocuments({ owner: userId, isActive: false })
    ]);

    // Get properties for reservation lookup
    const userProperties = await Property.find({ owner: userId }).select('_id');
    const propertyIds = userProperties.map(p => p._id);

    // Get reservation stats
    const [totalReservations, pendingReservations, confirmedReservations] = await Promise.all([
      Reservation.countDocuments({ property: { $in: propertyIds } }),
      Reservation.countDocuments({ property: { $in: propertyIds }, status: 'EN_ATTENTE' }),
      Reservation.countDocuments({ property: { $in: propertyIds }, status: 'CONFIRMEE' })
    ]);

    // Get earnings (net amount after commission)
    const earningsStats = await Payment.aggregate([
      {
        $lookup: {
          from: 'reservations',
          localField: 'reservation',
          foreignField: '_id',
          as: 'reservationData'
        }
      },
      { $unwind: '$reservationData' },
      {
        $match: {
          'reservationData.property': { $in: propertyIds },
          status: 'SUCCESS'
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$netAmount' },
          totalCommission: { $sum: '$commissionAmount' },
          totalRevenue: { $sum: '$amount' },
          totalPayments: { $sum: 1 }
        }
      }
    ]);

    const earnings = earningsStats.length > 0 ? earningsStats[0] : {
      totalEarnings: 0,
      totalCommission: 0,
      totalRevenue: 0,
      totalPayments: 0
    };

    // Get recent reservations
    const recentReservations = await Reservation.find({ property: { $in: propertyIds } })
      .populate('property', 'titre localisation')
      .populate('client', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get average rating
    const ratingStats = await Review.aggregate([
      { $match: { property: { $in: propertyIds } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]);

    const avgRating = ratingStats.length > 0 ? Math.round(ratingStats[0].avgRating * 10) / 10 : 0;
    const totalReviews = ratingStats.length > 0 ? ratingStats[0].totalReviews : 0;

    res.status(200).json({
      success: true,
      data: {
        properties: {
          total: totalProperties,
          active: activeProperties,
          inactive: inactiveProperties
        },
        reservations: {
          total: totalReservations,
          pending: pendingReservations,
          confirmed: confirmedReservations
        },
        earnings: {
          net: earnings.totalEarnings,
          commission: earnings.totalCommission,
          gross: earnings.totalRevenue,
          paymentsCount: earnings.totalPayments
        },
        reviews: {
          average: avgRating,
          total: totalReviews
        },
        recentReservations
      }
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get ADMIN dashboard statistics
 * @route   GET /api/dashboard/admin
 * @access  Private (ADMIN only)
 */
const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalProperties,
      totalReservations,
      totalPayments,
      totalReviews
    ] = await Promise.all([
      Property.countDocuments(),
      Reservation.countDocuments(),
      Payment.countDocuments({ status: 'SUCCESS' }),
      Review.countDocuments()
    ]);

    // Commission earned
    const commissionStats = await Payment.aggregate([
      { $match: { status: 'SUCCESS' } },
      {
        $group: {
          _id: null,
          totalCommission: { $sum: '$commissionAmount' },
          totalRevenue: { $sum: '$amount' }
        }
      }
    ]);

    const commission = commissionStats.length > 0 ? commissionStats[0] : {
      totalCommission: 0,
      totalRevenue: 0
    };

    // Reservation stats by status
    const reservationsByStatus = await Reservation.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusBreakdown = {
      EN_ATTENTE: 0,
      CONFIRMEE: 0,
      ANNULEE: 0
    };
    reservationsByStatus.forEach(item => {
      statusBreakdown[item._id] = item.count;
    });

    // Recent activity
    const recentReservations = await Reservation.find()
      .populate('property', 'titre')
      .populate('client', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalProperties,
          totalReservations,
          totalPayments,
          totalReviews
        },
        revenue: {
          totalCommission: commission.totalCommission,
          totalPlatformRevenue: commission.totalRevenue
        },
        reservations: statusBreakdown,
        recentActivity: recentReservations
      }
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = {
  getClientDashboard,
  getProprietaireDashboard,
  getAdminDashboard
};
