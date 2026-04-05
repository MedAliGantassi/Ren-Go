// ===== config/autoCancelReservations.js =====
const Reservation = require('../models/Reservation');

const CHECK_INTERVAL = 60 * 60 * 1000; // Run every 1 hour

/**
 * Cancel reservations based on each property's cancellationDelay
 * Dynamically reads property.cancellationDelay (24h or 48h)
 */
const cancelExpiredReservations = async () => {
  try {
    const now = new Date();
    let totalCancelled = 0;

    // Get all EN_ATTENTE reservations with their property
    const pendingReservations = await Reservation.find({ status: 'EN_ATTENTE' })
      .populate('property', 'cancellationDelay titre');

    for (const reservation of pendingReservations) {
      // Get cancellation delay from property (default 48h if not set)
      const cancellationDelay = reservation.property?.cancellationDelay || 48;
      const delayInMs = cancellationDelay * 60 * 60 * 1000;
      
      // Calculate expiry time based on property's cancellation delay
      const expiryTime = new Date(reservation.createdAt.getTime() + delayInMs);

      // If current time is past expiry, cancel the reservation
      if (now > expiryTime) {
        reservation.status = 'ANNULEE';
        await reservation.save();
        totalCancelled++;
        console.log(`⏰ Auto-cancelled: Reservation ${reservation._id} (Property: ${reservation.property?.titre || 'N/A'}, Delay: ${cancellationDelay}h)`);
      }
    }

    if (totalCancelled > 0) {
      console.log(`✅ Auto-cancel: ${totalCancelled} reservation(s) cancelled`);
    } else {
      console.log('⏰ Auto-cancel: No expired reservations found');
    }

    return totalCancelled;
  } catch (error) {
    console.error('❌ Auto-cancel error:', error.message);
    return 0;
  }
};

/**
 * Start the auto-cancel scheduler
 */
const startAutoCancelScheduler = () => {
  console.log('🔄 Auto-cancel scheduler started (runs every 1 hour, dynamic per property)');
  
  // Run immediately on startup
  cancelExpiredReservations();
  
  // Then run every hour
  setInterval(cancelExpiredReservations, CHECK_INTERVAL);
};

module.exports = { startAutoCancelScheduler, cancelExpiredReservations };
