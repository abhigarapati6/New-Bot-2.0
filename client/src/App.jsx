import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import Orders from './pages/Orders';

import './index.css';

function App() {
    return (
        <ThemeProvider>
            <ShopProvider>
                <Router>
                    <div className="app-container">
                        <Navbar />
                        <main>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/products" element={<ProductListing />} />
                                <Route path="/product/:id" element={<ProductDetails />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/wishlist" element={<Wishlist />} />
                                <Route path="/dashboard" element={<UserDashboard />} />
                                <Route path="/admin" element={<AdminDashboard />} />
                                <Route path="/auth" element={<Auth />} />
                                <Route path="/offers" element={<Offers />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/orders" element={<Orders />} />
                            </Routes>
                        </main>
                    </div>
                </Router>
            </ShopProvider>
        </ThemeProvider>
    );
}

export default App;
