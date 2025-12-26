import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showAllSellers, setShowAllSellers] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [category, setCategory] = useState(queryParams.get('category') || '');
    const [search, setSearch] = useState(queryParams.get('search') || '');
    const [sortBy, setSortBy] = useState('date_desc');
    const [condition, setCondition] = useState('');
    const [sellerId, setSellerId] = useState('');

    useEffect(() => {
        // Fetch categories
        axios.get('https://goodfinds.onrender.com/api/products/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));

        // Fetch sellers
        axios.get('https://goodfinds.onrender.com/api/users/sellers')
            .then(res => {
                const sellerUsers = res.data;
                const verified = sellerUsers.filter(s => s.is_verified).sort((a, b) => a.name.localeCompare(b.name));
                const unverified = sellerUsers.filter(s => !s.is_verified).sort((a, b) => a.name.localeCompare(b.name));
                setSellers([...verified, ...unverified]);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = 'https://goodfinds.onrender.com/api/products';
                const params = [];
                if (category) params.push(`category=${category}`);
                if (search) params.push(`search=${search}`);
                if (sortBy) params.push(`sort=${sortBy}`);
                if (condition) params.push(`condition=${condition}`);
                if (sellerId) params.push(`seller_id=${sellerId}`);

                if (params.length > 0) {
                    url += `?${params.join('&')}`;
                }

                const res = await axios.get(url);
                setProducts(res.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, search, sortBy, condition, sellerId]);

    useEffect(() => {
        setSearch(queryParams.get('search') || '');
        setCategory(queryParams.get('category') || '');
    }, [location.search]);

    const displayedCategories = showAllCategories ? categories : categories.slice(0, 5);
    const displayedSellers = showAllSellers ? sellers : sellers.slice(0, 5);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full md:w-64 space-y-8">
                    {/* Categories */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Categories</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setCategory('')}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${category === ''
                                    ? 'bg-blue-50 text-primary'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                All Categories
                            </button>
                            {displayedCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategory(cat.name)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${category === cat.name
                                        ? 'bg-blue-50 text-primary'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                            {categories.length > 5 && (
                                <button
                                    onClick={() => setShowAllCategories(!showAllCategories)}
                                    className="w-full text-left px-3 py-1 text-xs font-semibold text-slate-400 hover:text-primary transition-colors"
                                >
                                    {showAllCategories ? '- Show less' : `+ Show more (${categories.length - 5})`}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Condition */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Condition</h3>
                        <div className="space-y-1">
                            {[
                                { id: '', label: 'Any Condition' },
                                { id: 'new', label: 'New' },
                                { id: 'like_new', label: 'Lightly Used' },
                                { id: 'good', label: 'Vintage' }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setCondition(item.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${condition === item.id
                                        ? 'bg-blue-50 text-primary'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sellers */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Sellers</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setSellerId('')}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${sellerId === ''
                                    ? 'bg-blue-50 text-primary'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                All Sellers
                            </button>
                            {displayedSellers.map(seller => (
                                <button
                                    key={seller.id}
                                    onClick={() => setSellerId(seller.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group ${sellerId === seller.id
                                        ? 'bg-blue-50 text-primary'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <span className="truncate">{seller.name}</span>
                                    {seller.is_verified ? (
                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">✓</span>
                                    ) : (
                                        <span className="text-[10px] text-slate-300 group-hover:text-slate-400">○</span>
                                    )}
                                </button>
                            ))}
                            {sellers.length > 5 && (
                                <button
                                    onClick={() => setShowAllSellers(!showAllSellers)}
                                    className="w-full text-left px-3 py-1 text-xs font-semibold text-slate-400 hover:text-primary transition-colors"
                                >
                                    {showAllSellers ? '- Show less' : `+ Show more (${sellers.length - 5})`}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">
                            {category || search || 'All Products'} <span className="text-sm font-normal text-slate-500">({products.length} items)</span>
                        </h1>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="date_desc">Newest Listed</option>
                            <option value="date_asc">Oldest Listed</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="age_asc">Product Age: Newest</option>
                            <option value="age_desc">Product Age: Oldest</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">No products found matching your criteria.</div>
                    ) : (
                        <div key={`${category}-${search}-${sortBy}-${condition}-${sellerId}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
