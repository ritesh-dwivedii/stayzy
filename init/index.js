const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js'); // Import the Listing model

mongoose.mongoose.connect('mongodb://localhost:27017/stayzy')
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.error('Could not connect to MongoDB', err);
    });

    const initDB = async () => {
        await Listing.deleteMany({}); // Clear the database before seeding
        await Listing.insertMany(initdata.data); // Seed the database with initial data
        console.log('Database seeded successfully!');
    }

    initDB();