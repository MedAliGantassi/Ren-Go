// ===== models/Reservation.js =====
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'La propriété est requise']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le client est requis']
  },
  dateDebut: {
    type: Date,
    required: [true, 'La date de début est requise']
  },
  dateFin: {
    type: Date,
    required: [true, 'La date de fin est requise']
  },
  guests: {
    type: Number,
    required: [true, 'Le nombre de personnes est requis'],
    min: [1, 'Au moins 1 personne est requise']
  },
  totalPrice: {
    type: Number,
    min: [0, 'Le prix total ne peut pas être négatif']
  },
  status: {
    type: String,
    enum: ['EN_ATTENTE', 'CONFIRMEE', 'ANNULEE'],
    default: 'EN_ATTENTE'
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'ONLINE'],
    default: 'CASH'
  }
}, {
  timestamps: true
});

// Index for faster overlap queries
reservationSchema.index({ property: 1, dateDebut: 1, dateFin: 1 });
reservationSchema.index({ client: 1 });
reservationSchema.index({ status: 1 });

// Validate that dateDebut is before dateFin
reservationSchema.pre('save', async function() {
  if (this.dateDebut >= this.dateFin) {
    throw new Error('La date de début doit être avant la date de fin');
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
