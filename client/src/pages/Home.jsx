import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getProducts } from '../services/api';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch specific trending (mock) data or just first few products
        getProducts(0, 4).then(data => {
            setTrendingProducts(data);
            setLoading(false);
        });

        const tl = gsap.timeline();

        tl.fromTo(heroRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: 'power2.out' }
        )
            .fromTo(titleRef.current,
                { y: 100, opacity: 0, rotateX: -45 },
                { y: 0, opacity: 1, rotateX: 0, duration: 1.5, ease: 'power3.out' },
                "-=0.5"
            );

        // Parallax effect on scroll
        gsap.to(".hero-bg", {
            scrollTrigger: {
                trigger: ".home-page",
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            y: 200,
            ease: "none"
        });

    }, []);

    const cleanImage = (imgUrl) => {
        if (!imgUrl) return 'https://via.placeholder.com/300';
        try {
            if (imgUrl.startsWith('["') && imgUrl.endsWith('"]')) {
                return imgUrl.slice(2, -2);
            }
            return imgUrl;
        } catch (e) {
            return imgUrl;
        }
    };

    return (
        <div className="page home-page">
            <div className="hero-section" ref={heroRef}>
                <div className="hero-bg"></div>
                <div className="container hero-content">
                    <h1 className="hero-title" ref={titleRef}>
                        REDEFINE <br />
                        <span className="text-accent glitch" data-text="LUXURY">LUXURY</span>
                    </h1>
                    <p className="hero-subtitle">
                        Experience the next generation of fashion with our curated collection of premium streetwear and essentials.
                    </p>
                    <Link to="/products">
                        <button className="btn btn-primary hero-btn">Explore Collection</button>
                    </Link>
                </div>
            </div>

            <section className="trending-section">
                <div className="container">
                    <h2 className="section-title">Trending Now</h2>
                    <div className="product-grid">
                        {loading ? (
                            /* Show 4 skeletons */
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="product-card-home skeleton-card">
                                    <div className="skeleton-image pulse" style={{ height: '300px' }}></div>
                                    <div className="skeleton-text title-line pulse"></div>
                                    <div className="skeleton-text price-line pulse"></div>
                                </div>
                            ))
                        ) : (
                            trendingProducts.map(product => (
                                <Link to={`/product/${product.id}`} key={product.id} className="product-card-home" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="img-wrapper">
                                        <img src={cleanImage(product.images && product.images[0] ? product.images[0] : '')} alt={product.title} />
                                        {product.discount && (
                                            <span className="offer-badge" style={{
                                                position: 'absolute', top: '10px', left: '10px',
                                                background: '#ef4444', color: 'white',
                                                padding: '2px 6px', borderRadius: '4px',
                                                fontSize: '0.7rem', fontWeight: 'bold'
                                            }}>
                                                {product.discount}% OFF
                                            </span>
                                        )}
                                    </div>
                                    <h3>{product.title}</h3>
                                    <p>${product.price}</p>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
