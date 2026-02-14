import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useContext, useState } from 'react';
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const getLinkClass = (path) => {
        return location.pathname === path ? 'nav-link active' : 'nav-link';
    };

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <div className="nav-left">
                    <Link to="/" className="nav-brand">
                        YelpCamp
                    </Link>
                    <div className="desktop-menu">
                        <Link to="/" className={getLinkClass('/')}>Home</Link>
                        <Link to="/campgrounds" className={getLinkClass('/campgrounds')}>Campgrounds</Link>
                        <Link to="/campgrounds/new" className={getLinkClass('/campgrounds/new')}>New Campground</Link>
                    </div>
                </div>

                <div className="nav-right">
                    {/* Clerk Auth */}
                    <SignedIn>
                        <div className="clerk-user-btn">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>

                    {/* Local Auth or Guest */}
                    <SignedOut>
                        {user ? (
                            <div className="user-menu">
                                <span className="welcome-text">Welcome, <strong>{user.username}</strong></span>
                                <button onClick={logout} className="btn-logout">Logout</button>
                            </div>
                        ) : (
                            <div className="auth-links">
                                <Link to="/login" className="nav-link">Login</Link>
                                <Link to="/register" className="btn btn-primary">Register</Link>
                            </div>
                        )}
                    </SignedOut>
                </div>

                {/* Mobile Menu Button */}
                <div className="mobile-menu-btn">
                    <button onClick={() => setIsOpen(!isOpen)} className="btn-icon">
                        <span className="sr-only">Open main menu</span>
                        {!isOpen ? (
                            <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        ) : (
                            <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="mobile-menu">
                    <div className="mobile-nav-links">
                        <Link to="/" className="mobile-link">Home</Link>
                        <Link to="/campgrounds" className="mobile-link">Campgrounds</Link>
                        <Link to="/campgrounds/new" className="mobile-link">New Campground</Link>
                    </div>
                    <div className="mobile-auth">
                        <SignedIn>
                            <div className="mobile-user">
                                <span>My Account</span>
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </SignedIn>
                        <SignedOut>
                            {user ? (
                                <div className="mobile-user">
                                    <div className="user-info">
                                        <div className="user-name">{user.username}</div>
                                        <div className="user-email">{user.email}</div>
                                    </div>
                                    <button onClick={logout} className="btn-logout">Logout</button>
                                </div>
                            ) : (
                                <div className="mobile-auth-links">
                                    <Link to="/login" className="mobile-link">Login</Link>
                                    <Link to="/register" className="btn btn-primary">Register</Link>
                                </div>
                            )}
                        </SignedOut>
                    </div>
                </div>
            )}
        </nav>
    );
}