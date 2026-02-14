import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useUser } from '@clerk/clerk-react';

export default function Home() {
    const { user: localUser } = useContext(AuthContext);
    const { isSignedIn, isLoaded } = useUser();
    const isLoggedIn = !!localUser || (isLoaded && isSignedIn);

    return (
        <div className="home-hero">
            <div className="hero-content">
                <h1 className="hero-title">
                    Discover Nature's <br />
                    <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>Finest Escapes</span>
                </h1>
                <p className="hero-description">
                    Curated campgrounds for the discerning traveler. <br />
                    Experience the wild in unparalleled comfort.
                </p>
                <div className="hero-buttons">
                    <Link to="/campgrounds" className="btn btn-primary">
                        Explore Collection
                    </Link>
                    {isLoggedIn ? (
                        <Link to="/campgrounds/new" className="btn btn-secondary">
                            New Campground
                        </Link>
                    ) : (
                        <Link to="/register" className="btn btn-secondary">
                            Join Membership
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
