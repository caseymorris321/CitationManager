const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  citationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citation',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

favoriteSchema.index({ citationId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
