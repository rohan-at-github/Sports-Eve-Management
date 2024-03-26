  const express = require('express');
  const router = express.Router();
  const Team = require('../models/team'); // Update with the correct path to your Team model
  const Game = require('../models/game'); // Update with the correct path to your Game model

  // POST: Create a new team, ensuring SAP IDs are unique
  router.post('/', async (req, res) => {
    const { players, game } = req.body;

    // Extract SAP IDs
    const sapIds = players.map(player => player.sapId);

    // Check for existing players with the same SAP IDs in the same game
    const existingPlayersInGame = await Team.find({
        game: game,
        'players.sapId': { $in: sapIds }
    });

    if (existingPlayersInGame.length > 0) {
        return res.status(400).send({ message: 'One or more SAP IDs are already assigned to a team in this game.' });
    }

    try {
        const team = new Team(req.body);
        await team.save();
        res.status(201).send(team);
    } catch (error) {
        res.status(400).send(error);
    }
  });

  // GET: Retrieve all teams
  router.get('/', async (req, res) => {
    try {
      const teams = await Team.find().populate('game', 'name -_id');
      res.status(200).send(teams);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  // GET: Retrieve a single team by ID
  router.get('/:id', async (req, res) => {
    try {
      const team = await Team.findById(req.params.id).populate('game', 'name _id');
      if (!team) {
        return res.status(404).send();
      }
      res.send(team);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  // PUT: Update a team by ID
  // PUT: Update a team, ensuring SAP IDs are unique
  router.patch('/updatePlayer/:teamId', async (req, res) => {
    const { teamId } = req.params;
    const { sapId, updatedPlayer, gameId } = req.body;
  
    // Validate inputs
    if (!teamId || !sapId || !updatedPlayer || !gameId) {
      return res.status(400).send({ message: 'Missing required fields.' });
    }
  
    try {
      // Find the team by ID
      const team = await Team.findById(teamId);
  
      // If team is not found, return an error
      if (!team) {
        return res.status(404).send({ message: 'Team not found.' });
      }
  
      // Check if updated SAP ID is unique within the same game
      if (updatedPlayer.sapId !== sapId) {
        const isSapIdTaken = await Team.findOne({
          game: gameId,
          'players.sapId': updatedPlayer.sapId
        });
  
        // If the SAP ID is taken, return an error
        if (isSapIdTaken) {
          return res.status(400).send({ message: 'The new SAP ID is already taken by another player in this game.' });
        }
      }
  
      // Find the player by original SAP ID within the team
      const playerIndex = team.players.findIndex(player => player.sapId === sapId);
  
      // If player is not found, return an error
      if (playerIndex === -1) {
        return res.status(404).send({ message: 'Player not found.' });
      }
  
      // Update player details
      team.players[playerIndex] = {
        ...team.players[playerIndex],
        name: updatedPlayer.name,
        sapId: updatedPlayer.sapId
      };
  
      // Save the updated team
      await team.save();
  
      // Send success response
      return res.status(200).send({ message: 'Player details updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Server error while updating player.', error: error.message });
    }
  });
  


    

  // DELETE: Delete a team by ID
  router.delete('/:id', async (req, res) => {
    try {
      const team = await Team.findByIdAndDelete(req.params.id);
      if (!team) {
        return res.status(404).send();
      }
      res.send({ message: 'Team successfully deleted' });
    } catch (error) {
      res.status(500).send(error);
    }
  });

  module.exports = router;
