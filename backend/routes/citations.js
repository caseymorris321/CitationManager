const express = require('express')
const {
  createCitation,
  getCitations,
  getCitation,
  deleteCitation,
  undoDeleteCitation,
  updateCitation,
  addSearchToHistory,
  getSearchHistory,
  clearSearchHistory,
  searchCitations,

} = require('../controllers/citationController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

// GET all citations
router.get('/', getCitations)

//GET a single citation
router.get('/:id', getCitation)

// POST a new citation
router.post('/', createCitation)

// DELETE a citation
router.delete('/:id', deleteCitation)

// UNDO delete a citation
router.patch('/:id/undo', undoDeleteCitation);

// Full update of a citation
router.put('/:id', updateCitation);


module.exports = router