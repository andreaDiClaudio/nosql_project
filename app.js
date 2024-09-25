// 'use strict' enforces stricter parsing and error handling, helping.
'use strict';

import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js"; // Import the db connection
import { User, TravelDestination, Location, Country } from './model.js'; // Import your models

// Import the express module to create a web server
const app = express();
// Load environment variables from a .env file into process.env
dotenv.config();

// Connect to MongoDB
connectDB();

// Test get request that returns all data from the database
app.get('/api/test', async (req, res) => {
    try {
        const users = await User.find();
        const travelDestinations = await TravelDestination.find().populate('userId locationId'); // Populate to get user and location details
        const locations = await Location.find().populate('countryId'); // Populate to get country details
        const countries = await Country.find();

        res.status(200).json({
            users,
            travelDestinations,
            locations,
            countries
        });
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
});

// Define the port on which the server will listen, using an environment variable
const PORT = process.env.PORT;
// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
});
