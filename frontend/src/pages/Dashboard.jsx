import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUpload, FaImage, FaEdit, FaSave, FaBox, FaShoppingBag, FaMoneyBillWave, FaUser, FaSignOutAlt, FaTrash, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user, isAuthenticated, updateUser, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [myProducts, setMyProducts] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Admin states
    const [users, setUsers] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [adminTab, setAdminTab] = useState('sellers'); // sellers, products

    // PostProduct form states
    const [imageSource, setImageSource] = useState('url');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        purchase_date: ''
    });

    // Profile edit state
    const [profileData, setProfileData] = useState({
        name: '',
        email: ''
    });

    useEffect(() => {
        if (authLoading) return; // Wait for auth check to complete

        if (!isAuthenticated()) {
            navigate('/login');
        } else if (user) {
            setProfileData({
                name: user.name,
                email: user.email
            });
            fetchCategories();
            if (user.role === 'seller') {
                fetchMyProducts();
                fetchMyOrders();
                setActiveTab('list-product'); // Default to list product for sellers
            } else if (user.role === 'admin') {
                fetchUsers();
                fetchAllProducts();
                setActiveTab('admin-dashboard');
            } else if (user.role === 'buyer') {
                fetchMyOrders();
                setActiveTab('my-orders');
            }
        }
    }, [isAuthenticated, user, navigate, authLoading]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products/categories');
            setCategories(res.data);
            if (res.data.length > 0 && !formData.category_id) {
                setFormData(prev => ({ ...prev, category_id: res.data[0].id.toString() }));
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchMyProducts = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/users/${user.id}/products`);
            setMyProducts(res.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const fetchMyOrders = async () => {
        try {
            let res;
            if (user.role === 'seller') {
                res = await axios.get(`http://localhost:5000/api/orders/seller/${user.id}`);
            } else {
                res = await axios.get(`http://localhost:5000/api/orders/buyer/${user.id}`);
            }
            setMyOrders(res.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchAllProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setAllProducts(res.data);
        } catch (err) {
            console.error('Error fetching all products:', err);
        }
    };

    const handleVerifyUser = async (userId, currentStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/users/${userId}/verify`, { is_verified: !currentStatus });
            fetchUsers();
            alert(`User ${!currentStatus ? 'verified' : 'unverified'} successfully!`);
        } catch (err) {
            console.error('Error verifying user:', err);
            alert('Failed to update user verification');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await axios.delete(`http://localhost:5000/api/users/${userId}`);
            fetchUsers();
            alert('User deleted successfully!');
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user');
        }
    };

    const handleVerifyProduct = async (productId, currentStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/products/${productId}/verify`, { is_authentic: !currentStatus });
            fetchAllProducts();
            alert(`Product ${!currentStatus ? 'verified' : 'unverified'} successfully!`);
        } catch (err) {
            console.error('Error verifying product:', err);
            alert('Failed to update product verification');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const calculateCondition = (purchaseDate) => {
        const today = new Date();
        const pDate = new Date(purchaseDate);
        const diffTime = Math.abs(today - pDate);
        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);

        if (diffYears < 1) return 'new';
        if (diffYears < 3) return 'like_new';
        return 'good';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let finalImageUrl = formData.image_url;

            if (imageSource === 'file' && imageFile) {
                finalImageUrl = imagePreview;
            }

            const condition = calculateCondition(formData.purchase_date);

            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category_id: parseInt(formData.category_id),
                condition_status: condition,
                image_url: finalImageUrl,
                purchase_date: formData.purchase_date
            };

            if (editingProduct) {
                // Update existing product
                await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, productData);
                alert('Product updated successfully!');
                setEditingProduct(null);
            } else {
                // Create new product
                productData.seller_id = user.id;
                productData.created_at = new Date().toISOString();
                await axios.post('http://localhost:5000/api/products', productData);
                alert('Product listed successfully!');
            }

            setFormData({
                name: '',
                description: '',
                price: '',
                category_id: categories[0]?.id.toString() || '',
                image_url: '',
                purchase_date: ''
            });
            setImagePreview('');
            setImageFile(null);

            fetchMyProducts();
            setActiveTab('my-products');
        } catch (err) {
            console.error('Error saving product:', err);
            setError(err.response?.data?.message || 'Failed to save product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/users/${user.id}`, profileData);
            updateUser({ ...user, ...profileData });
            setEditMode(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile');
        }
    };

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i <= 20; i++) {
            years.push(currentYear - i);
        }
        return years;
    };


    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/products/${productId}`);
            fetchMyProducts();
            alert('Product deleted successfully!');
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Failed to delete product');
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus });
            fetchMyOrders();
            alert('Order status updated successfully!');
        } catch (err) {
            console.error('Error updating order:', err);
            alert('Failed to update order status');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
            fetchMyOrders();
            alert('Order deleted successfully!');
        } catch (err) {
            console.error('Error deleting order:', err);
            alert('Failed to delete order');
        }
    };

    // Stats for Seller
    const totalSales = myOrders.reduce((acc, order) => acc + (order.status === 'completed' ? parseFloat(order.total_amount) : 0), 0);
    const activeListings = myProducts.length;
    const pendingOrders = myOrders.filter(o => o.status === 'pending').length;

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{user?.name}</h3>
                                    <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'profile'
                                        ? 'bg-blue-50 text-primary shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <FaUser size={18} /> My Profile
                                </button>

                                {user?.role === 'seller' && (
                                    <>
                                        <div className="pt-4 pb-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4">Seller Tools</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('list-product')}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'list-product'
                                                ? 'bg-blue-50 text-primary shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            <FaUpload size={18} /> List New Product
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('my-products')}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'my-products'
                                                ? 'bg-blue-50 text-primary shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            <FaBox size={18} /> My Products
                                            <span className="ml-auto bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{myProducts.length}</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('orders')}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'orders'
                                                ? 'bg-blue-50 text-primary shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            <FaMoneyBillWave size={18} /> Sold Products
                                            {pendingOrders > 0 && (
                                                <span className="ml-auto bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">{pendingOrders}</span>
                                            )}
                                        </button>
                                    </>
                                )}

                                {user?.role === 'buyer' && (
                                    <>
                                        <div className="pt-4 pb-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4">Buyer Tools</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('my-orders')}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'my-orders'
                                                ? 'bg-blue-50 text-primary shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            <FaShoppingBag size={18} /> My Orders
                                        </button>
                                    </>
                                )}

                                {user?.role === 'admin' && (
                                    <>
                                        <div className="pt-4 pb-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4">Admin Tools</p>
                                        </div>
                                        <button
                                            onClick={() => { setActiveTab('admin-dashboard'); setAdminTab('sellers'); }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'admin-dashboard' && adminTab === 'sellers'
                                                ? 'bg-blue-50 text-primary shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            <FaUser size={18} /> Manage Sellers
                                        </button>
                                        <button
                                            onClick={() => { setActiveTab('admin-dashboard'); setAdminTab('products'); }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'admin-dashboard' && adminTab === 'products'
                                                ? 'bg-blue-50 text-primary shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            <FaBox size={18} /> Manage Products
                                        </button>
                                    </>
                                )}

                                <div className="pt-4 border-t border-slate-100 mt-4">
                                    <button
                                        onClick={() => {
                                            logout();
                                            navigate('/');
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
                                    >
                                        <FaSignOutAlt size={18} /> Logout
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-6">
                        {/* Stats Row for Sellers */}
                        {user?.role === 'seller' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl">
                                        <FaMoneyBillWave />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">Total Sales</p>
                                        <p className="text-2xl font-bold text-slate-800">৳ {totalSales.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl">
                                        <FaBox />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">Active Listings</p>
                                        <p className="text-2xl font-bold text-slate-800">{activeListings}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl">
                                        <FaShoppingBag />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">Pending Orders</p>
                                        <p className="text-2xl font-bold text-slate-800">{pendingOrders}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content */}
                        <div key={activeTab} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[500px] animate-fade-in">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="max-w-2xl">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl font-bold text-slate-800">Profile Settings</h2>
                                        {!editMode && (
                                            <button
                                                onClick={() => setEditMode(true)}
                                                className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition font-medium"
                                            >
                                                <FaEdit /> Edit Profile
                                            </button>
                                        )}
                                    </div>

                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={profileData.name}
                                                    onChange={handleProfileChange}
                                                    disabled={!editMode}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={profileData.email}
                                                    onChange={handleProfileChange}
                                                    disabled={!editMode}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-500 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Account Role</label>
                                            <div className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 capitalize font-medium">
                                                {user?.role}
                                            </div>
                                        </div>

                                        {editMode && (
                                            <div className="flex gap-4 pt-4">
                                                <button
                                                    type="submit"
                                                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-200"
                                                >
                                                    <FaSave /> Save Changes
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditMode(false);
                                                        setProfileData({ name: user.name, email: user.email });
                                                    }}
                                                    className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl hover:bg-slate-200 transition font-bold"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            )}

                            {/* List New Product Tab */}
                            {activeTab === 'list-product' && user?.role === 'seller' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                        {editingProduct ? 'Edit Product' : 'List a New Product'}
                                    </h2>
                                    <p className="text-slate-500 mb-8">Fill in the details below to showcase your item to thousands of buyers.</p>

                                    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
                                        {/* Basic Info */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Basic Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Product Title *</label>
                                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="e.g., Vintage Camera" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Price (BDT) *</label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                                                        <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="0.00" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Category *</label>
                                                <select name="category_id" value={formData.category_id} onChange={handleChange} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-white">
                                                    <option value="">Select a category</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Media */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Product Image</h3>
                                            <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
                                                <div className="flex gap-4 mb-6 justify-center">
                                                    <button type="button" onClick={() => setImageSource('url')} className={`px-6 py-2 rounded-full font-medium transition-all ${imageSource === 'url' ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Image URL</button>
                                                    <button type="button" onClick={() => setImageSource('file')} className={`px-6 py-2 rounded-full font-medium transition-all ${imageSource === 'file' ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Upload File</button>
                                                </div>

                                                {imageSource === 'url' ? (
                                                    <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} required={imageSource === 'url'} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="https://example.com/image.jpg" />
                                                ) : (
                                                    <div className="text-center">
                                                        <input id="imageUpload" type="file" accept="image/*" onChange={handleImageFileChange} required={imageSource === 'file'} className="hidden" />
                                                        <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center gap-2">
                                                            {imagePreview ? (
                                                                <img src={imagePreview} alt="Preview" className="h-48 rounded-lg object-cover shadow-md" />
                                                            ) : (
                                                                <div className="w-full py-8 flex flex-col items-center text-slate-400 hover:text-primary transition-colors">
                                                                    <FaImage size={48} className="mb-2" />
                                                                    <span>Click to browse files</span>
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Details & Condition</h3>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Description *</label>
                                                <textarea name="description" value={formData.description} onChange={handleChange} required rows="5" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="Describe the item's condition, features, and any flaws..." />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Year Purchased *</label>
                                                    <select name="purchase_date" value={formData.purchase_date} onChange={handleChange} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-white">
                                                        <option value="">Select Year</option>
                                                        {generateYearOptions().map(year => <option key={year} value={`${year}-01-01`}>{year}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Listing Date</label>
                                                    <input type="text" value={getCurrentDate()} disabled className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500" />
                                                </div>
                                            </div>
                                        </div>

                                        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>}

                                        <div className="flex gap-4 pt-4">
                                            {editingProduct && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingProduct(null);
                                                        setFormData({
                                                            name: '', description: '', price: '', category_id: categories[0]?.id.toString() || '', image_url: '', purchase_date: ''
                                                        });
                                                        setActiveTab('my-products');
                                                    }}
                                                    className="flex-1 bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 transition"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button type="submit" disabled={loading} className="flex-1 bg-primary text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                                                <FaUpload /> {loading ? 'Processing...' : (editingProduct ? 'Update Product' : 'Publish Listing')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* My Products Tab */}
                            {activeTab === 'my-products' && user?.role === 'seller' && (
                                <div>
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl font-bold text-slate-800">My Products</h2>
                                        <button onClick={() => setActiveTab('list-product')} className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition">
                                            + Add New
                                        </button>
                                    </div>

                                    {myProducts.length === 0 ? (
                                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <FaBox className="mx-auto text-slate-300 mb-4" size={48} />
                                            <p className="text-slate-500 font-medium">You haven't listed any products yet.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {myProducts.map(product => (
                                                <div key={product.id} className="group bg-white border border-slate-100 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 flex flex-col">
                                                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-slate-100">
                                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700">
                                                            {product.condition_status?.replace('_', ' ').toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-bold text-slate-800 line-clamp-1">{product.name}</h3>
                                                        <span className="font-bold text-primary">৳{product.price}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{product.description}</p>

                                                    <div className="flex gap-3 mt-auto pt-4 border-t border-slate-50">
                                                        <button
                                                            onClick={() => {
                                                                setEditingProduct(product);
                                                                setFormData({
                                                                    name: product.name,
                                                                    description: product.description,
                                                                    price: product.price.toString(),
                                                                    category_id: product.category_id.toString(),
                                                                    image_url: product.image_url,
                                                                    purchase_date: product.purchase_date ? product.purchase_date.split('T')[0] : ''
                                                                });
                                                                setActiveTab('list-product');
                                                            }}
                                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition"
                                                        >
                                                            <FaEdit /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-500 py-2 rounded-lg font-bold text-sm hover:bg-red-100 transition"
                                                        >
                                                            <FaTrash /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Orders Tab (Seller & Buyer) */}
                            {(activeTab === 'orders' || activeTab === 'my-orders') && (
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-8">
                                        {user.role === 'seller' ? 'Sold Products' : 'My Orders'}
                                    </h2>
                                    {myOrders.length === 0 ? (
                                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <FaShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
                                            <p className="text-slate-500 font-medium">No orders found.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {myOrders.map(order => (
                                                <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all">
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h3 className="font-bold text-lg text-slate-800">Order #{order.id}</h3>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                                                        'bg-orange-100 text-orange-600'
                                                                    }`}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-slate-500 flex items-center gap-2">
                                                                <FaClock size={12} /> {new Date(order.created_at).toLocaleString()}
                                                            </p>
                                                            {user.role === 'seller' && (
                                                                <p className="text-sm text-slate-500 mt-1">
                                                                    <span className="font-bold">Buyer:</span> {order.buyer_name}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-slate-500">Total Amount</p>
                                                            <p className="text-2xl font-bold text-primary">৳ {order.total_amount}</p>
                                                        </div>
                                                    </div>

                                                    {/* Order Items (if available) */}
                                                    {order.items && (
                                                        <div className="mb-4 bg-slate-50 p-4 rounded-xl">
                                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Items</h4>
                                                            <ul className="space-y-2">
                                                                {order.items.map((item, idx) => (
                                                                    <li key={idx} className="flex justify-between items-center text-sm py-3 border-b border-slate-100 last:border-0">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                                                                                <img
                                                                                    src={item.image_url || 'https://placehold.co/100x100?text=Product'}
                                                                                    alt={item.product_name}
                                                                                    className="w-full h-full object-cover"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <Link to={`/products/${item.product_id}`} className="font-bold text-slate-800 hover:text-primary transition line-clamp-1 block mb-0.5">
                                                                                    {item.product_name || `Product #${item.product_id}`}
                                                                                </Link>
                                                                                {item.seller_name && (
                                                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                                                        <span className="text-slate-400">Sold by:</span>
                                                                                        <Link to={`/seller/${item.seller_id}`} className="font-medium text-slate-600 hover:text-primary transition flex items-center gap-1">
                                                                                            {item.seller_name}
                                                                                        </Link>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <span className="font-bold block text-slate-800">৳{item.price}</span>
                                                                            <span className="text-xs text-slate-400">Qty: {item.quantity || 1}</span>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {user.role === 'seller' && (
                                                        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-50">
                                                            <div className="flex-1 min-w-[200px]">
                                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Update Status</label>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => handleUpdateOrderStatus(order.id, 'pending')}
                                                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${order.status === 'pending' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                                    >
                                                                        Pending
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${order.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                                    >
                                                                        Complete
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${order.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteOrder(order.id)}
                                                                className="self-end px-4 py-2 bg-red-50 text-red-500 rounded-lg font-bold text-sm hover:bg-red-100 transition flex items-center gap-2"
                                                            >
                                                                <FaTrash /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Admin Dashboard */}
                            {activeTab === 'admin-dashboard' && user?.role === 'admin' && (
                                <div>
                                    <div className="flex gap-4 mb-8 border-b border-slate-100 pb-4">
                                        <button
                                            onClick={() => setAdminTab('sellers')}
                                            className={`px-6 py-2 rounded-full font-bold transition ${adminTab === 'sellers' ? 'bg-primary text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            Manage Sellers
                                        </button>
                                        <button
                                            onClick={() => setAdminTab('products')}
                                            className={`px-6 py-2 rounded-full font-bold transition ${adminTab === 'products' ? 'bg-primary text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            Manage Products
                                        </button>
                                    </div>

                                    {adminTab === 'sellers' && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="text-slate-400 text-sm border-b border-slate-100">
                                                        <th className="py-4 font-bold uppercase tracking-wider">Name</th>
                                                        <th className="py-4 font-bold uppercase tracking-wider">Email</th>
                                                        <th className="py-4 font-bold uppercase tracking-wider">Role</th>
                                                        <th className="py-4 font-bold uppercase tracking-wider">Status</th>
                                                        <th className="py-4 font-bold uppercase tracking-wider text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-slate-600">
                                                    {users.filter(u => u.role === 'seller').map(u => (
                                                        <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                                            <td className="py-4 font-bold text-slate-800">{u.name}</td>
                                                            <td className="py-4">{u.email}</td>
                                                            <td className="py-4 capitalize">{u.role}</td>
                                                            <td className="py-4">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.is_verified ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                                                                    {u.is_verified ? 'Verified' : 'Pending'}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <button
                                                                        onClick={() => handleVerifyUser(u.id, u.is_verified)}
                                                                        className={`p-2 rounded-lg transition ${u.is_verified ? 'bg-orange-50 text-orange-500 hover:bg-orange-100' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'}`}
                                                                        title={u.is_verified ? 'Unverify' : 'Verify'}
                                                                    >
                                                                        {u.is_verified ? <FaTimesCircle /> : <FaCheckCircle />}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteUser(u.id)}
                                                                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                                                                        title="Delete"
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {adminTab === 'products' && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="text-slate-400 text-sm border-b border-slate-100">
                                                        <th className="py-4 font-bold uppercase tracking-wider">Product</th>
                                                        <th className="py-4 font-bold uppercase tracking-wider">Seller</th>
                                                        <th className="py-4 font-bold uppercase tracking-wider">Price</th>
                                                        <th className="py-4 font-bold uppercase tracking-wider">Status</th>
                                                        <th className="py-4 font-bold uppercase tracking-wider text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-slate-600">
                                                    {allProducts.map(p => (
                                                        <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                                            <td className="py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                                                                    <span className="font-bold text-slate-800">{p.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-4">{p.seller_name}</td>
                                                            <td className="py-4 font-bold text-primary">৳{p.price}</td>
                                                            <td className="py-4">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.is_authentic ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                                                                    {p.is_authentic ? 'Authentic' : 'Unverified'}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <button
                                                                        onClick={() => handleVerifyProduct(p.id, p.is_authentic)}
                                                                        className={`p-2 rounded-lg transition ${p.is_authentic ? 'bg-orange-50 text-orange-500 hover:bg-orange-100' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'}`}
                                                                        title={p.is_authentic ? 'Unverify' : 'Verify'}
                                                                    >
                                                                        {p.is_authentic ? <FaTimesCircle /> : <FaCheckCircle />}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteProduct(p.id)}
                                                                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                                                                        title="Delete"
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
