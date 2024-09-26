// 'use strict' enforces stricter parsing and error handling, helping.
"use strict";
import { MongoClient, ServerApiVersion } from "mongodb"; // Import MongoClient, ServerApiVersion, and ObjectId

import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js"; // Import the db connection
import { User, TravelDestination, Location, Country } from "./model.js"; // Import your models

// Import the express module to create a web server
const app = express();

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// Load environment variables from a .env file into process.env
dotenv.config();

// Connect to MongoDB
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read all travel destinations
app.get("/api/traveldestinations", async (req, res) => {
  try {
    const traveldestinations = await TravelDestination.find();
    console.log("receiving TDs");
    res.status(200).json(traveldestinations);
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});
// Read a travel destination by id

app.get("/api/traveldestinations/:id", async (req, res) => {
  try {
    const travelDestination = await TravelDestination.findOne(req.params.id);
    console.log("receiving TD");
    res.status(200).json(travelDestination);
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
  }
});

// create a travel destination
// app.post("/api/traveldestinations", async (req, res) => {
//   try {
//     console.log(req.body);
//     const title = req.body.title;
//     const description = req.body.description;
//     const locationId = req.body.locationId;
//     const picture = req.body.picture;
//     const dateFrom = new Date(2024, 0, 1);
//     const dateTo = new Date(2024, 11, 31);
//     const userId = req.body.userId;
//     const createDate = new Date();

//     const traveldestination = {
//       destinationId: 10,
//       title: title,
//       description: description,
//       locationId: locationId,
//       picture: picture,
//       dateFrom: dateFrom,
//       dateTo: dateTo,
//       userId: userId,
//       createDate: createDate,
//     };
//     await client.connect(); // Connect to MongoDB
//     const myDB = client.db("nosql_project"); // Select the database
//     const myColl = myDB.collection("traveldestinations"); // Select the collection
//     const result = await myColl.insertOne(traveldestination);

//     console.log(`A document was inserted with the _id: ${result.insertedId}`);
//     res.status(200).json(traveldestination);
//   } catch (error) {
//     console.error(`Error fetching data: ${error.message}`);
//   }
// });

// Define the port on which the server will listen, using an environment variable
const PORT = process.env.PORT;
// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
