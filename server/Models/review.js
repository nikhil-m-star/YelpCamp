const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for Review data
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    // Reference to the User who wrote the review
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Review", reviewSchema);