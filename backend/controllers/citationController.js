const Citation = require('../models/citationModel');
const Favorite = require('../models/favoriteModel');
const SearchHistory = require('../models/searchHistoryModel');
const mongoose = require('mongoose');
const axios = require('axios');

// Get all citations
// Get all citations for the current user
const getCitations = async (req, res) => {
  const userId = req.user._id;
  try {
    const favorites = await Favorite.find({ userId }).lean().exec();
    const favoriteCitationIds = favorites.map(fav => fav.citationId.toString());
    const citations = await Citation.find({ user_id: userId, isDeleted: false }).sort({ createdAt: -1 }).lean().exec();
    const citationsWithFavoriteStatus = citations.map(citation => {
      const isFavorite = favoriteCitationIds.includes(citation._id.toString());
      return { ...citation, isFavorite };
    });
    res.status(200).json(citationsWithFavoriteStatus);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch citations' });
  }
};


// Get a single citation
const getCitation = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such citation' });
  }

  try {
    const citation = await Citation.findOne({ _id: id, user_id: userId });

    if (!citation) {
      return res.status(404).json({ error: 'No such citation' });
    }

    // Check if the citation is a favorite for the current user
    const favorite = await Favorite.findOne({ userId, citationId: id });
    const isFavorite = !!favorite;

    // Include the isFavorite field in the response
    const citationWithFavorite = { ...citation.toObject(), isFavorite };

    res.status(200).json(citationWithFavorite);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch citation' });
  }
};

// Create a new citation
const createCitation = async (req, res) => {
  const {
    authors,
    paperTitle,
    publicationDate,
    publisherLocation,
    journal,
    DOI,
    citationStyle,
    styleSpecific,
    comments
  } = req.body;

  try {
    const user_id = req.user._id;
    const citation = await Citation.create({
      authors,
      paperTitle,
      publicationDate,
      publisherLocation,
      journal,
      DOI,
      citationStyle,
      styleSpecific,
      comments,
      user_id
    });
    
    res.status(200).json(citation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete a citation (soft delete)
const deleteCitation = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such citation' });
  }
  const citation = await Citation.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!citation) {
    return res.status(400).json({ error: 'No such citation' });
  }
  res.status(200).json(citation);
};

// Undo Delete a citation
const undoDeleteCitation = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such citation' });
  }
  const citation = await Citation.findByIdAndUpdate(
    id,
    { isDeleted: false },
    { new: true }
  );
  if (!citation) {
    return res.status(400).json({ error: 'No such citation' });
  }
  res.status(200).json(citation);
};
// Update a citation
const updateCitation = async (req, res) => {
  const { id } = req.params;
  const updatedCitation = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such citation' });
  }

  const citation = await Citation.findOneAndUpdate({ _id: id }, updatedCitation, {
    new: true,
    runValidators: true,
  });

  if (!citation) {
    return res.status(400).json({ error: 'No such citation' });
  }

  res.status(200).json(citation);
};

module.exports = {
  getCitations,
  getCitation,
  createCitation,
  deleteCitation,
  undoDeleteCitation,
  updateCitation,
};