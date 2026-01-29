import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                {/* Brand Section */}
                <div className="footer-section">
                    <Link to="/" className="nav-logo" style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'inline-block' }}>
                        Botique<span className="text-accent">.</span>
                    </Link>
                    <p>
                        Elevate your style with our curated collection of premium fashion.
                        Designed for the modern individual.
                    </p>
                    <div className="social-icons">
                        <a href="#" className="social-icon"><Facebook size={18} /></a>
                        <a href="#" className="social-icon"><Twitter size={18} /></a>
                        <a href="#" className="social-icon"><Instagram size={18} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Shop</Link></li>
                        <li><Link to="/offers">Offers</Link></li>
                        <li><Link to="/wishlist">Wishlist</Link></li>
                    </ul>
                </div>

                {/* Customer Support */}
                <div className="footer-section">
                    <h3>Support</h3>
                    <ul className="footer-links">
                        <li><Link to="/orders">Order Status</Link></li>
                        <li><Link to="/cart">Cart</Link></li>
                        <li><Link to="/profile">My Account</Link></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <ul className="footer-links">
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: window.innerWidth < 640 ? 'center' : 'flex-start' }}>
                            <MapPin size={16} /> 123 Fashion Ave, NY
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: window.innerWidth < 640 ? 'center' : 'flex-start' }}>
                            <Phone size={16} /> +1 (555) 123-4567
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: window.innerWidth < 640 ? 'center' : 'flex-start' }}>
                            <Mail size={16} /> support@botique.com
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Botique. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
