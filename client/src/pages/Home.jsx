import { Link } from 'react-router-dom';

export default function Home() {
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
                    <Link to="/register" className="btn btn-secondary">
                        Join Membership
                    </Link>
                </div>
            </div>
        </div>
    );
}
