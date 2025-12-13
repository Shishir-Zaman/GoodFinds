import React from 'react';
import Logo from './Logo';

const Footer = () => {
    return (
        <footer className="bg-secondary text-slate-300 py-8 mt-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Logo size={36} />
                        <h3 className="text-white text-lg font-bold">GoodFinds</h3>
                    </div>
                    <p className="text-sm">
                        The best marketplace for second-hand and refurbished products in Bangladesh.
                        Verified sellers, authentic products.
                    </p>
                </div>
                <div>
                    <h4 className="text-white font-medium mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/products" className="hover:text-white">Browse Products</a></li>
                        <li><a href="/login" className="hover:text-white">Login</a></li>
                        <li><a href="/register" className="hover:text-white">Register</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-medium mb-4">Contact</h4>
                    <p className="text-sm">Dhaka, Bangladesh</p>
                    <p className="text-sm">support@goodfinds.bd</p>
                </div>
            </div>
            <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm">
                &copy; {new Date().getFullYear()} GoodFinds. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
