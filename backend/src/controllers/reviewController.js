// ===== controllers/reviewController.js =====
const Review = require('../models/Review');
const Reservation = require('../models/Reservation');
const { createNotification } = require('./notificationController');

/**
 * @desc    Create a review for a reservation
 * @route   POST /api/reviews
 * @access  Private (CLIENT only)
 */
const createReview = async (req, res) => {
  try {
    const { reservationId, rating, comment } = req.body;

    // Validation des champs requis
    if (!reservationId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir reservationId et rating'
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'La note doit être entre 1 et 5'
      });
    }

    // Get the reservation
    const reservation = await Reservation.findById(reservationId)
      .populate('property', 'titre owner');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Check that the CLIENT owns this reservation
    if (reservation.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé. Cette réservation ne vous appartient pas'
      });
    }

    // Check that reservation status is CONFIRMEE
    if (reservation.status !== 'CONFIRMEE') {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez laisser un avis que pour une réservation confirmée'
      });
    }

    // Check if review already exists for this reservation
    const existingReview = await Review.findOne({ reservation: reservationId });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà laissé un avis pour cette réservation'
      });
    }

    // Create the review
    const review = await Review.create({
      reservation: reservationId,
      reviewer: req.user._id,
      property: reservation.property._id,
      rating,
      comment: comment || ''
    });

    // Notify proprietaire about new review
    await createNotification({
      user: reservation.property.owner,
      type: 'REVIEW',
      message: `Nouvel avis (${rating}/5) pour "${reservation.property.titre}"`,
      relatedId: review._id,
      relatedModel: 'Review'
    });

    // Populate for response
    await review.populate([
      { path: 'reviewer', select: 'name email' },
      { path: 'property', select: 'titre localisation' },
      { path: 'reservation', select: 'dateDebut dateFin' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Avis créé avec succès',
      data: review
    });
  } catch (error) {
    // Handle duplicate key error (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà laissé un avis pour cette réservation'
      });
    }
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
 * @desc    Get all reviews for a property
 * @route   GET /api/reviews/property/:propertyId
 * @access  Public
 */
const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const reviews = await Review.find({ property: propertyId })
      .populate('reviewer', 'name')
      .populate('reservation', 'dateDebut dateFin')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
      : 0;

    res.status(200).json({
      success: true,
      count: totalReviews,
      averageRating,
      data: reviews
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID de propriété invalide'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get reviews created by logged-in user
 * @route   GET /api/reviews/me
 * @access  Private (CLIENT only)
 */
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user._id })
      .populate({
        path: 'property',
        select: 'titre localisation images'
      })
      .populate('reservation', 'dateDebut dateFin totalPrice')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private (CLIENT - own review, ADMIN - any)
 */
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    // Check ownership or admin
    const isOwner = review.reviewer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cet avis'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Avis supprimé avec succès'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createReview,
  getPropertyReviews,
  getMyReviews,
  deleteReview
};
