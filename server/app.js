const express = require("express");
const app = express();
const cors = require("cors");
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

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the YelpCamp API" });
})
app.use(express.urlencoded({extended:true}));
app.get('/campgrounds',async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.json(campgrounds);
})


app.post('/campgrounds',async (req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.json(campground);
})
app.get('/campgrounds/:id',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.json(campground);
})
app.get('/campgrounds/:id/edit',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.json(campground);
})
app.delete('/campgrounds/:id',async(req,res)=>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.json({message:"Deleted"});
})
app.listen(3000, () => {
    console.log("Server running at port 3000");
    
})

app.put('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...
        req.body.campground},{new:true});
        res.json(campground);

})
