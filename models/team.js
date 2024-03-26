const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sapId: {
    type: String,
    required: true,
    trim: true
  }
});

const teamSchema = new mongoose.Schema({
  captainName: {
    type: String,
    required: true,
    trim: true
  },
  teamLOB: {
    type: String,
    required: true,
    trim: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Game'
  },
  players: [playerSchema]
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
