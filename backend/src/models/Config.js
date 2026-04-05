// ===== models/Config.js =====
const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  commissionRate: {
    type: Number,
    default: 10,
    min: [0, 'Le taux de commission ne peut pas être négatif'],
    max: [100, 'Le taux de commission ne peut pas dépasser 100%']
  }
}, {
  timestamps: true
});

// Static method to get commission rate
configSchema.statics.getCommissionRate = async function() {
  let config = await this.findOne({ key: 'main' });
  if (!config) {
    config = await this.create({ key: 'main', commissionRate: 10 });
  }
  return config.commissionRate;
};

// Static method to update commission rate
configSchema.statics.updateCommissionRate = async function(rate) {
  let config = await this.findOneAndUpdate(
    { key: 'main' },
    { commissionRate: rate },
    { new: true, upsert: true }
  );
  return config;
};

module.exports = mongoose.model('Config', configSchema);
