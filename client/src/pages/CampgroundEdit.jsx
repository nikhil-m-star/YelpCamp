import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '@clerk/clerk-react';
import API from '../api';

export default function CampgroundEdit() {
    const { id } = useParams();
    const { token: localToken } = useContext(AuthContext);
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');

    // Fetch existing data to pre-fill the form
    useEffect(() => {
        const fetchCamp = async () => {
            try {
                const res = await axios.get(`${API}/api/campgrounds/${id}`);
                setTitle(res.data.title);
                setLocation(res.data.location);
            } catch (e) {
                console.error("Error fetching campground for edit", e);
            }
        }
        fetchCamp();
    }, [id]);

    // Handle Update Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        let token = localToken;
        if (!token) {
            token = await getToken();
        }
        const updatedCamp = { campground: { title, location } };

        try {
            await axios.put(`${API}/api/campgrounds/${id}`, updatedCamp, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/campgrounds/${id}`);
        } catch (e) {
            console.error("Update failed", e);
        }
    }

    return (
        <div className="form-page-container">
            <div className="form-card">
                <h1 className="form-card-title">Edit Campground</h1>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Title</label>
                        <input
                            type="text"
                            className="form-control"
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
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary btn-block">
                            Update Campground
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/campgrounds/${id}`)}
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
