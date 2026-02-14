const express = require("express");
const app = express();
const cors = require("cors");
const Review = require('./Models/review');
const User = require('./Models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('./middleware');
const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({ provider: 'openstreetmap' });

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const multer = require('multer');
const { storage } = require('./cloudinary');
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./Models/campground");
const methodOverride = require('method-override');

app.use(methodOverride('_method'));

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connnected");
});

app.post('/register', async (req, res) => {
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
})

app.post('/login', async (req, res) => {
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
})



app.get("/", (req, res) => {
    res.json({ message: "Welcome to the YelpCamp API" });
})
app.use(express.urlencoded({ extended: true }));
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.json(campgrounds);
})


app.post('/campgrounds', isLoggedIn, upload.array('image'), async (req, res) => {
    const geoResponse = await geocoder.geocode(req.body.campground.location);
    const campground = new Campground(req.body.campground);
    campground.geometry = {
        type: 'Point',
        coordinates: [geoResponse[0].longitude, geoResponse[0].latitude]
    };  
    campground.image = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }));
    campground.author = req.user.userId;
    await campground.save();
    res.json(campground);
})
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    res.json(campground);
})
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);

    res.json(campground);
})
app.delete('/campgrounds/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
})
app.post('/campgrounds/:id/reviews', isLoggedIn, async (req, res) => {
    const campground = await Campground.findById(req.params.id);

    const review = new Review(req.body.review);
    review.author = req.user.userId;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.json(campground);
})
app.delete('/campgrounds/:id/reviews/:reviewId', isLoggedIn, async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.json({ message: "Deleted" });
})
app.listen(3000, () => {
    console.log("Server running at port 3000");

})

app.put('/campgrounds/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...
        req.body.campground
    }, { new: true });
    res.json(campground);

})
