// ===== models/Property.js =====
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  localisation: {
    gouvernorat: {
      type: String,
      required: [true, 'Le gouvernorat est requis'],
      trim: true
    },
    delegation: {
      type: String,
      required: [true, 'La délégation est requise'],
      trim: true
    }
  },
  images: {
    type: [String],
    default: []
  },
  bedrooms: {
    type: Number,
    min: [1, 'Property must have at least 1 bedroom'],
    default: 1
  },
  bathrooms: {
    type: Number,
    min: [1, 'Property must have at least 1 bathroom'],
    default: 1
  },
  maxGuests: {
    type: Number,
    min: [1, 'Au moins 1 personne est requise'],
    default: 2
  },
  type: {
    type: String,
    enum: {
      values: ['MAISON', 'MAISON_DHOTES', 'VILLA', 'APPARTEMENT', 'COTTAGE'],
      message: '{VALUE} is not a valid property type'
    },
    required: [true, 'Le type de propriété est requis'],
    default: 'APPARTEMENT'
  },
  cancellationDelay: {
    type: Number,
    enum: [24, 48],
    default: 24
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le propriétaire est requis']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
propertySchema.index({ owner: 1 });
propertySchema.index({ 'localisation.gouvernorat': 1 });
propertySchema.index({ 'localisation.delegation': 1 });
propertySchema.index({ prix: 1 });

module.exports = mongoose.model('Property', propertySchema);
