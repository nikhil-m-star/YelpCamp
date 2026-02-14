import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useUser, useAuth } from '@clerk/clerk-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function StarRating({ value, onChange }) {
    const [hover, setHover] = useState(0);
    const labels = ['', 'Terrible', 'Bad', 'Average', 'Good', 'Excellent'];
    return (
        <div className="star-rating-picker">
            <div className="stars-row">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        type="button"
                        key={star}
                        className={`star-btn ${star <= (hover || value) ? 'filled' : ''}`}
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                    >★</button>
                ))}
            </div>
            <span className="star-label">{labels[hover || value] || 'Select a rating'}</span>
        </div>
    );
}

export default function CampgroundShow() {
    const { id } = useParams();
    const [campground, setCampground] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [rating, setRating] = useState(3);
    const { user: localUser, token: localToken } = useContext(AuthContext);
    const { user: clerkUser } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCamp = async () => {
            const res = await axios.get(`http://localhost:3000/campgrounds/${id}`);
            setCampground(res.data);
        };
        fetchCamp();
    }, [id]);

    const getAuthToken = async () => {
        if (localToken) return localToken;
        return await getToken();
    };

    const handleDelete = async () => {
        const token = await getAuthToken();
        await axios.delete(`http://localhost:3000/campgrounds/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/campgrounds');
    };

    if (!campground) return (
        <div className="container loading-state">Loading...</div>
    );

    const isAuthor = (localUser && localUser.id === campground.author._id) ||
        (clerkUser && campground.author.clerkId && clerkUser.id === campground.author.clerkId);

    return (
        <div className="container">
            <div className="show-layout">
                {/* Left Column */}
                <div className="show-main">
                    <div className="show-card">
                        <div className="carousel-container">
                            {campground.image.length > 0 ? (
                                <>
                                    <img
                                        src={campground.image[activeIndex].url}
                                        alt={campground.title}
                                        className="carousel-image"
                                    />
                                    {campground.image.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setActiveIndex(prev => prev === 0 ? campground.image.length - 1 : prev - 1)}
                                                className="carousel-btn prev"
                                            >&#10094;</button>
                                            <button
                                                onClick={() => setActiveIndex(prev => prev === campground.image.length - 1 ? 0 : prev + 1)}
                                                className="carousel-btn next"
                                            >&#10095;</button>
                                            <div className="carousel-indicators">
                                                {campground.image.map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`indicator ${i === activeIndex ? 'active' : ''}`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="card-no-image">No images available</div>
                            )}
                        </div>
                        <div className="show-content">
                            <h1 className="show-title">{campground.title}</h1>
                            <p className="show-location">{campground.location}</p>
                            <p className="show-price">${campground.price}<span className="show-price-unit">/night</span></p>
                            <p className="show-description">{campground.description}</p>
                            <p className="show-submitted-by">Submitted by {campground.author.username}</p>

                            {isAuthor && (
                                <div className="action-buttons">
                                    <Link to={`/campgrounds/${id}/edit`} className="btn btn-primary">Edit</Link>
                                    <button onClick={handleDelete} className="btn btn-danger">Delete</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="review-section">
                        <h2>Reviews ({campground.reviews.length})</h2>
                        {campground.reviews.length === 0 && (
                            <p className="no-reviews">No reviews yet. Be the first!</p>
                        )}
                        {campground.reviews.map(rev => {
                            const isReviewAuthor = (localUser && localUser.id === rev.author._id) ||
                                (clerkUser && rev.author.clerkId && clerkUser.id === rev.author.clerkId);
                            return (
                                <div key={rev._id} className="review-card">
                                    <div className="review-header">
                                        <span className="review-author">{rev.author.username}</span>
                                        <span className="review-rating">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                                    </div>
                                    <p className="review-body">{rev.body}</p>
                                    {isReviewAuthor && (
                                        <button onClick={async () => {
                                            const token = await getAuthToken();
                                            await axios.delete(`http://localhost:3000/campgrounds/${id}/reviews/${rev._id}`, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            navigate(0);
                                        }} className="btn btn-danger btn-sm">
                                            Delete Review
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Map & Review Form */}
                <div className="show-sidebar">
                    <div className="map-card">
                        {campground.geometry && (
                            <MapContainer
                                center={[campground.geometry.coordinates[1], campground.geometry.coordinates[0]]}
                                zoom={13}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[campground.geometry.coordinates[1], campground.geometry.coordinates[0]]}>
                                    <Popup>{campground.title}</Popup>
                                </Marker>
                            </MapContainer>
                        )}
                    </div>

                    <div className="card review-form-card">
                        <h3 className="review-form-title">Leave a Review</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const body = e.target.body.value;
                            const token = await getAuthToken();
                            await axios.post(`http://localhost:3000/campgrounds/${id}/reviews`, { review: { body, rating } }, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            navigate(0);
                        }}>
                            <div className="input-group">
                                <label className="input-label">Rating</label>
                                <StarRating value={rating} onChange={setRating} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Review</label>
                                <textarea name="body" className="form-control" rows="3" placeholder="Share your experience..." required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Submit Review</button>
                        </form>
                    </div>

                    <Link to="/campgrounds" className="btn btn-secondary btn-block back-btn">
                        ← Back to All Campgrounds
                    </Link>
                </div>
            </div>
        </div>
    );
}