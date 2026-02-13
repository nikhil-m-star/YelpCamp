const mongoose = require('mongoose');
const Campground = require('./Models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
    console.log("Database connected!");

    // Check count
    const count = await Campground.countDocuments({});
    console.log(`\nTotal Campgrounds: ${count}`);

    // Show first 3
    if (count > 0) {
        const samples = await Campground.find({}).limit(3);
        console.log("\nSample Data:");
        console.log(samples);
    }

    mongoose.connection.close();
});
