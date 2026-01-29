import React from 'react';
import './ProductCard.css'; // Reuse product card sizing

const SkeletonCard = () => {
    return (
        <div className="product-card skeleton-card">
            <div className="skeleton-image pulse"></div>
            <div className="skeleton-text title-line pulse"></div>
            <div className="skeleton-text price-line pulse"></div>
        </div>
    );
};

export default SkeletonCard;
