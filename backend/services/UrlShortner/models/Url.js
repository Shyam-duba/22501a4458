const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customName: {
    type: String,
    trim: true
  },
  validity: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  userAgent: [{
    type: String
  }],
  ipAddresses: [{
    type: String
  }]
});

// Index for faster queries
urlSchema.index({ shortCode: 1 });
urlSchema.index({ validity: 1 });

module.exports = mongoose.model('Url', urlSchema); 