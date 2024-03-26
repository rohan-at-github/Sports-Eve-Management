// routes/matches.js
const express = require('express');
const router = express.Router();
const Match = require('../models/match');
const mongoose = require('mongoose');
// Example function to call when a match result is updated
async function updateMatchResultAndAdvance(matchId, winner) {
    const match = await Match.findById(matchId);
    match.result = winner; // 'team1' or 'team2'
    await match.save();

    // Check if this match completes the current round
    const currentRoundMatches = await Match.find({ game: match.game, round: match.round });
    const isRoundComplete = currentRoundMatches.every(match => match.result !== 'pending');

    if (isRoundComplete) {
        // Logic to schedule next round matches
        const winners = currentRoundMatches.map(match => {
            return match.result === 'team1' ? match.teams[0] : match.teams[1];
        });

        // Example logic to pair winners and create matches for the next round
        // This is greatly simplified and needs to be adapted based on tournament format
        for (let i = 0; i < winners.length; i += 2) {
            const newMatch = new Match({
                game: match.game,
                teams: [winners[i], winners[i+1]], // This assumes an even number of winners
                round: match.round + 1,
                matchTime: calculateNextRoundTime(), // You'd need to implement this
                // other fields as necessary
            });
            await newMatch.save();
        }
    }
}


// Create a new match
    // router.post('/', async (req, res) => {
    //     const { teams, game } = req.body;

    //     // // Check if the match with the same teams and game already exists
    //     // const existingMatch = await Match.findOne({
    //     //     game: game,
    //     //     teams: { $all: teams } // $all matches an array exactly but order-independent
    //     // });

    //     // if (existingMatch) {
    //     //     return res.status(400).send({ message: 'This match has already been scheduled.' });
    //     // }

    //     try {
    //         const match = new Match(req.body);
    //         await match.save();
    //         res.status(201).send(match);
    //     } catch (error) {
    //         console.error(error); // Log the detailed error here
    //         res.status(400).send(error);
    //     }
    // });

    router.post('/', async (req, res) => {
        const { teams, game } = req.body;
    
        if (!Array.isArray(teams) || teams.length !== 2 || !game) {
            return res.status(400).send({ message: 'Invalid teams or game data.' });
        }
    
        try {
            // Create ObjectId instances from the provided team IDs and game ID
            const teamIds = teams.map(team => new mongoose.Types.ObjectId(team));
            const gameId = new mongoose.Types.ObjectId(game);
    
            // Check if a match with the same teams and game already exists
            const existingMatch = await Match.findOne({
                game: gameId,
                teams: { $all: teamIds, $size: 2 }
            });
    
            if (existingMatch) {
                return res.status(400).send({ message: 'This match has already been scheduled.' });
            }
    
            // If no existing match, create a new match document
            const match = new Match({
                teams: teamIds,
                game: gameId,
                ...req.body // Spread any other properties that might be present in the request
            });
            await match.save();
            res.status(201).send(match);
        } catch (error) {
            console.error(error); // Log the detailed error here
            res.status(400).send({ message: 'Error scheduling the match', error: error.message });
        }
    });
    
      

router.patch('/:matchId', async (req, res) => {
    const { matchId } = req.params;
    const { winnerTeamId } = req.body; // Use 'winnerTeamId' to specify the winning team's ID

    try {
        const match = await Match.findById(matchId);

        if (!match) {
            return res.status(404).send({ message: 'Match not found.' });
        }

        // Convert ObjectId to string for comparison
        const teamIds = match.teams.map(team => team.toString());

        // Check if 'winnerTeamId' is one of the teams in the match
        if (!teamIds.includes(winnerTeamId)) {
            return res.status(400).send({ message: 'The specified team is not part of this match.' });
        }

        // Update the winner of the match
        match.winner = winnerTeamId; // Assuming your Match model has a 'winner' field to store the winning team's ID
        await match.save();

        res.status(200).send(match);
    } catch (error) {
        res.status(400).send({ message: 'Error updating the match winner.', error: error });
    }
});


// Get all matches
router.get('/', async (req, res) => {
    let query = {};
    const { round, result } = req.query;
    
    // Build query based on the presence of query parameters
    if (round) query.round = round;
    if (result) query.result = result;

    try {
        const matches = await Match.find(query).populate('teams')//.populate('teams game', 'name -_id');
        res.send(matches);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Additional routes as needed

module.exports = router;
