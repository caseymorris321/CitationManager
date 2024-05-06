const express = require('express')
const {
  createCitation,
  getCitations,
  getCitation,
  deleteCitation,
  updateCitation
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

// UPDATE a citation
router.patch('/:id', updateCitation)


module.exports = router