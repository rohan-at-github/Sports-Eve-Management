// routes/games.js
const express = require('express');
const router = express.Router();
const Game = require('../models/game'); // Adjust the path as per your structure

// Create a new game
// router.post('/', async (req, res) => {
//     console.log("POST /api/games hit", req.body);
//     try {
//       const game = new Game(req.body);
//       await game.save();
//       res.status(201).send(game);
//     } catch (error) {
//       console.error("Error saving game:", error);
//       res.status(400).send(error);
//     }
//   });
  

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).send(games);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add more routes as needed for updating and deleting games

module.exports = router;
