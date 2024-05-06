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

});

const mlaSpecificSchema = new Schema({

})

const styleSpecificSchemas = {
  'CSE': cseSpecificSchema,
  // 'APA': apaSpecificSchema,
  // 'MLA': mlaSpecificSchema,
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
  styleSpecific: Schema.Types.Mixed,
  comments: String,
  user_id: {
    type: String,
    required: true
  },
  isDeleted: { type: Boolean, default: false }
},

  { timestamps: true });

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

citationSchema.pre('save', function (next) {
  if (this.isModified('styleSpecific')) {
    this.markModified('styleSpecific');
  }
  next();
});

citationSchema.pre('findOneAndUpdate', function (next) {
  this._update.styleSpecific = getStyleSpecificData(this._update.citationStyle, this._update.styleSpecific);
  next();
});

module.exports = mongoose.model('Citation', citationSchema);