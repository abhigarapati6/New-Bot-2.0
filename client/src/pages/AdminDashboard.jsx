import React, { useState, useEffect } from 'react';
import { Package, Users, BarChart2, ShoppingCart, Search, Plus, MoreVertical, LayoutDashboard, Tag } from 'lucide-react';
import { getProducts, createProduct, getOffers, createOffer, updateProduct } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [offers, setOffers] = useState([]);
    const [activeTab, setActiveTab] = useState('inventory');
    const [showModal, setShowModal] = useState(false);

    // Offer Modal State
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [offerValue, setOfferValue] = useState('');

    // Form State
    const [newProduct, setNewProduct] = useState({
        title: '',
        price: '',
        description: '',
        image: '',
        category: 'Clothing'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const prodData = await getProducts();
        // Enrich safely
        const enriched = prodData.map(p => ({
            ...p,
            sku: p.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
            stock: p.stock !== undefined ? p.stock : 50,
            status: p.stock === 0 ? 'Out of Stock' : 'Active',
            images: p.images || [p.image]
        }));
        setProducts(enriched);

        const offerData = await getOffers();
        setOffers(offerData);
    };

    const [editingProduct, setEditingProduct] = useState(null);

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            const productPayload = {
                title: newProduct.title,
                price: parseFloat(newProduct.price),
                description: newProduct.description,
                images: [newProduct.image],
                category: { name: newProduct.category || 'Clothing' },
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, productPayload);
                setEditingProduct(null);
            } else {
                productPayload.createdAt = new Date().toISOString();
                await createProduct(productPayload);
            }

            setShowModal(false);
            setNewProduct({ title: '', price: '', description: '', image: '', category: 'Clothing' });
            loadData();
        } catch (error) {
            console.error("Failed to save product", error);
            alert("Failed to save product");
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setNewProduct({
            title: product.title,
            price: product.price,
            description: product.description,
            image: product.images[0] || '',
            category: product.category ? product.category.name : 'Clothing'
        });
        setShowModal(true);
    };

    const handleAddOfferToProduct = (productId) => {
        setSelectedProductId(productId);
        setShowOfferModal(true);
    };

    const submitProductOffer = async (e) => {
        e.preventDefault();
        try {
            const product = products.find(p => p.id === selectedProductId);
            if (!product) return;

            // Hack: Append offer to description to persist it
            // Format: "Original Description | [OFFER:20]"
            const cleanDesc = product.description.split(' | [OFFER:')[0];
            const newDesc = `${cleanDesc} | [OFFER:${offerValue}]`;

            const updated = {
                ...product,
                description: newDesc
            };

            await updateProduct(selectedProductId, updated);

            // Update local state
            const newProducts = products.map(p => {
                if (p.id === selectedProductId) {
                    return { ...p, description: newDesc, discount: offerValue };
                }
                return p;
            });
            setProducts(newProducts);
            setShowOfferModal(false);
            setOfferValue('');
            alert("Offer applied successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update offer");
        }
    };

    const toggleStock = async (product) => {
        const newStatus = product.stock > 0 ? 0 : 50; // Simple toggle for now
        const updated = { ...product, stock: newStatus };
        await updateProduct(product.id, updated);
        loadData();
    };

    const renderContent = () => {
        if (activeTab === 'inventory') {
            return (
                <div className="admin-content">
                    <div className="admin-header">
                        <div>
                            <span className="breadcrumb">Admin &gt; Inventory</span>
                            <h1>Product Catalog</h1>
                        </div>
                        <div className="admin-actions">
                            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                                <Plus size={16} /> Add New Product
                            </button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>PRODUCT</th>
                                    <th>PRICE</th>
                                    <th>STOCK</th>
                                    <th>DATE ADDED</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td className="product-cell">
                                            <img
                                                src={
                                                    product.images && product.images.length > 0
                                                        ? (product.images[0].startsWith('["') ? product.images[0].slice(2, -2) : product.images[0])
                                                        : 'https://via.placeholder.com/40'
                                                }
                                                alt={product.title}
                                                className="table-img"
                                            />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span className="product-name">{product.title}</span>
                                                {product.discount && <span className="badge-warning" style={{ fontSize: '0.6rem', width: 'fit-content' }}>On Offer: {product.discount}%</span>}
                                            </div>
                                        </td>
                                        <td>${product.price}</td>
                                        <td>{product.stock}</td>
                                        <td>{new Date(product.createdAt || Date.now()).toLocaleDateString()}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${product.stock > 0 ? 'active' : 'draft'}`}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => toggleStock(product)}
                                                title="Click to toggle stock"
                                            >
                                                {product.stock > 0 ? 'Active' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="icon-btn" title="Add Offer" onClick={() => handleAddOfferToProduct(product.id)}>
                                                <Tag size={16} />
                                            </button>
                                            <button className="icon-btn" onClick={() => openEditModal(product)}><MoreVertical size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        if (activeTab === 'offers') {
            return (
                <div className="admin-content">
                    <div className="admin-header">
                        <h1>Offers Management</h1>
                        <button className="btn btn-primary">Create Offer</button>
                    </div>
                    <div className="offers-list">
                        {offers.length === 0 ? <p>No active offers found. (Use Product Actions to add per-product offers)</p> : (
                            <ul>
                                {offers.map((offer, idx) => (
                                    <li key={idx}>{offer.code} - {offer.discount}% Off</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            );
        }

        return <div className="admin-content center-msg">Module Under Construction</div>;
    };

    return (
        <div className="page admin-dashboard-page">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <div className="logo-icon"><Package size={20} /></div>
                    <div className="brand-text">
                        <h3>Snitch Admin</h3>
                        <p>Management Portal</p>
                    </div>
                </div>
                <nav className="admin-nav">
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>
                        <Package size={20} /> Inventory
                    </button>
                    <button className={activeTab === 'offers' ? 'active' : ''} onClick={() => setActiveTab('offers')}>
                        <Tag size={20} /> Offers
                    </button>
                </nav>
            </aside>
            <main className="admin-main">
                <header className="top-bar">
                    <div className="search-wrapper">
                        <Search size={18} />
                        <input type="text" placeholder="Search products..." />
                    </div>
                    <div className="user-profile">
                        <div className="avatar">AR</div>
                        <span>Alex Rivera</span>
                    </div>
                </header>
                {renderContent()}
            </main>

            {/* Product Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleCreateProduct}>
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" value={newProduct.title} onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input type="text" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} required />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => {
                                    setShowModal(false);
                                    setEditingProduct(null);
                                }} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingProduct ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Offer Modal */}
            {showOfferModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add Offer to Product</h2>
                        <form onSubmit={submitProductOffer}>
                            <div className="form-group">
                                <label>Discount Percentage (%)</label>
                                <input type="number" value={offerValue} onChange={e => setOfferValue(e.target.value)} placeholder="e.g. 20" required />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowOfferModal(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">Apply Offer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
