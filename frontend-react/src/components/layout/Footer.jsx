import { Link } from 'react-router-dom';
import { Film, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

export function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <Film size={28} />
                            <span>CineBook</span>
                        </Link>
                        <p className="footer-description">
                            Your ultimate destination for booking movie tickets. Experience cinema like never before
                            with easy bookings, best seats, and amazing offers.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="footer-social-link" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="footer-social-link" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="footer-social-link" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="footer-social-link" aria-label="YouTube">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/movies">Now Showing</Link></li>
                            <li><Link to="/movies?upcoming=true">Coming Soon</Link></li>
                            <li><Link to="/theaters">Theaters</Link></li>
                            <li><Link to="/movies?offers=true">Offers</Link></li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div className="footer-section">
                        <h4 className="footer-title">Help</h4>
                        <ul className="footer-links">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">FAQs</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Refund Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-section">
                        <h4 className="footer-title">Contact Us</h4>
                        <ul className="footer-contact">
                            <li>
                                <Mail size={16} />
                                <a href="mailto:support@cinebook.com">support@cinebook.com</a>
                            </li>
                            <li>
                                <Phone size={16} />
                                <a href="tel:+911234567890">+91 123 456 7890</a>
                            </li>
                            <li>
                                <MapPin size={16} />
                                <span>Mumbai, Maharashtra, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} CineBook. All rights reserved.</p>
                    <p className="footer-made-with">
                        Made with ❤️ for movie lovers
                    </p>
                </div>
            </div>
        </footer>
    );
}
