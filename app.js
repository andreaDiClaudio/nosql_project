// 'use strict' enforces stricter parsing and error handling, helping.
'use strict';

import express from "express";
import dotenv from "dotenv";

// Import the express module to create a web server
const app = express();
// Load environment variables from a .env file into process.env
dotenv.config();

// Test get request
app.get('/api/test', (req, res) => {
    res.status(200).json({message: 'Hello World'});
});


// Define the port on which the server will listen, using an environment variable
const PORT = process.env.PORT;
// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
});
