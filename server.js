    // server.js
    const express = require('express');
    const cors = require('cors');
    const mongoose = require('mongoose');
    const gamesRouter = require('./routes/games'); // Adjust the path as per your structure
    const teamRoutes = require('./routes/teams'); // Adjust the path as necessary
    const matchesRouter = require('./routes/matches'); // Adjust the path as needed

    const app = express();
    const PORT = process.env.PORT || 3006;

    // Middleware
    app.use(cors());
    app.use(express.json()); // Ensure this is before your routes
    app.use('/api/games', gamesRouter);
    app.use('/api/teams', teamRoutes);
    app.use('/api/matches', matchesRouter);

    // Connect to MongoDB
    mongoose.connect('mongodb://127.0.0.1:27017/sportathon', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));


    // Routes

    // Starting the server
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });

    