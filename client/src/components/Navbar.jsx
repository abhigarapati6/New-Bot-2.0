import { Menu, Moon, Search, ShoppingCart, Sun, User, X } from 'lucide-react';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ThemeContext } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
    const { cart, wishlist, user } = useContext(ShopContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isDarkMode = theme === 'dark';

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-logo">
                    Botique<span className="text-accent">.</span>
                </Link>

                <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                    <Link to="/offers" onClick={() => setIsMobileMenuOpen(false)}>Offers</Link>
                    <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
                    {user && user.role === 'admin' && (
                        <Link to="/admin" className="text-accent" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
                    )}
                </div>

                <div className="nav-actions">
                    <form onSubmit={handleSearch} className="search-bar" style={{ display: window.innerWidth < 768 ? 'none' : 'flex' }}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit"><Search size={18} /></button>
                    </form>

                    <button className="nav-icon-btn theme-toggle" onClick={toggleTheme}>
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <Link to="/cart" className="nav-icon-btn">
                        <ShoppingCart size={20} />
                        {cart.length > 0 && <span className="badge">{cart.length}</span>}
                    </Link>

                    {user ? (
                        <Link to="/profile" className="profile-link">
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #8b5cf6' }}>
                                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
                        </Link>
                    ) : (
                        <Link to="/auth" className="nav-icon-btn">
                            <User size={20} />
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button className="nav-icon-btn mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ display: 'none' }}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <style>{`
                        @media(max-width: 768px) {
                            .mobile-menu-btn { display: flex !important; z-index: 1001; }
                        }
                    `}</style>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
