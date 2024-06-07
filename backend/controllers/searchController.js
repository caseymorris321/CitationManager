const Citation = require('../models/citationModel');
const SearchHistory = require('../models/searchHistoryModel');

const searchCitations = async (req, res) => {
  const { query } = req.query;
  const userId = req.user._id;
  const regex = new RegExp(query, 'i'); 

  try {
    const citations = await Citation.find({
      user_id: userId,
      isDeleted: false,
      $or: [
        { paperTitle: { $regex: regex } },
        { authors: { $in: [regex] } },
        { 'journal.journalName': { $regex: regex } },
        { publisherLocation: { $regex: regex } },
        { DOI: { $regex: regex } },
        { comments: { $regex: regex } },
        { 'styleSpecific.methods': { $regex: regex } },
        { 'styleSpecific.observations': { $regex: regex } },
        { 'styleSpecific.annotation': { $regex: regex } },
        { 'styleSpecific.tags': { $in: [regex] } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: { $year: '$publicationDate' } },
              regex: query,
              options: 'i',
            },
          },
        },
      ],
    })
      .lean()
      .exec();

    const searchHistory = await SearchHistory.find({ userId }).sort({ timestamp: -1 });


    res.status(200).json(citations);
  } catch (error) {
    console.error('Error searching citations:', error);
    res.status(500).json({ error: 'Failed to search citations' });
  }
};

const addSearchToHistory = async (req, res) => {
  const { searchQuery } = req.body;
  const userId = req.user._id;

  try {
    const newSearchHistory = await SearchHistory.create({ userId, searchQuery });
    res.status(201).json(newSearchHistory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add search to history' });
  }
};

const getSearchHistory = async (req, res) => {
  const userId = req.user._id;

  try {
    const searchHistory = await SearchHistory.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json(searchHistory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
};

const clearSearchHistory = async (req, res) => {
  const userId = req.user._id;

  try {
    await SearchHistory.deleteMany({ userId });
    res.status(200).json({ message: 'Search history cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear search history' });
  }
};

module.exports = {
  searchCitations,
  addSearchToHistory,
  getSearchHistory,
  clearSearchHistory,
};