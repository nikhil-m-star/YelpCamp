# YelpCamp

A fully functional campground rating and review application, built using the modern MERN stack.

## Tech Stack

**Frontend:**
- React (Vite)
- React Leaflet (Map integration)
- Clerk (Authentication)
- Axios

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- Cloudinary (Image storage)
- Node Geocoder & OpenStreetMap (Location services)

## Features

- **Campground Management**: Users can create, edit, and delete campgrounds.
- **Interactive Maps**: View campground locations on an interactive map using React Leaflet.
- **Reviews & Ratings**: Leave reviews and ratings for campgrounds.
- **Image Upload**: Upload images for campgrounds via Cloudinary.
- **User Authentication**: Secure login and signup handling using Clerk.
- **Search**: Find campgrounds by name or location.

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB installed locally or MongoDB Atlas URI
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd YelpCamp
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory with the following variables:
   ```env
   PORT=3000
   dbUrl=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_KEY=your_key
   CLOUDINARY_SECRET=your_secret
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   ```
   Start the server:
   ```bash
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```
   Start the client:
   ```bash
   npm run dev
   ```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
