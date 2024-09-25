// db.js
import mongoose from 'mongoose';
import { User, TravelDestination, Location, Country } from './model.js'; 

//connects to db and ,if not exists, creates schema with default sample data.
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);

        // Check existing collections
        const collections = await conn.connection.db.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);
        console.log('Existing collections:', collectionNames);

        // Create and populate Countries collection if it doesn't exist or is empty
        if (!collectionNames.includes('countries') || (await Country.countDocuments()) === 0) {
            await Country.init();
            console.log('Created Countries collection');
            await Country.create({
                countryId: "COUNTRY01",
                country: "Italy"
            });
            console.log('Added default country to Countries collection');
        }

        // Create and populate Locations collection if it doesn't exist or is empty
        if (!collectionNames.includes('locations') || (await Location.countDocuments()) === 0) {
            await Location.init();
            console.log('Created Locations collection');
            const country = await Country.findOne({ countryId: "COUNTRY01" }); // Fetch the default country
            await Location.create({
                locationId: "LOC01",
                location: "Rome",
                countryId: country._id // Reference the created country
            });
            console.log('Added default location to Locations collection');
        }

        // Create and populate Users collection if it doesn't exist or is empty
        if (!collectionNames.includes('users') || (await User.countDocuments()) === 0) {
            await User.init();
            console.log('Created Users collection');
            await User.create({
                userId: "USER01",
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
            const user = await User.findOne({ userId: "USER01" }); // Fetch the default user
            const location = await Location.findOne({ locationId: "LOC01" }); // Fetch the default location
            await TravelDestination.create({
                destinationId: "DEST01",
                title: "Visit Rome",
                description: "A beautiful trip to Rome, Italy.",
                locationId: location._id, // Reference the created location
                picture: "http://example.com/image.jpg",
                dateFrom: new Date(),
                dateTo: new Date(new Date().setDate(new Date().getDate() + 7)),
                userId: user._id, // Reference the created user
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
