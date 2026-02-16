// Express & Middleware
const express = require("express");
const app = express();
const cors = require("cors");
const methodOverride = require('method-override');

// Models & Auth
const Review = require('./Models/review');
const User = require('./Models/user');
const Campground = require("./Models/campground");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('./middleware');

// Geocoding & Maps
const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({ provider: 'openstreetmap' });

require('dotenv').config();

// Image Upload Configuration (Multer + Cloudinary)
const multer = require('multer');
const { storage } = require('./cloudinary');
const upload = multer({ storage });

// CORS Configuration — allow frontend origin
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all in case of misconfigured origin
        }
    },
    credentials: true
}));

// Parsing Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(methodOverride('_method')); // Allow PUT/DELETE via POST query param

// Database Connection
const mongoose = require("mongoose");
const dbUrl = process.env.dbUrl || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// ========================
// AUTH ROUTES
// ========================

// Register a new user
app.post('/api/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, username, password: hashedPassword });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user._id, username: user.username } });
    }
    catch (e) {
        res.status(400).json({ message: "Error registering user" })
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: "Invalid username or password" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid username or password" });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user._id, username: user.username } });
    }
    catch (e) {
        res.status(500).json({ message: "Error logging in" });
    }
});

// ========================
// CAMPGROUND ROUTES
// ========================

app.get("/api", (req, res) => {
    res.json({ message: "Welcome to the YelpCamp API" });
});

// Get all campgrounds
app.get('/api/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.json(campgrounds);
});

// Create new campground (Requires Auth)
app.post('/api/campgrounds', isLoggedIn, upload.array('image'), async (req, res) => {
    // Geocode the location
    const geoResponse = await geocoder.geocode(req.body.campground.location);
    const campground = new Campground(req.body.campground);
    campground.geometry = {
        type: 'Point',
        coordinates: [geoResponse[0].longitude, geoResponse[0].latitude]
    };
    // Map uploaded files to schema format
    campground.image = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }));
    campground.author = req.user.userId;
    await campground.save();
    res.json(campground);
});

// Get campground details (Populates reviews and authors)
app.get('/api/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    res.json(campground);
});

// Get data for edit form
app.get('/api/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.json(campground);
});

// Update campground (Requires Auth)
app.put('/api/campgrounds/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    }, { new: true });
    res.json(campground);
});

// Delete campground (Requires Auth)
app.delete('/api/campgrounds/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
});

// ========================
// REVIEW ROUTES
// ========================

// Add a review to a campground
app.post('/api/campgrounds/:id/reviews', isLoggedIn, async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user.userId;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.json(campground);
});

// Delete a review
app.delete('/api/campgrounds/:id/reviews/:reviewId', isLoggedIn, async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.json({ message: "Deleted" });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

module.exports = app;
