const mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
  maxUserId: { type: Number, required: true },
  maxImageId: { type: Number, required: true }
});

module.exports = mongoose.model('Sequence', sequenceSchema);