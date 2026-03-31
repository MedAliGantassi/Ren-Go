// ===== controllers/propertyController.js =====
const Property = require('../models/Property');

/**
 * @desc    Create a new property
 * @route   POST /api/properties
 * @access  Private (FOURNISSEUR only)
 */
const createProperty = async (req, res) => {
  try {
    const { titre, description, prix, localisation, images } = req.body;

    // Validation
    if (!titre || !prix || !localisation) {
      return res.status(400).json({ 
        message: 'Veuillez fournir tous les champs requis (titre, prix, localisation)' 
      });
    }

    // Create property with owner set to current user
    const property = await Property.create({
      titre,
      description,
      prix,
      localisation,
      images: images || [],
      owner: req.user._id
    });

    res.status(201).json({
      success: true,
      data: property
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all properties
 * @route   GET /api/properties
 * @access  Public
 */
const getAllProperties = async (req, res) => {
  try {
    // Query parameters for filtering
    const { localisation, minPrix, maxPrix, owner } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    
    if (localisation) {
      filter.localisation = { $regex: localisation, $options: 'i' };
    }
    
    if (minPrix || maxPrix) {
      filter.prix = {};
      if (minPrix) filter.prix.$gte = Number(minPrix);
      if (maxPrix) filter.prix.$lte = Number(maxPrix);
    }
    
    if (owner) {
      filter.owner = owner;
    }

    const properties = await Property.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single property by ID
 * @route   GET /api/properties/:id
 * @access  Public
 */
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email');

    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update property
 * @route   PUT /api/properties/:id
 * @access  Private (FOURNISSEUR - own properties only)
 */
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }

    // Check ownership - only owner can update
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Non autorisé. Vous ne pouvez modifier que vos propres propriétés' 
      });
    }

    // Fields that can be updated
    const { titre, description, prix, localisation, images, isActive } = req.body;
    
    const updateData = {};
    if (titre !== undefined) updateData.titre = titre;
    if (description !== undefined) updateData.description = description;
    if (prix !== undefined) updateData.prix = prix;
    if (localisation !== undefined) updateData.localisation = localisation;
    if (images !== undefined) updateData.images = images;
    if (isActive !== undefined) updateData.isActive = isActive;

    property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name email');

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete property
 * @route   DELETE /api/properties/:id
 * @access  Private (FOURNISSEUR - own properties, ADMIN - any property)
 */
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }

    // Check ownership - owner or admin can delete
    const isOwner = property.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        message: 'Non autorisé. Vous ne pouvez supprimer que vos propres propriétés' 
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Propriété supprimée avec succès'
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
};
