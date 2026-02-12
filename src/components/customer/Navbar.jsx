import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, ChevronDown, MapPin, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartItems, userInfo, logout } = useCart();
    const navigate = useNavigate();

    const cartCount = cartItems.reduce((acc, item) => acc + item.cartQuantity, 0);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="bg-primary-600 text-white py-1.5 px-4 text-center text-xs font-medium">
                Free delivery on orders over ₹500! Use code <span className="underline">FRESH50</span>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 space-x-4">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-green-500 bg-clip-text text-transparent">
                            Martify
                        </span>
                    </Link>

                    {/* Location Picker (Desktop) */}
                    <div className="hidden lg:flex items-center space-x-1 text-sm bg-gray-50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        <span className="text-gray-700 font-medium whitespace-nowrap">Deliver to: <span className="text-gray-900">{userInfo?.address?.city ? `${userInfo.address.city}, ${userInfo.address.zip}` : 'New York, 10001'}</span></span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-xl relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search for groceries, snacks, beverages..."
                            className="w-full bg-gray-50 pl-12 pr-4 py-2.5 rounded-xl border border-transparent focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-transparent transition-all outline-none text-sm"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 sm:space-x-4">
                        {userInfo ? (
                            <div className="relative group">
                                <button className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                                        {userInfo.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{userInfo.name?.split(' ')[0] || 'User'}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                    <div className="px-4 py-2 border-b border-gray-50 mb-2">
                                        <p className="text-xs text-gray-400">Signed in as</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{userInfo.email}</p>
                                    </div>
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">My Profile</Link>
                                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">My Orders</Link>
                                    {userInfo.role === 'admin' && (
                                        <Link to="/admin" className="block px-4 py-2 text-sm text-primary-600 font-bold hover:bg-gray-50 transition-colors">Admin Panel</Link>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-2"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                                <User className="w-5 h-5 text-gray-700" />
                                <span className="text-sm font-medium text-gray-700">Account</span>
                            </Link>
                        )}

                        <Link
                            to="/wishlist"
                            className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group"
                        >
                            <Heart className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition-colors" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-red-500 transition-colors">Wishlist</span>
                        </Link>

                        <button
                            onClick={() => navigate('/cart')}
                            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all relative group"
                        >
                            <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-primary-600" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search - Visible only on mobile */}
                <div className="md:hidden py-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search groceries..."
                            className="w-full bg-gray-50 pl-12 pr-4 py-2.5 rounded-xl border border-transparent focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-transparent transition-all outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t px-4 py-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-300">
                    <nav className="flex flex-col space-y-4">
                        <Link to="/" className="text-gray-900 font-medium py-2 hover:text-primary-600">Home</Link>
                        <Link to="/shop" className="text-gray-900 font-medium py-2 hover:text-primary-600">Shop By Category</Link>
                        <Link to="/offers" className="text-gray-900 font-medium py-2 hover:text-primary-600">Special Offers</Link>
                        <div className="border-t pt-4">
                            {userInfo ? (
                                <>
                                    <div className="flex items-center space-x-3 py-2 px-2 bg-gray-50 rounded-xl mb-4">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                            {userInfo?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{userInfo?.name || 'User'}</p>
                                            <p className="text-xs text-gray-500">{userInfo?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <Link to="/profile" className="text-gray-900 font-medium py-2 hover:text-primary-600 block">My Profile</Link>
                                    <Link to="/profile" className="text-gray-900 font-medium py-2 hover:text-primary-600 block">My Profile</Link>
                                    <Link to="/wishlist" className="text-gray-900 font-medium py-2 hover:text-primary-600 block">My Wishlist</Link>
                                    <Link to="/orders" className="text-gray-900 font-medium py-2 hover:text-primary-600 block">My Orders</Link>
                                    <button onClick={logout} className="text-red-600 font-bold py-2 block w-full text-left">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-900 font-medium py-2 hover:text-primary-600 block">Sign In</Link>
                                    <Link to="/signup" className="text-gray-900 font-medium py-2 hover:text-primary-600 block">Create Account</Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
