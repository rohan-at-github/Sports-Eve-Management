const express = require('express');
const router = express.Router();
const Team = require('../models/team'); // Update with the correct path to your Team model
const Game = require('../models/game'); // Update with the correct path to your Game model

// POST: Create a new team, ensuring SAP IDs are unique
router.post('/', async (req, res) => {
    const { players } = req.body;
    
    // Extract SAP IDs and check for uniqueness
    const sapIds = players.map(player => player.sapId);
    const existingPlayer = await Team.findOne({ 'players.sapId': { $in: sapIds } });
  
    if (existingPlayer) {
      return res.status(400).send({ message: 'One or more SAP IDs are already assigned to a team.' });
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
    const team = await Team.findById(req.params.id).populate('game', 'name -_id');
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
// router.put('/:id', async (req, res) => {
//     const { players } = req.body;
//     const teamId = req.params.id;
  
//     // Extract SAP IDs and check for uniqueness across other teams
//     const sapIds = players.map(player => player.sapId);
//     const existingPlayer = await Team.findOne({
//       _id: { $ne: teamId },
//       'players.sapId': { $in: sapIds }
//     });
  
//     if (existingPlayer) {
//       return res.status(400).send({ message: 'One or more SAP IDs are already assigned to a team.' });
//     }
  
//     try {
//       const team = await Team.findByIdAndUpdate(teamId, req.body, { new: true, runValidators: true });
//       if (!team) {
//         return res.status(404).send();
//       }
//       res.send(team);
//     } catch (error) {
//       res.status(400).send(error);
//     }
//   });
  

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
