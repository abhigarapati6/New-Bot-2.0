import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { getOrdersByUser, cancelOrder, updateOrderAddress } from '../services/api';
import { Package, Truck, CheckCircle, MapPin, XCircle, Edit2, AlertCircle } from 'lucide-react';
import './Orders.css';

const Orders = () => {
    const { user } = useContext(ShopContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [trackOrder, setTrackOrder] = useState(null); // Order object to track
    const [editAddressOrder, setEditAddressOrder] = useState(null); // Order object to edit
    const [newAddress, setNewAddress] = useState('');

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const data = await getOrdersByUser(user.id);
            // Sort by date desc (mock date if needed)
            setOrders(data.reverse());
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                await cancelOrder(orderId);
                fetchOrders(); // Refresh
                alert("Order cancelled successfully.");
            } catch (error) {
                alert("Failed to cancel order.");
            }
        }
    };

    const handleAddressUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateOrderAddress(editAddressOrder.id, newAddress);
            setEditAddressOrder(null);
            fetchOrders();
            alert("Address updated successfully.");
        } catch (error) {
            alert("Failed to update address.");
        }
    };

    const getStatusStep = (status) => {
        switch (status) {
            case 'Processing': return 1;
            case 'Shipped': return 2;
            case 'Out for Delivery': return 3;
            case 'Delivered': return 4;
            default: return 0;
        }
    };

    if (!user) return <div className="page center-msg">Please log in to view orders.</div>;
    if (loading) return <div className="page center-msg">Loading orders...</div>;

    return (
        <div className="page orders-page">
            <div className="container">
                <h1 className="section-title">My Orders</h1>

                <div className="orders-list">
                    {orders.length === 0 ? (
                        <p>No orders found. Start shopping!</p>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <h3>Order #{order.id}</h3>
                                        <span className="order-date">{new Date().toLocaleDateString()}</span>
                                    </div>
                                    <span className={`status-badge ${order.status?.toLowerCase().replace(/\s/g, '-')}`}>
                                        {order.status || 'Processing'}
                                    </span>
                                </div>
                                <div className="order-items">
                                    {order.items && order.items.map((item, idx) => (
                                        <div key={idx} className="order-item-row">
                                            <span>{item.quantity}x {item.title}</span>
                                            <span>${item.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-footer">
                                    <div className="total-price">Total: ${order.total}</div>
                                    <div className="order-actions">
                                        <button className="btn btn-outline btn-sm" onClick={() => setTrackOrder(order)}>
                                            <Package size={16} /> Track
                                        </button>

                                        {(order.status === 'Processing' || !order.status) && (
                                            <>
                                                <button className="btn btn-outline btn-sm" onClick={() => {
                                                    setEditAddressOrder(order);
                                                    setNewAddress(order.shippingAddress || '');
                                                }}>
                                                    <Edit2 size={16} /> Change Address
                                                </button>
                                                <button className="btn btn-outline btn-sm text-danger" onClick={() => handleCancel(order.id)}>
                                                    <XCircle size={16} /> Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Tracking Modal */}
            {trackOrder && (
                <div className="modal-overlay" onClick={() => setTrackOrder(null)}>
                    <div className="modal-content tracking-modal" onClick={e => e.stopPropagation()}>
                        <h2>Track Order #{trackOrder.id}</h2>

                        {trackOrder.status === 'Cancelled' ? (
                            <div className="cancelled-msg">
                                <AlertCircle size={40} />
                                <p>This order has been cancelled.</p>
                            </div>
                        ) : (
                            <div className="tracking-steps">
                                {['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                                    const currentStep = getStatusStep(trackOrder.status || 'Processing');
                                    const stepNum = idx + 1;
                                    const isCompleted = stepNum <= currentStep;

                                    return (
                                        <div key={step} className={`track-step ${isCompleted ? 'completed' : ''}`}>
                                            <div className="step-icon">
                                                {isCompleted ? <CheckCircle size={20} /> : <div className="circle"></div>}
                                            </div>
                                            <div className="step-label">{step}</div>
                                            {idx < 3 && <div className={`step-line ${stepNum < currentStep ? 'filled' : ''}`}></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <button className="btn btn-primary full-width" onClick={() => setTrackOrder(null)}>Close</button>
                    </div>
                </div>
            )}

            {/* Edit Address Modal */}
            {editAddressOrder && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Update Delivery Address</h2>
                        <form onSubmit={handleAddressUpdate}>
                            <textarea
                                className="address-input"
                                value={newAddress}
                                onChange={e => setNewAddress(e.target.value)}
                                placeholder="Enter new full address..."
                                rows={4}
                                required
                            />
                            <div className="form-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setEditAddressOrder(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
