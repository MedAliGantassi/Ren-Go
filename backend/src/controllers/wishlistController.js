// ===== controllers/wishlistController.js =====
const Wishlist = require('../models/Wishlist');
const Property = require('../models/Property');

/**
 * @desc    Add property to wishlist
 * @route   POST /api/wishlist/:propertyId
 * @access  Private (CLIENT only)
 */
const addToWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propriété non trouvée'
      });
    }

    // Find or create wishlist using $addToSet to avoid duplicates
    let wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { properties: propertyId } },
      { new: true, upsert: true }
    ).populate({
      path: 'properties',
      select: 'titre description prix localisation images bedrooms bathrooms maxGuests'
    });

    res.status(200).json({
      success: true,
      message: 'Propriété ajoutée aux favoris',
      data: wishlist
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
 * @desc    Remove property from wishlist
 * @route   DELETE /api/wishlist/:propertyId
 * @access  Private (CLIENT only)
 */
const removeFromWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Find wishlist and remove property
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { properties: propertyId } },
      { new: true }
    ).populate({
      path: 'properties',
      select: 'titre description prix localisation images bedrooms bathrooms maxGuests'
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Propriété retirée des favoris',
      data: wishlist
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
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist/me
 * @access  Private (CLIENT only)
 */
const getMyWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'properties',
        select: 'titre description prix localisation images bedrooms bathrooms maxGuests owner isActive',
        populate: {
          path: 'owner',
          select: 'name email'
        }
      });

    // If no wishlist exists, return empty
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: { user: req.user._id, properties: [] }
      });
    }

    res.status(200).json({
      success: true,
      count: wishlist.properties.length,
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Check if property is in wishlist
 * @route   GET /api/wishlist/check/:propertyId
 * @access  Private (CLIENT only)
 */
const checkInWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
      properties: propertyId
    });

    res.status(200).json({
      success: true,
      inWishlist: !!wishlist
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

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getMyWishlist,
  checkInWishlist
};
