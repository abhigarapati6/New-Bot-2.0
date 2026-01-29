import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import './ProductListing.css';

const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };



    const [sortOrder, setSortOrder] = useState('');

    const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === 'asc') return a.price - b.price;
        if (sortOrder === 'desc') return b.price - a.price;
        return 0;
    });

    return (
        <div className="page product-listing-page">
            <div className="container">
                <header className="listing-header">
                    <h1 className="section-title">New Arrivals</h1>
                    <p className="subtitle">Explore our latest collection of premium goods.</p>
                </header>

                <div className="controls-row" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <select
                        className="sort-dropdown"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="">Sort by: Recommended</option>
                        <option value="asc">Price: Low to High</option>
                        <option value="desc">Price: High to Low</option>
                    </select>
                </div>

                <div className="products-grid-layout">
                    {loading ? (
                        /* Show 8 skeletons while loading */
                        Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        sortedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListing;
