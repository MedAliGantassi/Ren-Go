// ===== controllers/reservationController.js =====
const Reservation = require('../models/Reservation');
const Property = require('../models/Property');
const { createNotification } = require('./notificationController');
const { 
  validateDate, 
  validatePositiveInteger,
  validatePaymentMethod,
  sendErrorResponse 
} = require('../config/validators');

/**
 * @desc    Create a new reservation
 * @route   POST /api/reservations
 * @access  Private (CLIENT only)
 */
const createReservation = async (req, res) => {
  try {
    const { property, dateDebut, dateFin, guests, paymentMethod } = req.body;

    if (!property || !dateDebut || !dateFin || !guests || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir tous les champs requis (property, dateDebut, dateFin, guests, paymentMethod)'
      });
    }

    // Validate dates
    const startDate = validateDate(dateDebut);
    const endDate = validateDate(dateFin);

    // Validate guests
    const guestsNum = validatePositiveInteger(guests, 'Guests');

    // Validate payment method
    const validPaymentMethod = validatePaymentMethod(paymentMethod);

    // Check start date is before end date
    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'La date de début doit être avant la date de fin'
      });
    }

    // Minimum 24 hours advance booking
    const minLeadHours = 24;
    const minReservationDate = new Date(Date.now() + minLeadHours * 60 * 60 * 1000);
    
    if (startDate <= minReservationDate) {
      return res.status(400).json({
        success: false,
        message: `Reservations must be made at least ${minLeadHours} hours in advance`
      });
    }

    // Fetch property
    const propertyDoc = await Property.findById(property);
    if (!propertyDoc) {
      return res.status(404).json({
        success: false,
        message: 'Propriété non trouvée'
      });
    }

    // Check property is active
    if (!propertyDoc.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cette propriété n\'est pas disponible'
      });
    }

    // Check max guests capacity
    if (propertyDoc.maxGuests && guestsNum > propertyDoc.maxGuests) {
      return res.status(400).json({
        success: false,
        message: `Le nombre de personnes dépasse la capacité maximale (${propertyDoc.maxGuests})`
      });
    }

    // Overlap check using MongoDB query
    const overlappingReservation = await Reservation.findOne({
      property: property,
      status: { $in: ['EN_ATTENTE', 'CONFIRMEE'] },
      dateDebut: { $lt: endDate },
      dateFin: { $gt: startDate }
    });

    if (overlappingReservation) {
      return res.status(409).json({
        success: false,
        message: 'Cette propriété n\'est pas disponible pour les dates sélectionnées',
        conflictingDates: {
          dateDebut: overlappingReservation.dateDebut,
          dateFin: overlappingReservation.dateFin
        }
      });
    }

    // Calculate nights and total price
    const oneDay = 24 * 60 * 60 * 1000;
    const numberOfNights = Math.round((endDate - startDate) / oneDay);
    const totalPrice = numberOfNights * propertyDoc.prix;

    // Create reservation
    const reservation = await Reservation.create({
      property,
      client: req.user._id,
      dateDebut: startDate,
      dateFin: endDate,
      guests: guestsNum,
      totalPrice,
      status: 'EN_ATTENTE',
      paymentMethod: validPaymentMethod
    });

    // Populate les références pour la réponse
    await reservation.populate([
      { path: 'property', select: 'titre localisation prix images owner' },
      { path: 'client', select: 'name email' }
    ]);

    // Notify proprietaire about new reservation
    await createNotification({
      user: propertyDoc.owner,
      type: 'RESERVATION',
      message: `Nouvelle réservation pour "${propertyDoc.titre}" du ${startDate.toLocaleDateString()} au ${endDate.toLocaleDateString()}`,
      relatedId: reservation._id,
      relatedModel: 'Reservation'
    });

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID de propriété invalide' });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get current user's reservations
 * @route   GET /api/reservations/my
 * @access  Private (CLIENT only)
 */
const getMyReservations = async (req, res) => {
  try {
    const { status } = req.query;

    // Build filter
    const filter = { client: req.user._id };
    if (status) {
      filter.status = status;
    }

    const reservations = await Reservation.find(filter)
      .populate('property', 'titre localisation prix images owner')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Cancel a reservation
 * @route   DELETE /api/reservations/:id
 * @access  Private (CLIENT only - own reservations)
 */
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que le client est le propriétaire de la réservation
    if (reservation.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Non autorisé. Vous ne pouvez annuler que vos propres réservations'
      });
    }

    // Vérifier que la réservation peut être annulée
    if (reservation.status === 'ANNULEE') {
      return res.status(400).json({
        message: 'Cette réservation est déjà annulée'
      });
    }

    // Mettre à jour le statut à ANNULEE
    reservation.status = 'ANNULEE';
    await reservation.save();

    // Get property for notification
    const property = await Property.findById(reservation.property).select('titre owner');
    
    // Notify proprietaire about cancellation
    if (property) {
      await createNotification({
        user: property.owner,
        type: 'RESERVATION',
        message: `Réservation annulée pour "${property.titre}"`,
        relatedId: reservation._id,
        relatedModel: 'Reservation'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Réservation annulée avec succès',
      data: reservation
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get reservation by ID
 * @route   GET /api/reservations/:id
 * @access  Private (Owner of reservation or property owner)
 */
const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('property', 'titre localisation prix images owner')
      .populate('client', 'name email');

    if (!reservation) {
      return res.status(404).json({
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier les droits d'accès
    const isClient = reservation.client._id.toString() === req.user._id.toString();
    const isPropertyOwner = reservation.property.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isClient && !isPropertyOwner && !isAdmin) {
      return res.status(403).json({
        message: 'Non autorisé à voir cette réservation'
      });
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Check property availability for given dates
 * @route   GET /api/reservations/check-availability
 * @access  Public
 */
const checkAvailability = async (req, res) => {
  try {
    const { property, dateDebut, dateFin } = req.query;

    if (!property || !dateDebut || !dateFin) {
      return res.status(400).json({
        message: 'Veuillez fournir property, dateDebut et dateFin'
      });
    }

    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);

    // Check for overlapping reservations
    const overlappingReservation = await Reservation.findOne({
      property: property,
      status: { $in: ['EN_ATTENTE', 'CONFIRMEE'] },
      dateDebut: { $lt: endDate },
      dateFin: { $gt: startDate }
    });

    res.status(200).json({
      success: true,
      available: !overlappingReservation,
      message: overlappingReservation 
        ? 'Propriété non disponible pour ces dates' 
        : 'Propriété disponible'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  cancelReservation,
  getReservationById,
  checkAvailability
};
