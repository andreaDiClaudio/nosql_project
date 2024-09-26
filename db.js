import mongoose from 'mongoose';
import { User, TravelDestination, Location, Country } from './model.js';

// Function to generate a unique ID
const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return timestamp + randomNum;
};

// Connect to the database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);

        // Check existing collections
        const collections = await conn.connection.db.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);
        console.log('Existing collections:', collectionNames);

        // Create and populate Countries collection if it doesn't exist or is empty
        let countryId; // Variable to hold generated country ID
        if (!collectionNames.includes('countries') || (await Country.countDocuments()) === 0) {
            await Country.init();
            console.log('Created Countries collection');
            await Country.createIndexes({ countryId: 1 }); // Create index for countryId
            
            // Generate unique countryId
            countryId = generateUniqueId();
            await Country.create({
                countryId: countryId, // Use generated ID
                country: "Italy"
            });
            console.log('Added default country to Countries collection');
        }

        // Create and populate Locations collection if it doesn't exist or is empty
        let locationId; // Variable to hold generated location ID
        if (!collectionNames.includes('locations') || (await Location.countDocuments()) === 0) {
            await Location.init();
            console.log('Created Locations collection');
            await Location.createIndexes({ locationId: 1 }); // Create index for locationId
            
            // Use the generated countryId to reference the created country
            locationId = generateUniqueId();
            await Location.create({
                locationId: locationId, // Use generated ID
                location: "Rome",
                countryId: countryId // Reference the created countryId
            });
            console.log('Added default location to Locations collection');
        }

        // Create and populate Users collection if it doesn't exist or is empty
        let userId; // Variable to hold generated user ID
        if (!collectionNames.includes('users') || (await User.countDocuments()) === 0) {
            await User.init();
            console.log('Created Users collection');
            await User.createIndexes({ userId: 1, email: 1 }); 
            
            // Generate unique userId
            userId = generateUniqueId();
            await User.create({
                userId: userId, // Use generated ID
                userName: "Andrea",
                email: "andrea@example.com",
                password: "password123",
                createDate: new Date()
            });
            console.log('Added default user to Users collection');
        }

        // Create and populate Travel Destinations collection if it doesn't exist or is empty
        if (!collectionNames.includes('traveldestinations') || (await TravelDestination.countDocuments()) === 0) {
            await TravelDestination.init();
            console.log('Created Travel Destinations collection');
            await TravelDestination.createIndexes({ destinationId: 1 }); // Create index for destinationId
            
            // Use the generated userId and locationId for references
            let destinationId = generateUniqueId(); // Generate unique destinationId
            await TravelDestination.create({
                destinationId: destinationId, // Use generated ID
                title: "Visit Rome",
                description: "A beautiful trip to Rome, Italy.",
                locationId: locationId, // Reference the created locationId
                picture: "http://example.com/image.jpg",
                dateFrom: new Date(),
                dateTo: new Date(new Date().setDate(new Date().getDate() + 7)),
                userId: userId, // Reference the created userId
                createDate: new Date()
            });
            console.log('Added default travel destination to Travel Destinations collection');
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
