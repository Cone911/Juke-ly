const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  artist: { 
    type: String,
    required: true 
  },
  youTubeURL: { 
    type: String,
    required: true 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createdAt: {
    type: Date, 
    default: Date.now
  },
  played: {
    type: Boolean,
    default: false 
  },
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;