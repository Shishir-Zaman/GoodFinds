import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Categories
                const catRes = await axios.get('http://localhost:5000/api/products/categories');
                setCategories(catRes.data);

                // Fetch Featured Products (Limit to 8 for home page)
                const prodRes = await axios.get('http://localhost:5000/api/products');
                setFeaturedProducts(prodRes.data.slice(0, 8));
            } catch (error) {
                console.error('Error fetching home data:', error);
            }
        };

        fetchData();
    }, []);

    const nextCategory = () => {
        setCurrentCategoryIndex((prev) => (prev + 3 >= categories.length ? 0 : prev + 3));
    };

    const prevCategory = () => {
        setCurrentCategoryIndex((prev) => (prev - 3 < 0 ? Math.max(0, categories.length - 3) : prev - 3));
    };

    const visibleCategories = categories.slice(currentCategoryIndex, currentCategoryIndex + 3);

    return (
        <div>
            {/* Hero Section with Scenic Background */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=1920)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-800/75 to-blue-900/85"></div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
                        Find Hidden Gems at <span className="text-blue-300">GoodFinds</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-50 mb-10 max-w-3xl mx-auto drop-shadow">
                        The most trusted marketplace for second-hand and refurbished treasures in Bangladesh.
                        Verified sellers, authentic products.
                    </p>
                    <div className="flex justify-center gap-6">
                        <Link
                            to="/products"
                            className="group bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300 hover:bg-blue-50"
                        >
                            <span className="group-hover:tracking-wide transition-all duration-300">Start Exploring</span>
                        </Link>
                        <Link
                            to="/register"
                            className="group bg-transparent border-3 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 active:scale-95 transition-all duration-300 shadow-xl"
                        >
                            <span className="group-hover:tracking-wide transition-all duration-300">Sell Item</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Popular Brands Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Popular Bangladeshi Brands</h2>
                    <div className="flex flex-wrap justify-center items-center gap-12">
                        {['Walton', 'Aarong', 'RFL', 'Yamaha', 'Singer', 'ToyZone BD'].map((brand) => (
                            <div
                                key={brand}
                                className="group cursor-pointer transition-all duration-300 hover:scale-110"
                            >
                                <span className="text-2xl font-bold text-gray-400 group-hover:text-blue-600 transition-colors duration-300">
                                    {brand}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Carousel */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-12 text-slate-800 text-center">Browse by Category</h2>

                    <div className="relative">
                        {/* Carousel Container */}
                        <div className="flex items-center justify-center gap-6">
                            {/* Previous Button */}
                            {categories.length > 3 && (
                                <button
                                    onClick={prevCategory}
                                    className="group bg-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 hover:bg-blue-50"
                                    aria-label="Previous categories"
                                >
                                    <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}

                            {/* Category Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 max-w-6xl">
                                {visibleCategories.map(cat => (
                                    <Link
                                        key={cat.id}
                                        to={`/products?category=${cat.name}`}
                                        className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95"
                                    >
                                        <img
                                            src={cat.image_url}
                                            alt={cat.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center pb-8 group-hover:from-blue-900/80 group-hover:via-blue-800/40 transition-all duration-500">
                                            <h3 className="text-white text-3xl font-bold group-hover:scale-110 transition-transform duration-300">
                                                {cat.name}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Next Button */}
                            {categories.length > 3 && (
                                <button
                                    onClick={nextCategory}
                                    className="group bg-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 hover:bg-blue-50"
                                    aria-label="Next categories"
                                >
                                    <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Carousel Indicators */}
                        {categories.length > 3 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {Array.from({ length: Math.ceil(categories.length / 3) }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentCategoryIndex(idx * 3)}
                                        className={`h-2 rounded-full transition-all duration-300 ${Math.floor(currentCategoryIndex / 3) === idx
                                            ? 'w-8 bg-blue-600'
                                            : 'w-2 bg-gray-300 hover:bg-gray-400'
                                            }`}
                                        aria-label={`Go to category group ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Fresh Finds Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-slate-800 mb-3">Fresh Finds</h2>
                        <p className="text-xl text-slate-500">Recently listed items you might love</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Shop Now Button */}
                    <div className="text-center">
                        <Link
                            to="/products"
                            className="group inline-block bg-blue-600 text-white px-16 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300 hover:bg-blue-700"
                        >
                            <span className="group-hover:tracking-wider transition-all duration-300">Shop Now</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Authentic Products & Verified Sellers Section */}
            <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-slate-800 mb-16">Why Choose GoodFinds?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Authentic Products */}
                        <div className="group text-center p-8 rounded-2xl hover:bg-white hover:shadow-2xl transition-all duration-500 hover:scale-105">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500">
                                <svg className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Authentic Products</h3>
                            <p className="text-gray-600">Every item is verified for authenticity before listing</p>
                        </div>

                        {/* Verified Sellers */}
                        <div className="group text-center p-8 rounded-2xl hover:bg-white hover:shadow-2xl transition-all duration-500 hover:scale-105">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500">
                                <svg className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Verified Sellers</h3>
                            <p className="text-gray-600">Connect with trusted sellers across Bangladesh</p>
                        </div>

                        {/* Item History */}
                        <div className="group text-center p-8 rounded-2xl hover:bg-white hover:shadow-2xl transition-all duration-500 hover:scale-105">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500">
                                <svg className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Item History</h3>
                            <p className="text-gray-600">Know exactly how long items have been used</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section - Start Selling */}
            <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Got Items to Sell?
                        </h2>
                        <p className="text-2xl text-blue-100 mb-12 leading-relaxed">
                            Join thousands of sellers on Bangladesh's most trusted marketplace.
                            Turn your unused items into cash today!
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {/* Step 1 */}
                            <div className="group">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-3xl font-bold text-blue-600">1</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Create Account</h3>
                                    <p className="text-blue-100">Sign up as a seller in seconds</p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="group">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-3xl font-bold text-blue-600">2</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">List Your Items</h3>
                                    <p className="text-blue-100">Upload photos and details easily</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="group">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-3xl font-bold text-blue-600">3</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Start Earning</h3>
                                    <p className="text-blue-100">Connect with buyers instantly</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/register"
                            className="group inline-block bg-white text-blue-600 px-16 py-6 rounded-full font-bold text-2xl shadow-2xl hover:shadow-white/30 hover:scale-110 active:scale-95 transition-all duration-300"
                        >
                            <span className="group-hover:tracking-wider transition-all duration-300">Start Selling Now</span>
                        </Link>

                        <p className="text-blue-200 mt-6 text-lg">
                            No listing fees • Free to join • Trusted by thousands
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="group hover:scale-110 transition-transform duration-300">
                            <div className="text-5xl font-bold text-blue-400 mb-2">1000+</div>
                            <div className="text-slate-400 group-hover:text-white transition-colors">Active Sellers</div>
                        </div>
                        <div className="group hover:scale-110 transition-transform duration-300">
                            <div className="text-5xl font-bold text-blue-400 mb-2">5000+</div>
                            <div className="text-slate-400 group-hover:text-white transition-colors">Products Listed</div>
                        </div>
                        <div className="group hover:scale-110 transition-transform duration-300">
                            <div className="text-5xl font-bold text-blue-400 mb-2">10K+</div>
                            <div className="text-slate-400 group-hover:text-white transition-colors">Happy Buyers</div>
                        </div>
                        <div className="group hover:scale-110 transition-transform duration-300">
                            <div className="text-5xl font-bold text-blue-400 mb-2">98%</div>
                            <div className="text-slate-400 group-hover:text-white transition-colors">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
