import axios from 'axios';

const API_URL = 'https://697a423e0e6ff62c3c58f63b.mockapi.io';
const PRODUCT_API_URL = 'https://api.escuelajs.co/api/v1';

export const api = axios.create({
    baseURL: API_URL,
});

const productApi = axios.create({
    baseURL: PRODUCT_API_URL
});

// Product Services
export const getProducts = async (offset = 0, limit = 20) => {
    const response = await productApi.get(`/products?offset=${offset}&limit=${limit}`);
    // Map Escuelajs format if needed, but it's standard
    return response.data;
};

export const getProductById = async (id) => {
    const response = await productApi.get(`/products/${id}`);
    return response.data;
};

export const searchProducts = async (title) => {
    const response = await productApi.get(`/products/?title=${title}`);
    return response.data;
};

export const createProduct = async (productData) => {
    // Escuelajs might verify images, so ensure they are valid URLs
    const response = await productApi.post('/products', productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await productApi.put(`/products/${id}`, productData);
    return response.data;
};

// User Services & Auth
export const loginUser = async (email, password) => {
    // 1. Hardcoded Admin Check
    if ((email === 'vinay' || email === 'admin@snitch.com') && password === '1234') {
        return {
            id: 'admin-1',
            name: 'Vinay Garapati',
            email: 'vinay',
            role: 'admin',
            avatar: 'https://ui-avatars.com/api/?name=Vinay+Garapati&background=0D8ABC&color=fff'
        };
    }

    // 2. Regular User Check (MockAPI)
    const response = await api.get(`/users?email=${email}`);
    const users = response.data;

    if (users.length > 0) {
        const user = users[0];
        if (user.password === password) {
            return user;
        } else {
            throw new Error('Invalid password');
        }
    } else {
        throw new Error('User not found');
    }
};

export const registerUser = async (userData) => {
    // Check if user exists first
    const check = await api.get(`/users?email=${userData.email}`);
    if (check.data.length > 0) {
        throw new Error('User already exists');
    }
    // Create new user
    // Ensure role is default 'user' unless specified (Admin logic handled separately or by manual edit)
    const newUser = { ...userData, role: 'user', cart: [], wishlist: [], orders: [] };
    const response = await api.post('/users', newUser);
    return response.data;
};

export const getUserData = async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
};

// Offer Services
export const getOffers = async () => {
    // Assuming 'offers' resource exists
    try {
        const response = await api.get('/offers');
        return response.data;
    } catch (e) {
        return []; // Fallback if resource doesn't exist yet
    }
};

export const createOffer = async (offerData) => {
    const response = await api.post('/offers', offerData);
    return response.data;
};

// Order Services
export const createOrder = async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};

export const getOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

export const getOrdersByUser = async (userId) => {
    // Filter by userId
    const response = await api.get(`/orders?userId=${userId}`);
    return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}`, { status });
    return response.data;
};

export const cancelOrder = async (orderId) => {
    const response = await api.put(`/orders/${orderId}`, { status: 'Cancelled' });
    return response.data;
};

export const updateOrderAddress = async (orderId, newAddress) => {
    const response = await api.put(`/orders/${orderId}`, { shippingAddress: newAddress });
    return response.data;
};
