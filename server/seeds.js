const mongoose = require('mongoose');
const Campground = require('./Models/campground');
const User = require('./Models/user');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to Database for Seeding
mongoose.connect(process.env.dbUrl || 'mongodb://localhost:27017/yelp-camp');

// Sample Data for Campgrounds
const seedData = [
    {
        title: 'Sunset Ridge Camp',
        price: 35,
        description: 'A stunning campsite perched on a ridge with panoramic sunset views. Wake up above the clouds and fall asleep under a canopy of stars. The site features level tent pads and fire rings.',
        location: 'Asheville, North Carolina',
        geometry: { type: 'Point', coordinates: [-82.5515, 35.5951] },
        // Unsplash Source Image
        image: [{ url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', filename: 'camp1' }]
    },
    // ... (other items usually remain the same, mostly data)
    {
        title: 'Whispering Pines Retreat',
        price: 28,
        description: 'Nestled deep within an ancient pine forest, this secluded campsite offers the ultimate escape. Listen to the wind through the trees and spot wildlife along the nearby creek trails.',
        location: 'Lake Tahoe, California',
        geometry: { type: 'Point', coordinates: [-120.0324, 38.9399] },
        image: [{ url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800', filename: 'camp2' }]
    },
    {
        title: 'Lakeside Haven',
        price: 42,
        description: 'Camp right on the shores of a crystal-clear mountain lake. Perfect for kayaking, fishing, and swimming. Includes a private dock and waterfront fire pit area.',
        location: 'Glacier National Park, Montana',
        geometry: { type: 'Point', coordinates: [-113.7870, 48.7596] },
        image: [{ url: 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=800', filename: 'camp3' }]
    },
    {
        title: 'Desert Stargazer Camp',
        price: 22,
        description: 'Located in a remote desert valley with zero light pollution. The night sky here is absolutely breathtaking — perfect for astrophotography and stargazing enthusiasts.',
        location: 'Sedona, Arizona',
        geometry: { type: 'Point', coordinates: [-111.7610, 34.8697] },
        image: [{ url: 'https://images.unsplash.com/photo-1532339142463-fd0a8979791a?w=800', filename: 'camp4' }]
    },
    {
        title: 'Misty Mountain Base Camp',
        price: 30,
        description: 'Set at the base of towering mountain peaks, this campsite is a launchpad for epic day hikes. Morning mist rolls through the valley creating an ethereal atmosphere.',
        location: 'Great Smoky Mountains, Tennessee',
        geometry: { type: 'Point', coordinates: [-83.5070, 35.6532] },
        image: [{ url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800', filename: 'camp5' }]
    },
    {
        title: 'Coastal Cliff Camp',
        price: 50,
        description: 'Dramatic oceanside camping on rugged coastal cliffs. Fall asleep to the sound of crashing waves below. Whale watching from your tent is not uncommon during migration season.',
        location: 'Big Sur, California',
        geometry: { type: 'Point', coordinates: [-121.8947, 36.2704] },
        image: [{ url: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800', filename: 'camp6' }]
    },
    {
        title: 'Autumn Hollow Grounds',
        price: 25,
        description: 'A beautiful woodland campsite that transforms into a sea of red and gold during fall. Features walking trails through old-growth forest and a natural spring water source.',
        location: 'Shenandoah Valley, Virginia',
        geometry: { type: 'Point', coordinates: [-78.8689, 38.2930] },
        image: [{ url: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800', filename: 'camp7' }]
    },
    {
        title: 'Meadow Creek Campground',
        price: 20,
        description: 'A family-friendly campsite next to a gentle creek running through wildflower meadows. Great for beginners — flat ground, easy access, and a short hike to a stunning waterfall.',
        location: 'Yosemite, California',
        geometry: { type: 'Point', coordinates: [-119.5383, 37.8651] },
        image: [{ url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800', filename: 'camp8' }]
    },
    {
        title: 'Fjord View Wilderness',
        price: 55,
        description: 'Premium backcountry camping overlooking a glacial fjord. Remote and pristine, this site requires a 3-mile hike in but rewards you with views that will take your breath away.',
        location: 'Olympic National Park, Washington',
        geometry: { type: 'Point', coordinates: [-123.4979, 47.8021] },
        image: [{ url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800', filename: 'camp9' }]
    }
];

// Main Seeding Function
// Wipes the DB and inserts sample data with a default 'admin' user
async function seedDB() {
    try {
        // Create a dummy user to be the author
        let user = await User.findOne({ username: 'admin' });
        if (!user) {
            const hashedPassword = await bcrypt.hash('password123', 12);
            user = new User({ email: 'admin@yelpcamp.com', username: 'admin', password: hashedPassword });
            await user.save();
            console.log('Created admin user');
        }

        // Clear existing campgrounds
        await Campground.deleteMany({});
        console.log('Cleared existing campgrounds');

        // Insert seed data with author
        for (const camp of seedData) {
            const c = new Campground({ ...camp, author: user._id });
            await c.save();
        }

        console.log(`Seeded ${seedData.length} campgrounds!`);
        console.log('Done. You can close this now.');
    } catch (e) {
        console.error('Seed error:', e);
    } finally {
        mongoose.connection.close();
    }
}

seedDB();
