const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        ref: 'User',
        type: Schema.Types.ObjectId
    }
});
module.exports = mongoose.model("Review", reviewSchema);