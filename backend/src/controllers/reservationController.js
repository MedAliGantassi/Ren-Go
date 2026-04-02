// ===== controllers/reservationController.js =====
const Reservation = require('../models/Reservation');
const Property = require('../models/Property');

/**
 * @desc    Create a new reservation
 * @route   POST /api/reservations
 * @access  Private (CLIENT only)
 */
const createReservation = async (req, res) => {
  try {
    const { property, dateDebut, dateFin, guests } = req.body;
    console.log("BODY:", req.body);

    // Validation des champs requis
    if (!property || !dateDebut || !dateFin || !guests) {
      return res.status(400).json({
        message: 'Veuillez fournir tous les champs requis (property, dateDebut, dateFin, guests)'
      });
    }

    // Convertir les dates en objets Date
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);

    // Vérifier que la date de début est avant la date de fin
    if (startDate >= endDate) {
      return res.status(400).json({
        message: 'La date de début doit être avant la date de fin'
      });
    }

    // Vérifier que la date de début est dans le futur
    if (startDate < new Date()) {
      return res.status(400).json({
        message: 'La date de début doit être dans le futur'
      });
    }

    // Récupérer la propriété
    const propertyDoc = await Property.findById(property);
    if (!propertyDoc) {
      return res.status(404).json({
        message: 'Propriété non trouvée'
      });
    }

    // Vérifier que la propriété est active
    if (!propertyDoc.isActive) {
      return res.status(400).json({
        message: 'Cette propriété n\'est pas disponible'
      });
    }

    // Vérifier le nombre maximum de personnes (si maxGuests existe)
    if (propertyDoc.maxGuests && guests > propertyDoc.maxGuests) {
      return res.status(400).json({
        message: `Le nombre de personnes dépasse la capacité maximale (${propertyDoc.maxGuests})`
      });
    }

    // ========================================
    // OVERLAP CHECK - Using MongoDB Query
    // ========================================
    // Two date ranges overlap if:
    // (newStart < existingEnd) AND (newEnd > existingStart)
    const overlappingReservation = await Reservation.findOne({
      property: property,
      status: { $in: ['EN_ATTENTE', 'CONFIRMEE'] },
      dateDebut: { $lt: endDate },
      dateFin: { $gt: startDate }
    });

    if (overlappingReservation) {
      return res.status(409).json({
        message: 'Cette propriété n\'est pas disponible pour les dates sélectionnées',
        conflictingDates: {
          dateDebut: overlappingReservation.dateDebut,
          dateFin: overlappingReservation.dateFin
        }
      });
    }

    // Calculer le nombre de nuits
    const oneDay = 24 * 60 * 60 * 1000; // millisecondes dans un jour
    const numberOfNights = Math.round((endDate - startDate) / oneDay);

    // Calculer le prix total
    const totalPrice = numberOfNights * propertyDoc.prix;

    // Créer la réservation
    const reservation = await Reservation.create({
      property,
      client: req.user._id,
      dateDebut: startDate,
      dateFin: endDate,
      guests,
      totalPrice,
      status: 'EN_ATTENTE'
    });

    // Populate les références pour la réponse
    await reservation.populate([
      { path: 'property', select: 'titre localisation prix images' },
      { path: 'client', select: 'name email' }
    ]);

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
