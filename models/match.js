// models/match.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  }],
  round: {
    type: Number,
    required: true
},
winner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Team',
  default: null, // null indicates no winner has been determined yet
},
  // Additional fields as needed
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
