const mongoose = require('mongoose');

const wasteEntrySchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
    required: true,
  },
  percentageWasted: {
    type: Number,
    required: true,
  },
  costWasted: {
    type: Number,
    required: true,
  },
  responsibleUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const WasteEntry = mongoose.model('WasteEntry', wasteEntrySchema);

module.exports = WasteEntry;
