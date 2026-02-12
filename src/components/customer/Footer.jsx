import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setTimeout(() => {
                setSubscribed(false);
                setEmail('');
            }, 3000);
        }
    };

    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-3xl font-black bg-gradient-to-r from-primary-400 to-green-400 bg-clip-text text-transparent">
                                FreshMart
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed font-light mt-4">
                            Bringing the freshest organic produce and daily essentials from local farms directly to your doorstep. Quality and freshness guaranteed.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300 border border-white/10 group">
                                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary-600 rounded-full" />
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'About Us', path: '/about' },
                                { name: 'Special Offers', path: '/offers' },
                                { name: 'My Account', path: '/profile' },
                                { name: 'Order History', path: '/orders' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.path} className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-4 h-[1px] bg-primary-500 mr-0 group-hover:mr-2 transition-all duration-300" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 relative inline-block">
                            Categories
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary-600 rounded-full" />
                        </h4>
                        <ul className="space-y-4 text-gray-400">
                            {['Vegetables', 'Fruits', 'Dairy', 'Beverages'].map((cat) => (
                                <li key={cat}>
                                    <Link to={`/shop`} className="hover:text-primary-400 transition-colors cursor-pointer">{cat}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter & Contact */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 relative inline-block">
                            Stay Updated
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary-600 rounded-full" />
                        </h4>
                        <div className="space-y-6">
                            <p className="text-gray-400 font-light">Subscribe to get the latest offers and updates.</p>

                            <form onSubmit={handleSubscribe} className="relative">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    {subscribed ? <span className="text-xs font-bold">✓</span> : <ArrowRight className="w-4 h-4" />}
                                </button>
                            </form>

                            <div className="pt-4 space-y-3">
                                <div className="flex items-center space-x-3 text-gray-400">
                                    <Phone className="w-4 h-4 text-primary-500" />
                                    <span className="text-sm font-light">+91 73806 63685</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-400">
                                    <Mail className="w-4 h-4 text-primary-500" />
                                    <span className="text-sm font-light">puneetkushwaha88@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/5 pt-10 mt-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <p className="text-gray-500 text-sm font-light">
                            © 2026 <span className="text-white font-bold">FreshMart</span>. All rights reserved.
                            <span className="mx-2">|</span>
                            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <span className="mx-2">|</span>
                            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        </p>
                        <div className="flex items-center space-x-6">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4 opacity-30 invert grayscale" alt="Visa" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 opacity-30 invert grayscale" alt="Mastercard" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" className="h-5 opacity-30 invert grayscale" alt="PayPal" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
