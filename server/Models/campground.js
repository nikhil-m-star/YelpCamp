const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for Campground data
const CampgroundSchema = new Schema({
    title: String,
    // Array of images with URL and filename (for Cloudinary)
    image: [{ url: String, filename: String }],
    price: Number,
    description: String,
    location: String,
    // GeoJSON format for location storing
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    // Array of Review references
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    // Reference to User who created the campground
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);