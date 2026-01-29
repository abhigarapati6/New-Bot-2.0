import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity } = useContext(ShopContext);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const cleanImage = (imgUrl) => {
        if (!imgUrl) return 'https://via.placeholder.com/100';
        try {
            if (imgUrl.startsWith('["') && imgUrl.endsWith('"]')) {
                return imgUrl.slice(2, -2);
            }
            return imgUrl;
        } catch (e) {
            return imgUrl;
        }
    };

    if (cart.length === 0) {
        return (
            <div className="page cart-empty">
                <div className="container center-content">
                    <h2>Your cart is empty</h2>
                    <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page cart-page">
            <div className="container">
                <h1 className="section-title">Shopping Cart</h1>
                <div className="cart-grid">
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-img">
                                    <Link to={`/product/${item.id}`}>
                                        <img src={cleanImage(item.images[0])} alt={item.title} />
                                    </Link>
                                </div>
                                <div className="cart-details">
                                    <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <h3>{item.title}</h3>
                                    </Link>
                                    <p className="item-price">${item.price}</p>
                                </div>
                                <div className="cart-quantity">
                                    <button onClick={() => updateQuantity(item.id, -1)}><Minus size={16} /></button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
                                </div>
                                <div className="cart-total-price">
                                    ${item.price * item.quantity}
                                </div>
                                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <Link to="/checkout" className="btn btn-primary checkout-btn" style={{ textAlign: 'center', textDecoration: 'none' }}>Proceed to Checkout</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
