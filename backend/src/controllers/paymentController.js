// ===== controllers/paymentController.js =====
const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');
const Property = require('../models/Property');
const Config = require('../models/Config');
const { createNotification } = require('./notificationController');
const { validateNumber, sendErrorResponse } = require('../config/validators');

/**
 * Calculate commission and net amount
 */
const calculateCommission = async (amount) => {
  const commissionRate = await Config.getCommissionRate();
  const commissionAmount = Math.round((amount * commissionRate / 100) * 100) / 100;
  const netAmount = Math.round((amount - commissionAmount) * 100) / 100;
  return { commissionAmount, netAmount, commissionRate };
};

/**
 * @desc    Process online payment for a reservation
 * @route   POST /api/payments/online
 * @access  Private (CLIENT only)
 */
const createOnlinePayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { reservationId, amount } = req.body;

    if (!reservationId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir reservationId et amount'
      });
    }

    // Validate amount
    const validAmount = validateNumber(amount, 0.01);

    // Fetch reservation with session lock
    const reservation = await Reservation.findById(reservationId)
      .populate('property', 'titre owner')
      .session(session);

    if (!reservation) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Check ownership
    if (reservation.client.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Non autorisé. Cette réservation ne vous appartient pas'
      });
    }

    // Check payment method is ONLINE
    if (reservation.paymentMethod !== 'ONLINE') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Cette réservation nécessite un paiement en espèces (CASH)'
      });
    }

    // Check reservation status
    if (reservation.status !== 'EN_ATTENTE') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Impossible de payer. La réservation est déjà ${reservation.status}`
      });
    }

    // Check for existing payment within transaction
    const existingPayment = await Payment.findOne({
      reservation: reservationId,
      status: 'SUCCESS'
    }).session(session);

    if (existingPayment) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Cette réservation a déjà été payée'
      });
    }

    // Validate amount matches total price
    if (validAmount !== reservation.totalPrice) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Le montant (${validAmount}) ne correspond pas au prix total (${reservation.totalPrice})`
      });
    }

    // Simulate payment (always SUCCESS for simplicity)
    const paymentSuccess = true;

    // Calculate commission
    let commissionAmount = 0;
    let netAmount = validAmount;
    
    if (paymentSuccess) {
      const commission = await calculateCommission(validAmount);
      commissionAmount = commission.commissionAmount;
      netAmount = commission.netAmount;
    }

    // Create payment within transaction
    const payment = await Payment.create([{
      reservation: reservationId,
      client: req.user._id,
      amount: validAmount,
      method: 'ONLINE',
      status: paymentSuccess ? 'SUCCESS' : 'FAILED',
      commissionAmount: paymentSuccess ? commissionAmount : 0,
      netAmount: paymentSuccess ? netAmount : 0
    }], { session });

    // Update reservation status within transaction
    if (paymentSuccess) {
      reservation.status = 'CONFIRMEE';
      await reservation.save({ session });
    }

    await session.commitTransaction();

    // Notify client about payment success
    if (paymentSuccess) {
      await createNotification({
        user: req.user._id,
        type: 'PAYMENT',
        message: `Paiement de ${validAmount} TND effectué avec succès pour votre réservation`,
        relatedId: payment[0]._id,
        relatedModel: 'Payment'
      });

      // Notify proprietaire
      await createNotification({
        user: reservation.property.owner,
        type: 'PAYMENT',
        message: `Paiement reçu pour "${reservation.property.titre}" - ${validAmount} TND`,
        relatedId: payment[0]._id,
        relatedModel: 'Payment'
      });
    }

    // Populate for response
    await payment[0].populate('reservation');
    await payment[0].populate([
      { path: 'reservation', select: 'property dateDebut dateFin totalPrice status' },
      { path: 'client', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: paymentSuccess 
        ? 'Paiement effectué avec succès. Réservation confirmée!' 
        : 'Échec du paiement. Veuillez réessayer.',
      data: payment[0]
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID de réservation invalide'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Confirm cash payment by PROPRIETAIRE
 * @route   PUT /api/payments/cash/:reservationId/confirm
 * @access  Private (PROPRIETAIRE only)
 */
const confirmCashPayment = async (req, res) => {
  try {
    const { reservationId } = req.params;

    // Récupérer la réservation avec la propriété
    const reservation = await Reservation.findById(reservationId)
      .populate('property', 'titre owner')
      .populate('client', 'name email');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que le PROPRIETAIRE est le propriétaire de la propriété
    if (reservation.property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé. Cette propriété ne vous appartient pas'
      });
    }

    // Vérifier que la méthode de paiement est CASH
    if (reservation.paymentMethod !== 'CASH') {
      return res.status(400).json({
        success: false,
        message: 'Cette réservation nécessite un paiement en ligne (ONLINE)'
      });
    }

    // Vérifier que la réservation est EN_ATTENTE
    if (reservation.status !== 'EN_ATTENTE') {
      return res.status(400).json({
        success: false,
        message: `Impossible de confirmer. La réservation est déjà ${reservation.status}`
      });
    }

    // Calculate commission
    const { commissionAmount, netAmount } = await calculateCommission(reservation.totalPrice);

    // Créer l'enregistrement de paiement avec commission
    const payment = await Payment.create({
      reservation: reservationId,
      client: reservation.client._id,
      amount: reservation.totalPrice,
      method: 'CASH',
      status: 'SUCCESS',
      commissionAmount: commissionAmount,
      netAmount: netAmount
    });

    // Mettre à jour le statut de la réservation
    reservation.status = 'CONFIRMEE';
    await reservation.save();

    // Notify client about payment confirmation
    await createNotification({
      user: reservation.client._id,
      type: 'PAYMENT',
      message: `Paiement de ${reservation.totalPrice} TND confirmé pour votre réservation`,
      relatedId: payment._id,
      relatedModel: 'Payment'
    });

    // Populate le paiement pour la réponse
    await payment.populate([
      { path: 'reservation', select: 'property dateDebut dateFin totalPrice status paymentMethod' },
      { path: 'client', select: 'name email' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Paiement en espèces confirmé. Réservation confirmée!',
      data: payment
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID de réservation invalide'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get payment history for a client
 * @route   GET /api/payments/my
 * @access  Private (CLIENT only)
 */
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ client: req.user._id })
      .populate({
        path: 'reservation',
        select: 'property dateDebut dateFin totalPrice status paymentMethod',
        populate: {
          path: 'property',
          select: 'titre localisation'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get payments for PROPRIETAIRE's properties
 * @route   GET /api/payments/received
 * @access  Private (PROPRIETAIRE only)
 */
const getReceivedPayments = async (req, res) => {
  try {
    // Récupérer toutes les propriétés du PROPRIETAIRE
    const properties = await Property.find({ owner: req.user._id }).select('_id');
    const propertyIds = properties.map(p => p._id);

    // Récupérer toutes les réservations de ces propriétés
    const reservations = await Reservation.find({ 
      property: { $in: propertyIds } 
    }).select('_id');
    const reservationIds = reservations.map(r => r._id);

    // Récupérer les paiements de ces réservations
    const payments = await Payment.find({ 
      reservation: { $in: reservationIds } 
    })
      .populate({
        path: 'reservation',
        select: 'property dateDebut dateFin totalPrice status paymentMethod',
        populate: {
          path: 'property',
          select: 'titre localisation'
        }
      })
      .populate('client', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOnlinePayment,
  confirmCashPayment,
  getMyPayments,
  getReceivedPayments
};
