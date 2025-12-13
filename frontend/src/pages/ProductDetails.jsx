import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaShoppingCart, FaRegCircle, FaCalendarAlt, FaClock, FaHistory, FaArrowLeft, FaShieldAlt, FaTag } from 'react-icons/fa';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Calculate product age
    const getProductAge = (dateString) => {
        const purchaseDate = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - purchaseDate);
        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);

        if (diffYears < 1) {
            const months = Math.floor((diffTime / (1000 * 60 * 60 * 24 * 30)));
            return months === 0 ? 'Brand new' : `${months} month${months > 1 ? 's' : ''} old`;
        }
        const years = Math.floor(diffYears);
        return `${years} year${years > 1 ? 's' : ''} old`;
    };

    const getConditionDisplay = (product) => {
        if (!product) return '';

        const purchaseDate = new Date(product.purchase_date);
        const today = new Date();
        const diffYears = (today - purchaseDate) / (1000 * 60 * 60 * 24 * 365);

        if (diffYears >= 20) return 'Antique';
        if (diffYears >= 5) return 'Vintage';

        return product.condition_status?.replace('_', ' ');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Product not found</h2>
            <Link to="/products" className="text-primary hover:underline">Back to Products</Link>
        </div>
    );

    const conditionDisplay = getConditionDisplay(product);

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4">
                {/* Breadcrumb / Back */}
                <div className="mb-8">
                    <Link to="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition font-medium">
                        <FaArrowLeft /> Back to Products
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden aspect-square relative group bg-slate-50">
                            <img
                                src={product.image_url || 'https://placehold.co/600x400?text=Product'}
                                alt={product.name}
                                className="w-full h-full object-cover object-center"
                            />
                            {/* Overlay Badges */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                                {!!product.is_authentic ? (
                                    <div className="bg-white/90 backdrop-blur-md text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                                        <FaCheckCircle /> VERIFIED
                                    </div>
                                ) : (
                                    <div className="bg-white/90 backdrop-blur-md text-slate-500 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                                        <FaRegCircle /> UNVERIFIED
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {product.category_name}
                                </span>
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                    <FaTag size={10} /> {conditionDisplay}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">{product.name}</h1>

                            <div className="flex items-baseline gap-4 mb-8">
                                <span className="text-4xl font-bold text-primary">৳ {product.price.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Seller Info Card */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex items-center justify-between hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-100">
                                    {product.seller_name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Sold by</p>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={`/seller/${product.seller_id}`}
                                            className="font-bold text-slate-800 hover:text-primary transition text-lg"
                                        >
                                            {product.seller_name}
                                        </Link>
                                        {product.seller_verified ? (
                                            <FaCheckCircle className="text-emerald-500" title="Verified Seller" />
                                        ) : (
                                            <FaRegCircle className="text-slate-300" title="Not Verified" />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Link to={`/seller/${product.seller_id}`} className="text-sm font-bold text-primary hover:underline">
                                View Profile
                            </Link>
                        </div>

                        {/* Description */}
                        <div className="prose prose-slate max-w-none mb-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-3">Description</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">{product.description || 'No description provided.'}</p>
                        </div>

                        {/* Product History Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 text-blue-600 mb-2">
                                    <FaCalendarAlt />
                                    <span className="font-bold text-xs uppercase tracking-wider">Purchased</span>
                                </div>
                                <p className="text-slate-800 font-bold text-lg">
                                    {product.purchase_date ? new Date(product.purchase_date).getFullYear() : 'N/A'}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">Original purchase year</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 text-purple-600 mb-2">
                                    <FaHistory />
                                    <span className="font-bold text-xs uppercase tracking-wider">Age</span>
                                </div>
                                <p className="text-slate-800 font-bold text-lg">
                                    {getProductAge(product.purchase_date)}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">Since purchase</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto flex gap-4">
                            <button
                                onClick={() => addToCart(product)}
                                className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-3 shadow-xl shadow-blue-200 transform hover:-translate-y-1"
                            >
                                <FaShoppingCart /> Add to Cart
                            </button>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm">
                            <FaShieldAlt />
                            <span>GoodFinds Buyer Protection</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
