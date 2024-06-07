const express = require('express');
const {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
} = require('../controllers/favoriteController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

// Add a citation to favorites
router.post('/:citationId', addFavorite);

// Remove a citation from favorites
router.delete('/:citationId', removeFavorite);

// Get favorite citations for a user
router.get('/', getFavorites);

router.get('/:citationId', checkFavorite); // Add this line

module.exports = router;