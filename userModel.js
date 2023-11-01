const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  pin: {
    type: Number,
    required: true,
    unique: true,
    min: 1000, // min of 4-digit PIN
    max: 9999 // max  4-digit PIN
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user'
  },
}, {
  timestamps: true 
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
