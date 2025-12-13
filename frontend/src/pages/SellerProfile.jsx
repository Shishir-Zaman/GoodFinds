import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaMapMarkerAlt, FaRegCircle } from 'react-icons/fa';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const SellerProfile = () => {
    const { id } = useParams();
    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                const [sellerRes, productsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/users/${id}`),
                    axios.get(`http://localhost:5000/api/users/${id}/products`)
                ]);
                setSeller(sellerRes.data);
                setProducts(productsRes.data);
            } catch (error) {
                console.error('Error fetching seller data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerData();
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!seller) return <div className="text-center py-20">Seller not found</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Seller Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {seller.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{seller.name}</h1>
                                {seller.is_verified ? (
                                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200">
                                        <FaCheckCircle />
                                        <span>Verified Seller</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 bg-gray-50 text-gray-400 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                                        <FaRegCircle />
                                        <span>Not Verified</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-600 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-gray-400" />
                                Bangladesh
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                {products.length} product{products.length !== 1 ? 's' : ''} listed
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Products by {seller.name}</h2>

                {products.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl">
                        <p className="text-gray-500">This seller hasn't listed any products yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerProfile;
