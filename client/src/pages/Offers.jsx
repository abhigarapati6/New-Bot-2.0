import React, { useState, useEffect } from 'react';
import { Tag, Copy, ArrowUpDown } from 'lucide-react';
import { getOffers, getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import './Offers.css';

const Offers = () => {
    // Deal of the Day Timer Logic
    const [timeLeft, setTimeLeft] = useState({ hours: 4, mins: 22, secs: 58 });
    const [coupons, setCoupons] = useState([]);
    const [products, setProducts] = useState([]);
    const [sortOrder, setSortOrder] = useState(''); // '' | 'asc' | 'desc'

    useEffect(() => {
        // Fetch Offers from API
        getOffers().then(data => {
            if (data && data.length > 0) setCoupons(data);
            else {
                // Fallback mock data
                setCoupons([
                    { code: 'DENIM20', discount: 20, description: 'Applicable on all premium Denim collection.' },
                    { code: 'FIRST500', discount: 500, description: 'Exclusive welcome offer on your first purchase.', type: 'flat' }
                ]);
            }
        });

        getProducts().then(data => {
            // Filter products that have a discount or mock it
            // Using a broader mock strategy for demo if no "discount" field exists on API
            const discounted = data.filter(p => p.discount || p.description.toLowerCase().includes('offer'));

            if (discounted.length === 0 && data.length > 0) {
                // Demo: Take first 8 products and assign random discounts
                setProducts(data.slice(0, 8).map(p => ({
                    ...p,
                    discount: Math.floor(Math.random() * (50 - 10 + 1) + 10) // 10-50% off
                })));
            } else {
                setProducts(discounted);
            }
        });

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
                if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const cleanImage = (imgUrl) => {
        if (!imgUrl) return 'https://via.placeholder.com/300';
        try {
            if (imgUrl.startsWith('["') && imgUrl.endsWith('"]')) return imgUrl.slice(2, -2);
            return imgUrl;
        } catch (e) { return imgUrl; }
    };

    const formatTime = (val) => val.toString().padStart(2, '0');

    // Sorting Logic
    const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === 'asc') return a.price - b.price;
        if (sortOrder === 'desc') return b.price - a.price;
        return 0;
    });

    return (
        <div className="page offers-page">
            <section className="deal-hero">
                <div className="hero-bg-overlay"></div>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <span className="deal-tag">LIMITED TIME ONLY</span>
                    <h1 className="deal-title">DEAL OF THE DAY</h1>
                    <p>Flash Sale: Up to 50% Off Storewide. Elevate your style.</p>

                    <div className="countdown-timer">
                        <div className="time-block">
                            <span className="time-val">{formatTime(timeLeft.hours)}</span>
                            <span className="time-label">HOURS</span>
                        </div>
                        <div className="time-block">
                            <span className="time-val">{formatTime(timeLeft.mins)}</span>
                            <span className="time-label">MINS</span>
                        </div>
                        <div className="time-block">
                            <span className="time-val">{formatTime(timeLeft.secs)}</span>
                            <span className="time-label">SECS</span>
                        </div>
                    </div>

                    <Link to="/products" className="btn btn-primary shop-sale-btn">Shop The Sale</Link>
                </div>
            </section>

            <div className="container sections-container">
                <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 className="section-heading" style={{ margin: 0 }}>On Sale Products</h2>
                    <div className="sort-wrapper">
                        <select
                            className="sort-dropdown"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            style={{
                                padding: '0.5rem',
                                borderRadius: '6px',
                                border: '1px solid #333',
                                background: 'transparent',
                                color: 'inherit'
                            }}
                        >
                            <option value="">Sort by Price</option>
                            <option value="asc">Price: Low to High</option>
                            <option value="desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="product-grid">
                    {sortedProducts.map(product => (
                        <Link to={`/product/${product.id}`} key={product.id} className="product-card-home" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="img-wrapper">
                                <img src={cleanImage(product.images[0])} alt={product.title} />
                                <span className="offer-badge" style={{
                                    position: 'absolute', top: '10px', left: '10px',
                                    background: '#ef4444', color: 'white',
                                    padding: '2px 6px', borderRadius: '4px',
                                    fontSize: '0.7rem', fontWeight: 'bold'
                                }}>
                                    {product.discount}% OFF
                                </span>
                            </div>
                            <h3>{product.title}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ fontWeight: 'bold' }}>${product.price}</p>
                                <p style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9em' }}>
                                    ${(product.price * (100 / (100 - product.discount))).toFixed(0)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <h2 className="section-heading" style={{ marginTop: '4rem' }}>Exclusive Coupons</h2>
                <div className="coupons-grid">
                    {coupons.map((coupon, idx) => (
                        <div className="coupon-card" key={idx}>
                            <div className="coupon-header">
                                <Tag className="coupon-icon" />
                                <span className="expiring-badge">Active</span>
                            </div>
                            <h3>{coupon.type === 'flat' ? `₹${coupon.discount} OFF` : `${coupon.discount}% OFF`}</h3>
                            <p>{coupon.description || 'Exclusive timed offer.'}</p>
                            <div className="coupon-code-box">
                                <span>{coupon.code}</span>
                                <button className="copy-btn" onClick={() => navigator.clipboard.writeText(coupon.code)}>
                                    <Copy size={14} /> Copy
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="section-heading">Bank & Wallet Offers</h2>
                <div className="bank-offers-grid">
                    <div className="bank-card">
                        <div className="bank-logo">HDFC BANK</div>
                        <div className="bank-info">
                            <h4>10% Instant Discount</h4>
                            <p>Min. purchase of ₹3,000 on HDFC Credit Cards</p>
                        </div>
                        <span className="details-link">Details</span>
                    </div>
                    <div className="bank-card">
                        <div className="bank-logo">ICICI Bank</div>
                        <div className="bank-info">
                            <h4>Flat ₹250 Cashback</h4>
                            <p>Valid on ICICI Bank UPI transactions</p>
                        </div>
                        <span className="details-link">Details</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Offers;
