import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '@clerk/clerk-react';
import API from '../api';

export default function CampgroundNew() {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const { token: localToken } = useContext(AuthContext);
    const { getToken } = useAuth();
    const navigate = useNavigate();

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Use FormData for file uploads (multipart/form-data)
        const formData = new FormData();
        formData.append('campground[title]', title);
        formData.append('campground[location]', location);
        formData.append('campground[price]', price);
        formData.append('campground[description]', description);

        // Append multiple images
        const files = e.target.image.files;
        for (let i = 0; i < files.length; i++) {
            formData.append('image', files[i]);
        }

        // Get Auth Token
        let token = localToken;
        if (!token) {
            token = await getToken();
        }

        try {
            const res = await axios.post(`${API}/api/campgrounds`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/campgrounds/${res.data._id}`);
        } catch (error) {
            console.error("Error creating campground", error);
        }
    };

    return (
        <div className="form-page-container">
            <div className="form-card">
                <h1 className="form-card-title">New Campground</h1>
                <p className="form-card-subtitle">Share your favorite camping spot</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Camp name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Location</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="City, State"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Price (per night)</label>
                        <div className="price-input-wrapper">
                            <span className="price-symbol">$</span>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="0.00"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Description</label>
                        <textarea
                            className="form-control"
                            placeholder="Tell us about the camp..."
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Upload Images</label>
                        <label className="file-upload-area">
                            <input
                                type="file"
                                name="image"
                                multiple
                                className="file-input-hidden"
                                onChange={(e) => {
                                    const label = e.target.closest('.file-upload-area');
                                    const info = label.querySelector('.file-upload-info');
                                    if (e.target.files.length > 0) {
                                        info.textContent = `${e.target.files.length} file(s) selected`;
                                    } else {
                                        info.textContent = 'Click to browse or drag files here';
                                    }
                                }}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="file-upload-icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className="file-upload-info">Click to browse or drag files here</span>
                        </label>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary btn-block">
                            Add Campground
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/campgrounds')}
                            className="btn btn-secondary btn-block"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}