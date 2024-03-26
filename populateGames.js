const mongoose = require('mongoose');
const Game = require('./models/game'); // Update the path according to your structure

mongoose.connect('mongodb://127.0.0.1:27017/sportathon', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');

  const gamesData = [
    { name: 'Futsal', teamSize: 6 },
    { name: 'Volleyball', teamSize: 6 },
    { name: 'Box-Cricket', teamSize: 6 },
    { name: 'Kho-Kho', teamSize: 6 },
    { name: 'Tug-Of-War', teamSize: 6 }
  ];

  gamesData.forEach(async (gameData) => {
    const gameExists = await Game.findOne({ name: gameData.name });
    if (!gameExists) {
      const game = new Game(gameData);
      await game.save();
      console.log(`Game ${game.name} added.`);
    }
  });

}).catch(err => console.error('Could not connect to MongoDB...', err));
