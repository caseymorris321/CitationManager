const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Add an index on the userId field
  },
  searchQuery: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true, // Add an index on the timestamp field
  },
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);