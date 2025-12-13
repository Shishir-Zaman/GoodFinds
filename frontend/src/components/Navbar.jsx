import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaSignOutAlt, FaUserCircle, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
    const { cartItems } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-3">
                    <Logo size={40} />
                    <span>GoodFinds</span>
                </Link>

                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-1/3">
                    <FaSearch className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="bg-transparent border-none outline-none ml-2 w-full text-sm"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                navigate(`/products?search=${e.target.value}`);
                            }
                        }}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6">
                    <Link to="/products" className="text-slate-600 hover:text-primary font-medium">
                        Browse
                    </Link>

                    <Link to="/cart" className="relative text-slate-600 hover:text-primary">
                        <FaShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated() ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 text-slate-600 hover:text-primary font-medium"
                            >
                                <FaUserCircle size={24} />
                                <span className="hidden md:block">{user?.name}</span>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                    </div>
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <FaUser size={14} />
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                                    >
                                        <FaSignOutAlt size={14} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="flex items-center gap-2 text-slate-600 hover:text-primary font-medium">
                                <FaUser />
                                <span>Login</span>
                            </Link>

                            <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
