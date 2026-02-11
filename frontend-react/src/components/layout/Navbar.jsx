import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Film,
    Search,
    Menu,
    X,
    User,
    Ticket,
    LogOut,
    ChevronDown,
    LayoutDashboard
} from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { Button } from '@components/common/Button';
import './Navbar.css';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { isAuthenticated, user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsMenuOpen(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setIsUserMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <Film className="navbar-logo-icon" size={32} />
                    <span className="navbar-logo-text">CineBook</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-nav">
                    <Link
                        to="/movies"
                        className={`navbar-link ${isActive('/movies') ? 'active' : ''}`}
                    >
                        Movies
                    </Link>
                    <Link
                        to="/theaters"
                        className={`navbar-link ${isActive('/theaters') ? 'active' : ''}`}
                    >
                        Theaters
                    </Link>
                </div>

                {/* Search Bar */}
                <form className="navbar-search" onSubmit={handleSearch}>
                    <Search size={18} className="navbar-search-icon" />
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="navbar-search-input"
                    />
                </form>

                {/* Auth / User Menu */}
                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <div className="navbar-user-menu">
                            <button
                                className="navbar-user-trigger"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                <div className="navbar-user-avatar">
                                    {user?.firstName?.[0] || 'U'}
                                </div>
                                <span className="navbar-user-name">{user?.firstName}</span>
                                <ChevronDown size={16} className={`navbar-user-chevron ${isUserMenuOpen ? 'rotate' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div
                                        className="navbar-dropdown"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <Link
                                            to="/profile"
                                            className="navbar-dropdown-item"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <User size={18} />
                                            <span>Profile</span>
                                        </Link>
                                        <Link
                                            to="/my-bookings"
                                            className="navbar-dropdown-item"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <Ticket size={18} />
                                            <span>My Bookings</span>
                                        </Link>
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                className="navbar-dropdown-item"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <LayoutDashboard size={18} />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        )}
                                        <hr className="navbar-dropdown-divider" />
                                        <button
                                            className="navbar-dropdown-item navbar-dropdown-item-danger"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="navbar-auth">
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Sign In</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" size="sm">Sign Up</Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="navbar-mobile-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="navbar-mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <form className="navbar-mobile-search" onSubmit={handleSearch}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>

                        <Link
                            to="/movies"
                            className="navbar-mobile-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Movies
                        </Link>
                        <Link
                            to="/theaters"
                            className="navbar-mobile-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Theaters
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="navbar-mobile-link"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/my-bookings"
                                    className="navbar-mobile-link"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Bookings
                                </Link>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="navbar-mobile-link"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    className="navbar-mobile-link navbar-mobile-logout"
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="navbar-mobile-auth">
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="secondary" fullWidth>Sign In</Button>
                                </Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="primary" fullWidth>Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
