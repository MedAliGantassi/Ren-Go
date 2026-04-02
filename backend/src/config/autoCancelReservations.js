// ===== utils/autoCancelReservations.js =====
const Reservation = require('../models/Reservation');

const HOURS_48_IN_MS = 48 * 60 * 60 * 1000;
const CHECK_INTERVAL = 60 * 60 * 1000; // Run every 1 hour

/**
 * Cancel reservations that are EN_ATTENTE for more than 48 hours
 */
const cancelExpiredReservations = async () => {
  try {
    const now = new Date();
    const expiryTime = new Date(now.getTime() - HOURS_48_IN_MS);

    const result = await Reservation.updateMany(
      {
        status: 'EN_ATTENTE',
        createdAt: { $lt: expiryTime }
      },
      {
        $set: { status: 'ANNULEE' }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Auto-cancel: ${result.modifiedCount} reservation(s) cancelled (older than 48h)`);
    } else {
      console.log('⏰ Auto-cancel: No expired reservations found');
    }

    return result.modifiedCount;
  } catch (error) {
    console.error('❌ Auto-cancel error:', error.message);
    return 0;
  }
};

/**
 * Start the auto-cancel scheduler
 */
const startAutoCancelScheduler = () => {
  console.log('🔄 Auto-cancel scheduler started (runs every 1 hour)');
  
  // Run immediately on startup
  cancelExpiredReservations();
  
  // Then run every hour
  setInterval(cancelExpiredReservations, CHECK_INTERVAL);
};

module.exports = { startAutoCancelScheduler, cancelExpiredReservations };
