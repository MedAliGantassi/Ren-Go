// ===== models/Payment.js =====
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: [true, 'La réservation est requise']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le client est requis']
  },
  amount: {
    type: Number,
    required: [true, 'Le montant est requis'],
    min: [0, 'Le montant ne peut pas être négatif']
  },
  method: {
    type: String,
    enum: ['CASH', 'ONLINE'],
    required: [true, 'La méthode de paiement est requise']
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    required: [true, 'Le statut est requis']
  },
  commissionAmount: {
    type: Number,
    default: 0,
    min: [0, 'La commission ne peut pas être négative']
  },
  netAmount: {
    type: Number,
    default: 0,
    min: [0, 'Le montant net ne peut pas être négatif']
  }
}, {
  timestamps: true
});

// Index for faster queries
paymentSchema.index({ reservation: 1 });
paymentSchema.index({ client: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
