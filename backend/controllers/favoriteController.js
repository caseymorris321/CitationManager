const Citation = require('../models/citationModel');
const Favorite = require('../models/favoriteModel'); // Assuming you have a Favorite model

// Add a citation to favorites
const addFavorite = async (req, res) => {
  const { citationId } = req.params;
  const userId = req.user._id;

  try {
    const favorite = new Favorite({ userId, citationId });
    await favorite.save();
    const updatedCitation = await Citation.findById(citationId);
    res.status(200).json(updatedCitation);
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to add favorite' });
  }
};

// Remove a citation from favorites
const removeFavorite = async (req, res) => {
  const { citationId } = req.params;
  const userId = req.user._id;

  try {
    await Favorite.findOneAndDelete({ userId, citationId });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to remove favorite' });
  }
};

// Get favorite citations for a user
const getFavorites = async (req, res) => {
  const userId = req.user._id;

  try {
    const favorites = await Favorite.find({ userId }).populate('citationId');
    res.status(200).json(favorites);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve favorites' });
  }
};

// Check if a citation is a favorite
const checkFavorite = async (req, res) => {
  const { citationId } = req.params;
  const userId = req.user._id;

  try {
    const favorite = await Favorite.findOne({ userId, citationId });
    res.status(200).json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(400).json({ error: 'Failed to check favorite status' });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite, 
};

