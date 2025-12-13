import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaShoppingCart, FaRegCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [imageLoaded, setImageLoaded] = useState(false);

    // Calculate product age in years
    const getProductAge = (dateString) => {
        const purchaseDate = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - purchaseDate);
        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);

        if (diffYears < 1) return 'Less than 1 year old';
        if (diffYears < 2) return '1 year old';
        return `${Math.floor(diffYears)} years old`;
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full relative">
            {/* Image Container */}
            <Link to={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-slate-100 block">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                )}
                <img
                    src={product.image_url || 'https://placehold.co/600x400?text=Product'}
                    alt={product.name}
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover object-center group-hover:scale-110 transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Badges Overlay */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    {!!product.is_authentic ? (
                        <div className="bg-white/90 backdrop-blur-sm text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                            <FaCheckCircle size={10} /> VERIFIED
                        </div>
                    ) : (
                        <div className="bg-white/90 backdrop-blur-sm text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                            <FaRegCircle size={10} /> UNVERIFIED
                        </div>
                    )}
                </div>

                {/* Quick Add Button - Visible on Hover */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                    }}
                    className="absolute bottom-3 right-3 bg-white text-slate-900 p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                    title="Add to Cart"
                >
                    <FaShoppingCart size={16} />
                </button>
            </Link>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Seller & Age Row */}
                <div className="flex justify-between items-center mb-2">
                    <Link
                        to={`/seller/${product.seller_id}`}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary transition group/seller"
                    >
                        <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-[10px]">
                            {product.seller_name?.charAt(0)}
                        </div>
                        <span className="font-medium truncate max-w-[80px]">{product.seller_name}</span>
                        {product.seller_verified ? (
                            <FaCheckCircle className="text-emerald-500" size={10} />
                        ) : (
                            <FaRegCircle className="text-slate-300" size={10} />
                        )}
                    </Link>
                    <span className="text-[10px] font-medium bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full border border-slate-100">
                        {getProductAge(product.purchase_date)}
                    </span>
                </div>

                {/* Title */}
                <Link to={`/products/${product.id}`} className="block mb-1">
                    <h3 className="font-bold text-slate-800 leading-tight group-hover:text-primary transition line-clamp-1" title={product.name}>
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                        ৳ {product.price.toLocaleString()}
                    </span>
                    <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                        {(() => {
                            const purchaseDate = new Date(product.purchase_date);
                            const today = new Date();
                            const diffYears = (today - purchaseDate) / (1000 * 60 * 60 * 24 * 365);

                            if (diffYears >= 20) return 'Antique';
                            if (diffYears >= 5) return 'Vintage';
                            return product.condition_status?.replace('_', ' ');
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
