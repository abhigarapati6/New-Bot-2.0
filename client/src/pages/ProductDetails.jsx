import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/api';
import { ShopContext } from '../context/ShopContext';
import { ShoppingCart, Heart } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');
    const { addToCart, addToWishlist } = useContext(ShopContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    // Clean image immediately
                    setActiveImage(cleanImage(data.images[0]));
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

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

    if (loading) return <div className="page loading-container"><div className="loader">Loading...</div></div>;
    if (!product) return <div className="page"><div className="container">Product not found</div></div>;

    return (
        <div className="page product-details-page">
            <div className="container details-container">
                <div className="gallery-section">
                    <div className="main-image">
                        <img src={activeImage} alt={product.title} />
                    </div>
                    <div className="thumbnails">
                        {product.images.map((img, index) => {
                            const cleaned = cleanImage(img);
                            return (
                                <img
                                    key={index}
                                    src={cleaned}
                                    alt={`Thumbnail ${index}`}
                                    className={activeImage === cleaned ? 'active-thumb' : ''}
                                    onClick={() => setActiveImage(cleaned)}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="info-section">
                    <h1 className="product-title-large">{product.title}</h1>
                    <p className="product-price-large">${product.price}</p>
                    <p className="product-description">{product.description}</p>

                    <div className="action-buttons">
                        <button className="btn btn-primary add-btn" onClick={() => addToCart(product)}>
                            <ShoppingCart className="btn-icon" /> Add to Cart
                        </button>
                        <button className="btn btn-secondary wishlist-large-btn" onClick={() => addToWishlist(product)}>
                            <Heart className="btn-icon" /> Add to Wishlist
                        </button>
                    </div>

                    <div className="product-meta">
                        <p>Category: <span className="text-accent">{product.category.name}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
