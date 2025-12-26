import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingBag, FaCreditCard, FaTruck } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Cart = () => {
    const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const navigate = useNavigate();

    const total = getCartTotal();
    const shippingCost = 100;
    const grandTotal = total + shippingCost;

    const handleCheckout = async () => {
        if (!isAuthenticated() || !user) {
            alert('Please login to checkout');
            navigate('/login');
            return;
        }

        setIsCheckingOut(true);

        try {
            await axios.post('https://goodfinds.onrender.com/api/orders', {
                buyer_id: user.id,
                items: cartItems,
                total_amount: grandTotal
            });

            alert('Order placed successfully!');
            clearCart();
            navigate('/dashboard'); // Redirect to dashboard to see the order
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/products" className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-600 hover:bg-primary hover:text-white transition-all">
                        <FaArrowLeft />
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-800">Shopping Cart</h1>
                    <span className="bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-bold">{cartItems.length} Items</span>
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-blue-50 text-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaShoppingBag size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
                        <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/products" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-6 items-center group hover:shadow-md transition-all">
                                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                                            <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition p-2">
                                                <FaTrash />
                                            </button>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-2 line-clamp-1">{item.description}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1 rounded-lg">
                                                <span>Qty: {item.quantity}</span>
                                            </div>
                                            <p className="text-xl font-bold text-primary">৳ {item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                                <h3 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium">৳ {total}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span className="flex items-center gap-2"><FaTruck className="text-slate-400" /> Shipping</span>
                                        <span className="font-medium">৳ {shippingCost}</span>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-slate-200 pt-4 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="font-bold text-slate-800">Total</span>
                                        <span className="text-3xl font-bold text-primary">৳ {grandTotal}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isCheckingOut ? (
                                        'Processing...'
                                    ) : (
                                        <>
                                            Checkout <FaCreditCard />
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-center text-slate-400 mt-4">
                                    Secure checkout powered by GoodFinds
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
