const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    enum: ['Futsal', 'Volleyball', 'Box-Cricket', 'Kho-Kho', 'Tug-Of-War']
  },
  // You can add additional fields relevant to each game here.
  // For example, team size or a description of the game.
  teamSize: {
    type: Number,
    required: true
  },
  description: String
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
