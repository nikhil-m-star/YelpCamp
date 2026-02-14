import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function CampgroundIndex() {
    const [campgrounds, setCampgrounds] = useState([]);

    useEffect(() => {
        const fetchCampgrounds = async () => {
            const res = await axios.get('http://localhost:3000/campgrounds');
            setCampgrounds(res.data);
        };
        fetchCampgrounds();
    }, []);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">All Campgrounds</h1>
                <p className="page-subtitle">Discover your next outdoor adventure</p>
            </div>
            <div className="campground-grid">
                {campgrounds.map(camp => (
                    <Link to={`/campgrounds/${camp._id}`} key={camp._id} className="campground-card">
                        <div className="card-image-container">
                            {camp.image && camp.image.length > 0 ? (
                                <img src={camp.image[0].url} alt={camp.title} className="card-image" />
                            ) : (
                                <div className="card-no-image">No Image</div>
                            )}
                        </div>
                        <div className="card-content">
                            <h2 className="card-title">{camp.title}</h2>
                            <p className="card-location">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="card-icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                {camp.location}
                            </p>
                            <p className="card-description">{camp.description}</p>
                            <div className="card-footer">
                                <span className="card-price">${camp.price}<span className="card-price-unit">/night</span></span>
                                <span className="card-link-text">View Details →</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {campgrounds.length === 0 && (
                <div className="empty-state">
                    <p>No campgrounds found. Be the first to add one!</p>
                    <Link to="/campgrounds/new" className="btn btn-primary">Add Campground</Link>
                </div>
            )}
        </div>
    );
}