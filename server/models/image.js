const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  id: { type: Number, required: true},
  title: { type: Number, required: true },
  description: { type: String },
  url: { type: String, required: true },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Image', imageSchema);