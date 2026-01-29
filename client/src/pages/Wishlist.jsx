import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import './ProductListing.css'; // Reusing grid layout

const Wishlist = () => {
    const { wishlist } = useContext(ShopContext);

    return (
        <div className="page">
            <div className="container">
                <h1 className="section-title">My Wishlist</h1>
                {wishlist.length === 0 ? (
                    <p className="subtitle" style={{ textAlign: 'center' }}>Your wishlist is empty.</p>
                ) : (
                    <div className="products-grid-layout">
                        {wishlist.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
