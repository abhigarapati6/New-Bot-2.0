import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { getOrdersByUser } from '../services/api'; // Import API
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
    const { user } = useContext(ShopContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const data = await getOrdersByUser(user.id);
            setOrders(data.reverse()); // Newest first
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const cleanImage = (imgUrl) => {
        if (!imgUrl) return null;
        try {
            if (imgUrl.startsWith('["') && imgUrl.endsWith('"]')) {
                return imgUrl.slice(2, -2);
            }
            return imgUrl;
        } catch (e) { return imgUrl; }
    };

    if (!user) {
        return <div className="page center-content"><h2>Please Log In</h2></div>;
    }

    return (
        <div className="page user-dashboard">
            <div className="container">
                <header className="dashboard-header">
                    <div className="user-welcome">
                        <div className="user-avatar-lg">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h1>{user.name}</h1>
                            <div className="membership-badges">
                                <span className="badge-gold">GOLD MEMBER</span>
                                <span className="member-since">Active Member</span>
                            </div>
                        </div>
                    </div>
                    <Link to="/orders" className="btn btn-outline" style={{ marginLeft: 'auto' }}>
                        Manage Orders (Track/Return)
                    </Link>
                </header>

                <div className="dashboard-content">
                    <section className="orders-section">
                        <div className="section-header">
                            <h2>Recent Orders</h2>
                        </div>

                        {loading ? <p>Loading orders...</p> : (
                            <div className="orders-list">
                                {orders.length === 0 ? <p>No orders placed yet.</p> : orders.slice(0, 3).map(order => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-meta-row">
                                            <div className="meta-col">
                                                <span className="label">ORDER DATE</span>
                                                <span className="value">{new Date().toLocaleDateString()}</span>
                                            </div>
                                            <div className="meta-col">
                                                <span className="label">TOTAL</span>
                                                <span className="value">${order.total}</span>
                                            </div>
                                            <div className="meta-col">
                                                <span className="label">STATUS</span>
                                                <span className={`status-pill ${order.status === 'Delivered' ? 'status-delivered' : 'status-transit'}`}>
                                                    {order.status || 'Processing'}
                                                </span>
                                            </div>
                                            <div className="meta-col right-align">
                                                <span className="label">ORDER #</span>
                                                <span className="value">{order.id}</span>
                                            </div>
                                        </div>

                                        <div className="order-items-row">
                                            <div className="item-preview">
                                                <div className="item-thumb-placeholder"><Package size={24} /></div>
                                                <div className="item-info">
                                                    <h4>{order.items && order.items[0] ? order.items[0].title : 'Order Items'}</h4>
                                                    <p>{order.items ? `${order.items.length} Items` : ''}</p>
                                                </div>
                                            </div>
                                            <div className="order-actions">
                                                <Link to="/orders" className="btn btn-primary dark-btn">VIEW FULL DETAILS</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="load-more">
                            <Link to="/orders" className="btn btn-outline">VIEW ALL ORDERS</Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
