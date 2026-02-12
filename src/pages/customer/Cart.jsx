import React from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-16 rounded-[3rem] border border-dashed border-gray-200"
                >
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <ShoppingBag className="w-12 h-12 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-10 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our fresh products and start shopping!</p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-primary-200"
                    >
                        Start Shopping
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-black text-gray-900 mb-12">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence>
                        {cartItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-8 group hover:shadow-xl transition-all duration-500"
                            >
                                <div className="w-32 h-32 bg-gray-50 rounded-3xl overflow-hidden flex-shrink-0 border border-gray-50">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <span className="text-primary-600 text-[10px] font-bold uppercase tracking-widest mb-1 block">{item.category}</span>
                                    <Link to={`/product/${item.id}`} className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors block mb-2">{item.name}</Link>
                                    <p className="text-gray-400 text-sm font-medium">{item.unit}</p>
                                </div>

                                <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                    <button
                                        onClick={() => updateQuantity(item.id, Math.max(1, item.cartQuantity - 1))}
                                        className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-primary-600 active:scale-90 transition-all"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-bold text-gray-900">{item.cartQuantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                                        className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-primary-600 active:scale-90 transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="text-right">
                                    <p className="text-2xl font-black text-gray-900 mb-1">₹{(item.price * item.cartQuantity).toFixed(2)}</p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl sticky top-28">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 pb-6 border-b border-gray-50">Order Summary</h3>

                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Subtotal</span>
                                <span className="text-gray-900">₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Shipping</span>
                                <span className="text-primary-600 font-bold">FREE</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Tax Estimate</span>
                                <span className="text-gray-900">₹0.00</span>
                            </div>
                            <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                                <span className="text-lg font-bold text-gray-900">Total Price</span>
                                <span className="text-4xl font-black text-primary-600">₹{cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full h-16 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-lg flex items-center justify-center space-x-3 transition-all shadow-xl shadow-primary-200 group active:scale-[0.98]"
                        >
                            <span>Proceed to Checkout</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-widest font-bold">Secure SSL encrypted payment</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
