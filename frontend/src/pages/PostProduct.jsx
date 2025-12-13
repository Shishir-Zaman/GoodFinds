import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaImage } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PostProduct = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageSource, setImageSource] = useState('url');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '1',
        image_url: '',
        purchase_date: ''
    });

    useEffect(() => {
        if (!isAuthenticated() || user?.role !== 'seller') {
            navigate('/login');
        }
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
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
                seller_id: user.id,
                condition_status: condition,
                image_url: finalImageUrl,
                purchase_date: formData.purchase_date,
                created_at: new Date().toISOString()
            };

            console.log('Sending product data:', productData);
            await axios.post('http://localhost:5000/api/products', productData);
            navigate('/dashboard');
        } catch (err) {
            console.error('Error posting product:', err);
            setError(err.response?.data?.message || 'Failed to post product. Please try again.');
        } finally {
            setLoading(false);
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

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">List a New Product</h1>
                <p className="text-gray-600 mb-8">Fill in the details to list your item on GoodFinds</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="seller-name" className="block text-sm font-medium text-gray-700 mb-2">Seller ID</label>
                        <input id="seller-name" type="text" value={user?.name || 'Unknown Seller'} disabled className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600" />
                    </div>

                    <div>
                        <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
                        <input id="product-name" type="text" name="name" value={formData.name} onChange={handleChange} required autoComplete="off" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="e.g., iPhone 13 Pro 128GB" />
                    </div>

                    <div>
                        <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-2">Pricing (BDT) *</label>
                        <input id="product-price" type="number" name="price" value={formData.price} onChange={handleChange} required min="0" autoComplete="off" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter price in BDT" />
                    </div>

                    <div>
                        <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-2">Select a Category *</label>
                        <select id="product-category" name="category_id" value={formData.category_id} onChange={handleChange} required autoComplete="off" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value="1">Electronics</option>
                            <option value="2">Clothing</option>
                            <option value="3">Furniture</option>
                            <option value="4">Toys</option>
                            <option value="5">Books</option>
                            <option value="6">Sports</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Media (Upload Picture of the Product) *</label>
                        <div className="flex gap-4 mb-4">
                            <button type="button" onClick={() => setImageSource('url')} className={`px-4 py-2 rounded-lg ${imageSource === 'url' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>Image URL</button>
                            <button type="button" onClick={() => setImageSource('file')} className={`px-4 py-2 rounded-lg ${imageSource === 'file' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>Upload from PC</button>
                        </div>

                        {imageSource === 'url' ? (
                            <div>
                                <label htmlFor="image-url" className="sr-only">Image URL</label>
                                <input id="image-url" type="url" name="image_url" value={formData.image_url} onChange={handleChange} required={imageSource === 'url'} autoComplete="url" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="https://example.com/image.jpg" />
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition">
                                <input id="imageUpload" type="file" accept="image/*" onChange={handleImageFileChange} required={imageSource === 'file'} className="hidden" aria-label="Upload product image" />
                                <label htmlFor="imageUpload" className="cursor-pointer">
                                    {imagePreview ? <img src={imagePreview} alt="Preview" className="mx-auto max-h-48 mb-3" /> : <FaImage className="mx-auto text-gray-400 mb-3" size={48} />}
                                    <p className="text-sm text-gray-600">Click to upload image from your PC</p>
                                </label>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-2">Describe your item in detail... *</label>
                        <p className="text-xs text-gray-500 mb-2">Include condition, features, and any defects.</p>
                        <textarea id="product-description" name="description" value={formData.description} onChange={handleChange} required rows="6" autoComplete="off" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Describe the condition, features, any scratches or defects, accessories included, etc." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="purchase-date" className="block text-sm font-medium text-gray-700 mb-2">Date Purchased *</label>
                            <select id="purchase-date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} required autoComplete="off" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option value="">Select Year</option>
                                {generateYearOptions().map(year => <option key={year} value={`${year}-01-01`}>{year}</option>)}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="listing-date" className="block text-sm font-medium text-gray-700 mb-2">Listing Date</label>
                            <input id="listing-date" type="text" value={getCurrentDate()} disabled className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600" />
                            <p className="text-xs text-gray-500 mt-1">Fixed to current date</p>
                        </div>
                    </div>

                    {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 bg-gray-100 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-200 transition">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <FaUpload />
                            {loading ? 'Listing Product...' : 'List Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostProduct;
