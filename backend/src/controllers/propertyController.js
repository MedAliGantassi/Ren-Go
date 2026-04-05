// ===== controllers/propertyController.js =====
const Property = require('../models/Property');
const { 
  validateLocalisation, 
  validateImages, 
  validateNumber,
  escapeRegex,
  sendErrorResponse
} = require('../config/validators');

const createProperty = async (req, res) => {
  try {
    const { titre, description, prix, localisation, images, bedrooms, bathrooms, maxGuests, type, cancellationDelay } = req.body;

    if (!titre || !prix || !localisation) {
      return res.status(400).json({ 
        success: false,
        message: 'Veuillez fournir tous les champs requis (titre, prix, localisation)' 
      });
    }

    if (req.user.role !== 'PROPRIETAIRE') {
      return res.status(403).json({
        success: false,
        message: 'Only property owners (PROPRIETAIRE) can create properties'
      });
    }

    validateLocalisation(localisation);

    const validPrix = validateNumber(prix, 1);

    const validImages = validateImages(images);

    const propertyData = {
      titre: titre.trim(),
      description: description?.trim(),
      prix: validPrix,
      localisation,
      images: validImages,
      owner: req.user._id
    };

    if (bedrooms) {
      propertyData.bedrooms = validateNumber(bedrooms, 1, 100);
    }
    if (bathrooms) {
      propertyData.bathrooms = validateNumber(bathrooms, 1, 50);
    }
    if (maxGuests) {
      propertyData.maxGuests = validateNumber(maxGuests, 1, 100);
    }
    if (type) {
      const validTypes = ['MAISON', 'MAISON_DHOTES', 'VILLA', 'APPARTEMENT', 'COTTAGE'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Type must be one of: ${validTypes.join(', ')}`
        });
      }
      propertyData.type = type;
    }
    if (cancellationDelay) {
      if (![24, 48].includes(Number(cancellationDelay))) {
        return res.status(400).json({
          success: false,
          message: 'Cancellation delay must be 24 or 48 hours'
        });
      }
      propertyData.cancellationDelay = Number(cancellationDelay);
    }

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: messages.join(', ') 
      });
    }
    if (error.message.includes('Localisation') || error.message.includes('Images') || error.message.includes('Value')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    sendErrorResponse(res, error);
  }
};

const getAllProperties = async (req, res) => {
  try {
    const { localisation, minPrix, maxPrix, owner, bedrooms, bathrooms, maxGuests, type, page, limit } = req.query;
    
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Number(limit) || 20);
    const skip = (pageNum - 1) * limitNum;
    
    const filter = { isActive: true };
    
    if (localisation) {
      const escapedLoc = escapeRegex(localisation);
      filter.$or = [
        { 'localisation.gouvernorat': { $regex: escapedLoc, $options: 'i' } },
        { 'localisation.delegation': { $regex: escapedLoc, $options: 'i' } }
      ];
    }
    
    if (minPrix || maxPrix) {
      filter.prix = {};
      if (minPrix) {
        const min = validateNumber(minPrix, 0);
        filter.prix.$gte = min;
      }
      if (maxPrix) {
        const max = validateNumber(maxPrix, 0);
        filter.prix.$lte = max;
      }
    }
    
    if (bedrooms) {
      filter.bedrooms = { $gte: validateNumber(bedrooms, 1, 100) };
    }
    if (bathrooms) {
      filter.bathrooms = { $gte: validateNumber(bathrooms, 1, 50) };
    }
    if (maxGuests) {
      filter.maxGuests = { $gte: validateNumber(maxGuests, 1, 100) };
    }
    
    if (type) {
      const validTypes = ['MAISON', 'MAISON_DHOTES', 'VILLA', 'APPARTEMENT', 'COTTAGE'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Type must be one of: ${validTypes.join(', ')}`
        });
      }
      filter.type = type;
    }
    
    if (owner) {
      filter.owner = owner;
    }

    const properties = await Property.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      pages: Math.ceil(total / limitNum),
      page: pageNum,
      data: properties
    });
  } catch (error) {
    if (error.message.includes('Value')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    sendErrorResponse(res, error);
  }
};

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
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Non autorisé. Vous ne pouvez modifier que vos propres propriétés' 
      });
    }

    const { titre, description, prix, localisation, images, type, isActive } = req.body;
    
    const updateData = {};
    if (titre !== undefined) updateData.titre = titre;
    if (description !== undefined) updateData.description = description;
    if (prix !== undefined) updateData.prix = prix;
    if (localisation !== undefined) updateData.localisation = localisation;
    if (images !== undefined) updateData.images = images;
    if (type !== undefined) {
      const validTypes = ['MAISON', 'MAISON_DHOTES', 'VILLA', 'APPARTEMENT', 'COTTAGE'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Type must be one of: ${validTypes.join(', ')}`
        });
      }
      updateData.type = type;
    }
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
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }

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
