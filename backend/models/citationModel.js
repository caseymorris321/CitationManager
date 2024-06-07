const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sub-schemas for style-specific fields
const cseSpecificSchema = new Schema({
  methods: String,
  observations: String,
  annotation: String,
  tags: [String]
}, { _id: false });

const apaSpecificSchema = new Schema({
  // Add APA-specific fields here
});

const mlaSpecificSchema = new Schema({
  // Add MLA-specific fields here
});

const styleSpecificSchemas = {
  'CSE': cseSpecificSchema,
  'APA': apaSpecificSchema,
  'MLA': mlaSpecificSchema,
};

const journalSchema = new Schema({
  journalName: { type: String, required: true },
  volume: String,
  issue: String,
  pages: String,
  impactFactor: Number,
  tags: [String]
});

// General Citation Schema
const citationSchema = new Schema({
  authors: {
    type: [String],
    required: true
  },
  paperTitle: {
    type: String,
    required: true
  },
  publicationDate: {
    type: Date,
    required: true
  },
  publisherLocation: String,
  journal: journalSchema,
  DOI: String,
  citationStyle: {
    type: String,
    required: true,
    enum: Object.keys(styleSpecificSchemas)
  },
  styleSpecific: {
    type: Schema.Types.Mixed
  },
  comments: String,
  user_id: {
    type: String,
    required: true
  },
  isDeleted: { type: Boolean, default: false },
  favoritedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
},
  { timestamps: true });


  citationSchema.index({
    'authors': 'text',
    'paperTitle': 'text',
    'publisherLocation': 'text',
    'journal.journalName': 'text',
    'DOI': 'text',
    'comments': 'text',
    'styleSpecific.methods': 'text',
    'styleSpecific.observations': 'text',
    'styleSpecific.annotation': 'text',
    'styleSpecific.tags': 'text',
  }, {
    weights: {
      'authors': 10,
      'paperTitle': 10,
      'publisherLocation': 5,
      'journal.journalName': 8,
      'DOI': 6,
      'comments': 3,
      'styleSpecific.methods': 7,
      'styleSpecific.observations': 7,
      'styleSpecific.annotation': 6,
      'styleSpecific.tags': 4,
    }
  });

// Helper function to manage style-specific data
function getStyleSpecificData(citationStyle, data) {
  if (!citationStyle || !styleSpecificSchemas[citationStyle]) {
    return null;
  }

  const SpecificSchema = mongoose.model(citationStyle, styleSpecificSchemas[citationStyle]);
  return data ? new SpecificSchema(data).toObject() : new SpecificSchema();
}

// Middleware to handle style-specific data
citationSchema.pre('save', function (next) {
  this.styleSpecific = getStyleSpecificData(this.citationStyle, this.styleSpecific);
  next();
});

citationSchema.pre('findOneAndUpdate', function (next) {
  if (this._update.styleSpecific) {
    this._update.styleSpecific = getStyleSpecificData(this._update.citationStyle, this._update.styleSpecific);
  }
  next();
});

module.exports = mongoose.model('Citation', citationSchema);
