const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for User data
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
    // Password is only required for local auth, not for Clerk users (if integrated later)
    password: {
        type: String,
        required: false
    },
    // CLERK ID for third-party auth integration
    clerkId: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined values for local users
    }
})

module.exports = mongoose.model('User', userSchema);