import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useContext(ShopContext);

    const isInWishlist = wishlist.some(item => item.id === product.id);

    // Parse discount from description hack
    const discountMatch = product.description.match(/\| \[OFFER:(\d+)\]/);
    const persistedDiscount = discountMatch ? parseInt(discountMatch[1]) : null;
    const discount = product.discount || persistedDiscount;

    const toggleWishlist = () => {
        if (isInWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    // Clean raw image URL if needed (Platzi API sometimes has weird brackets)
    const cleanImage = (imgUrl) => {
        if (!imgUrl) return 'https://via.placeholder.com/300';
        try {
            // Remove [" and "] wrapper if present (API artifact)
            if (imgUrl.startsWith('["') && imgUrl.endsWith('"]')) {
                return imgUrl.slice(2, -2);
            }
            return imgUrl;
        } catch (e) {
            return imgUrl;
        }
    };

    return (
        <div className="product-card">
            <div className="image-container">
                <Link to={`/product/${product.id}`}>
                    <img src={cleanImage(product.images[0])} alt={product.title} loading="lazy" />
                    {discount && (
                        <span className="offer-badge" style={{
                            position: 'absolute', top: '10px', left: '10px',
                            background: '#ef4444', color: 'white',
                            padding: '2px 6px', borderRadius: '4px',
                            fontSize: '0.7rem', fontWeight: 'bold'
                        }}>
                            {discount}% OFF
                        </span>
                    )}
                </Link>
                <button
                    className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                    onClick={toggleWishlist}
                    title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
                </button>
            </div>
            <div className="product-info">
                <Link to={`/product/${product.id}`} className="product-title">
                    <h3>{product.title}</h3>
                </Link>
                <div className="product-footer">
                    <span className="price">${product.price}</span>
                    <button className="add-cart-btn" onClick={() => addToCart(product)}>
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
