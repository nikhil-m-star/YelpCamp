const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false // Password is not required for Clerk users
    },
    clerkId: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined values for local users
    }
})

module.exports = mongoose.model('User', userSchema);