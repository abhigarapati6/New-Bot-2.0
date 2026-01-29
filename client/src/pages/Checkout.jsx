import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const Checkout = () => {
    const { cart, setCart, user } = useContext(ShopContext);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null); // { message, type }
    const navigate = useNavigate();
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Sanitize items to avoid sending too much data or circular refs to MockAPI
        const sanitizedItems = cart.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.images ? item.images[0] : ''
        }));

        const orderData = {
            userId: user ? user.id : 'guest',
            items: sanitizedItems,
            total: parseFloat(total.toFixed(2)), // Ensure number
            date: new Date().toISOString(),
            status: 'Processing',
            shippingAddress: e.target[1].value
        };

        try {
            await import('../services/api').then(mod => mod.createOrder(orderData));
            setToast({ message: "Payment Successful! Redirecting...", type: 'success' });
            setCart([]);
            setTimeout(() => {
                navigate('/orders'); // Redirect to orders page
            }, 2000);
        } catch (error) {
            console.error(error);
            setToast({ message: "Order failed. Please try again.", type: 'error' });
            setLoading(false); // Only stop loading on error, otherwise wait for redirect
        }
    };

    if (cart.length === 0) return <div className="page container">Cart is empty</div>;

    return (
        <div className="page checkout-page">
            <div className="container">
                <h1 className="section-title">Checkout</h1>
                <div className="admin-grid"> {/* Reusing grid layout */}
                    <div className="upload-section">
                        <h2>Shipping Information</h2>
                        <form id="checkout-form" onSubmit={handlePayment}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input required type="text" placeholder="John Doe" />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input required type="text" placeholder="123 Street" />
                            </div>
                            <div className="form-group">
                                <label>Card Number</label>
                                <input required type="text" placeholder="0000 0000 0000 0000" />
                            </div>
                            <div className="checkout-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div className="form-group" style={{ flex: '1 1 120px' }}>
                                    <label>Expiry</label>
                                    <input required type="text" placeholder="MM/YY" />
                                </div>
                                <div className="form-group" style={{ flex: '1 1 120px' }}>
                                    <label>CVC</label>
                                    <input required type="text" placeholder="123" />
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="stats-section">
                        <h2>Order Summary</h2>
                        {cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>{item.title.substring(0, 20)}... x {item.quantity}</span>
                                <span>${item.price * item.quantity}</span>
                            </div>
                        ))}
                        <div className="summary-total" style={{ marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button type="submit" form="checkout-form" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                            {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                        </button>
                    </div>
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default Checkout;
