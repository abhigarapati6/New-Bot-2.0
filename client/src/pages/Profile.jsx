import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { User, MapPin, Shield, CreditCard, ShoppingBag, LogOut, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../services/api';
import './Profile.css';

const Profile = () => {
    const { user, setUser } = useContext(ShopContext);
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();

    // Mock form states
    const [formData, setFormData] = useState({
        firstName: 'Alex',
        lastName: 'Johnson',
        email: user?.email || 'alex.johnson@example.com',
        phone: '+1 (555) 000-0000',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    if (!user) {
        // Redirect if not logged in (handled by route mostly, but safe check)
        return <div className="page center-content"><h2>Please Log In</h2></div>;
    }

    const handleLogout = () => {
        setUser(null);
        navigate('/');
    };



    const handleSaveProfile = async () => {
        try {
            const updatedData = {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
            };

            // Call API to update user
            await updateUser(user.id, updatedData);

            // Update Context state locally
            setUser({ ...user, ...updatedData });

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile");
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="profile-content">
                        <div className="profile-header-card">
                            <div className="profile-avatar">
                                <img src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name + "&background=0D8ABC&color=fff"} alt="Profile" />
                                <button className="change-photo-btn" onClick={() => {
                                    const url = prompt("Enter new Profile Picture URL:");
                                    if (url) {
                                        // Update local state temporarily or call API immediately
                                        // keeping simple: just log for now until handleSave
                                    }
                                }}><Camera size={16} /></button>
                            </div>
                            <div className="profile-info">
                                <h2>{user.name}</h2>
                                <p className="text-muted">{user.role === 'admin' ? 'Administrator' : 'Premium Member'}</p>
                            </div>
                            <div className="profile-actions">
                                <button className="btn btn-primary" onClick={handleSaveProfile}>Save Changes</button>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3>Personal Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" value={formData.email} disabled className="input-diabled" />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="profile-content">
                        <h3>Security & Password</h3>
                        <div className="profile-section">
                            <div className="form-group full-width">
                                <label>Current Password</label>
                                <input type="password" placeholder="••••••••" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input type="password" placeholder="Min. 8 characters" />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input type="password" placeholder="Repeat new password" />
                                </div>
                            </div>
                            <div className="action-row">
                                <button className="btn btn-primary">Update Password</button>
                            </div>
                        </div>
                    </div>
                );
            case 'addresses':
                return (
                    <div className="profile-content">
                        <div className="header-row">
                            <h3>Saved Addresses</h3>
                            <button className="btn btn-outline">+ Add New</button>
                        </div>
                        <div className="address-grid">
                            <div className="address-card">
                                <div className="address-tag">HOME • DEFAULT</div>
                                <h4>Alex Johnson</h4>
                                <p>+1 234 567 890</p>
                                <p className="address-text">123 Maple Street, Apt 4B<br />Springfield, Illinois, 62704</p>
                                <div className="address-actions">
                                    <button className="btn-text">Edit</button>
                                    <button className="btn-text text-danger">Remove</button>
                                </div>
                            </div>
                            <div className="address-card">
                                <div className="address-tag tag-office">OFFICE</div>
                                <h4>Alex Johnson</h4>
                                <p>+1 987 654 321</p>
                                <p className="address-text">456 Business Ave, Suite 300<br />Chicago, Illinois, 60601</p>
                                <div className="address-actions">
                                    <button className="btn-text">Edit</button>
                                    <button className="btn-text text-danger">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div>Coming Soon</div>;
        }
    };

    return (
        <div className="page profile-page">
            <div className="container profile-layout">
                <aside className="profile-sidebar">
                    <div className="sidebar-menu">
                        <button
                            className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <User size={20} /> Profile
                        </button>
                        <button
                            className={`menu-item ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <Shield size={20} /> Security
                        </button>
                        <button
                            className={`menu-item ${activeTab === 'addresses' ? 'active' : ''}`}
                            onClick={() => setActiveTab('addresses')}
                        >
                            <MapPin size={20} /> Addresses
                        </button>
                        <button
                            className="menu-item"
                            onClick={() => navigate('/dashboard')}
                        >
                            <ShoppingBag size={20} /> My Orders
                        </button>
                        <div className="divider"></div>
                        <button className="menu-item text-danger" onClick={handleLogout}>
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </aside>
                <main className="profile-main">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default Profile;
