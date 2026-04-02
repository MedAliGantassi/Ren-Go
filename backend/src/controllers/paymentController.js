// ===== controllers/paymentController.js =====
const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');
const Property = require('../models/Property');

/**
 * @desc    Process online payment for a reservation
 * @route   POST /api/payments/online
 * @access  Private (CLIENT only)
 */
const createOnlinePayment = async (req, res) => {
  try {
    const { reservationId, amount } = req.body;

    // Validation des champs requis
    if (!reservationId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir reservationId et amount'
      });
    }

    // Récupérer la réservation
    const reservation = await Reservation.findById(reservationId)
      .populate('property', 'titre owner');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que le client est le propriétaire de la réservation
    if (reservation.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé. Cette réservation ne vous appartient pas'
      });
    }

    // Vérifier que la méthode de paiement est ONLINE
    if (reservation.paymentMethod !== 'ONLINE') {
      return res.status(400).json({
        success: false,
        message: 'Cette réservation nécessite un paiement en espèces (CASH)'
      });
    }

    // Vérifier que la réservation est EN_ATTENTE
    if (reservation.status !== 'EN_ATTENTE') {
      return res.status(400).json({
        success: false,
        message: `Impossible de payer. La réservation est déjà ${reservation.status}`
      });
    }

    // Vérifier qu'il n'y a pas déjà un paiement SUCCESS pour cette réservation
    const existingPayment = await Payment.findOne({
      reservation: reservationId,
      status: 'SUCCESS'
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Cette réservation a déjà été payée'
      });
    }

    // Vérifier que le montant correspond au totalPrice
    if (amount !== reservation.totalPrice) {
      return res.status(400).json({
        success: false,
        message: `Le montant (${amount}) ne correspond pas au prix total (${reservation.totalPrice})`
      });
    }

    // Simuler le paiement (toujours SUCCESS pour simplifier)
    // En production, intégrer un vrai service de paiement (Stripe, PayPal, etc.)
    const paymentSuccess = true; // Simulation: toujours succès

    // Créer le paiement
    const payment = await Payment.create({
      reservation: reservationId,
      client: req.user._id,
      amount: amount,
      method: 'ONLINE',
      status: paymentSuccess ? 'SUCCESS' : 'FAILED'
    });

    // Si paiement réussi, mettre à jour le statut de la réservation
    if (paymentSuccess) {
      reservation.status = 'CONFIRMEE';
      await reservation.save();
    }

    // Populate le paiement pour la réponse
    await payment.populate([
      { path: 'reservation', select: 'property dateDebut dateFin totalPrice status' },
      { path: 'client', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: paymentSuccess 
        ? 'Paiement effectué avec succès. Réservation confirmée!' 
        : 'Échec du paiement. Veuillez réessayer.',
      data: payment
    });
  } catch (error) {
    // Handle invalid ObjectId
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

    // Créer l'enregistrement de paiement
    const payment = await Payment.create({
      reservation: reservationId,
      client: reservation.client._id,
      amount: reservation.totalPrice,
      method: 'CASH',
      status: 'SUCCESS'
    });

    // Mettre à jour le statut de la réservation
    reservation.status = 'CONFIRMEE';
    await reservation.save();

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
    // Handle invalid ObjectId
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
