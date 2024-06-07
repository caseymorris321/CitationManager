const express = require('express');
const router = express.Router();
const { searchCitations, addSearchToHistory, getSearchHistory, clearSearchHistory } = require('../controllers/searchController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

// Search citations
router.get('/search', searchCitations);

// Add search to history
router.post('/search-history', addSearchToHistory);

// Get search history
router.get('/search-history', getSearchHistory);

// Clear search history
router.delete('/search-history', clearSearchHistory);

module.exports = router;