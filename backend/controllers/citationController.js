const Citation = require('../models/citationModel');
const mongoose = require('mongoose');

// Get all citations
const getCitations = async (req, res) => {
  try {
    const user_id = req.user._id;

    const citations = await Citation.find({ user_id, isDeleted: false }).sort({ createdAt: -1 });

    res.status(200).json(citations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single citation
const getCitation = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such citation' });
  }

  const citation = await Citation.findById(id);

  if (!citation) {
    return res.status(404).json({ error: 'No such citation' });
  }

  res.status(200).json(citation);
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

// Delete a citation
const deleteCitation = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such citation' });
  }
  const citation = await Citation.findOneAndUpdate(
    { _id: id },
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
  const citation = await Citation.findOneAndUpdate(
    { _id: id },
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such citation' });
  }

  const citation = await Citation.findOneAndUpdate({ _id: id }, {
    ...req.body
  }, { new: true }); // Return the updated document

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
  updateCitation
};
