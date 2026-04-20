// ===== config/autoCancelReservations.js =====
const Reservation = require('../models/Reservation');
const Payment = require('../models/Payment');

const CHECK_INTERVAL = 60 * 60 * 1000; // Run every 1 hour

const HOURS_TO_MS = 60 * 60 * 1000;

const getCancellationDelayHours = (reservation) => {
  const delay = Number(reservation?.property?.cancellationDelay);
  return delay === 48 ? 48 : 24;
};

const shouldCancelReservation = (reservation, hasConfirmedPayment, now = new Date()) => {
  if (!reservation || reservation.status !== 'EN_ATTENTE') {
    return false;
  }

  if (hasConfirmedPayment) {
    return false;
  }

  const startDate = new Date(reservation.dateDebut);
  if (Number.isNaN(startDate.getTime())) {
    return false;
  }

  // Do not auto-cancel reservations that have already started or are in the past.
  if (now >= startDate) {
    return false;
  }

  const cancellationDelay = getCancellationDelayHours(reservation);
  const cancelLimit = new Date(startDate.getTime() - cancellationDelay * HOURS_TO_MS);

  return now > cancelLimit;
};

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
      .populate('property', 'cancellationDelay titre')
      .select('_id status dateDebut property');

    if (pendingReservations.length === 0) {
      console.log('⏰ Auto-cancel: No pending reservations found');
      return 0;
    }

    const reservationIds = pendingReservations.map((reservation) => reservation._id);
    const confirmedPayments = await Payment.find({
      reservation: { $in: reservationIds },
      status: 'SUCCESS'
    }).select('reservation');

    const confirmedReservationIds = new Set(
      confirmedPayments.map((payment) => payment.reservation.toString())
    );

    for (const reservation of pendingReservations) {
      const hasConfirmedPayment = confirmedReservationIds.has(reservation._id.toString());

      if (shouldCancelReservation(reservation, hasConfirmedPayment, now)) {
        reservation.status = 'ANNULEE';
        await reservation.save();

        const cancellationDelay = getCancellationDelayHours(reservation);
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

module.exports = {
  startAutoCancelScheduler,
  cancelExpiredReservations,
  shouldCancelReservation
};
