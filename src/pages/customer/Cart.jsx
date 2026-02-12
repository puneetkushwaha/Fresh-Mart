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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-8 md:mb-12 tracking-tight">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    <AnimatePresence>
                        {cartItems.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 md:gap-8 group hover:shadow-xl transition-all duration-500"
                            >
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-xl md:rounded-3xl overflow-hidden flex-shrink-0 border border-gray-50">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <span className="text-primary-600 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1 block underline decoration-2 md:decoration-4 underline-offset-2 md:underline-offset-4">{item.category}</span>
                                    <Link to={`/product/${item._id}`} className="text-base md:text-xl font-black text-gray-900 hover:text-primary-600 transition-colors block mb-1 tracking-tight">{item.name}</Link>
                                    <p className="text-gray-400 text-[10px] md:text-sm font-bold uppercase tracking-wider">{item.unit}</p>
                                </div>

                                <div className="flex items-center bg-gray-50 p-1 md:p-1.5 rounded-xl md:rounded-2xl border border-gray-100">
                                    <button
                                        onClick={() => updateQuantity(item._id, Math.max(1, item.cartQuantity - 1))}
                                        className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-primary-600 active:scale-90 transition-all"
                                    >
                                        <Minus className="w-3 h-3 md:w-4 md:h-4" />
                                    </button>
                                    <span className="w-8 md:w-12 text-center font-black text-gray-900 text-sm md:text-base">{item.cartQuantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}
                                        className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-primary-600 active:scale-90 transition-all"
                                    >
                                        <Plus className="w-3 h-3 md:w-4 md:h-4" />
                                    </button>
                                </div>

                                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 px-2 lg:px-0">
                                    <p className="text-lg md:text-2xl font-black text-gray-900">₹{(item.price * item.cartQuantity).toFixed(2)}</p>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                    >
                                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {/* Continued Shopping Button */}
                    <button
                        onClick={() => navigate('/shop')}
                        className="w-full md:w-auto px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4 lg:mt-0"
                    >
                        <ArrowRight className="w-5 h-5 rotate-180" />
                        <span>Add More Items</span>
                    </button>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-gray-100 shadow-xl sticky top-28">
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-gray-50 tracking-tight">Order Summary</h3>

                        <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                            <div className="flex justify-between text-gray-500 font-bold text-xs md:text-sm uppercase tracking-wider">
                                <span>Subtotal</span>
                                <span className="text-gray-900">₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-bold text-xs md:text-sm uppercase tracking-wider">
                                <span>Shipping</span>
                                <span className="text-primary-600">FREE</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-bold text-xs md:text-sm uppercase tracking-wider">
                                <span>Tax Estimate</span>
                                <span className="text-gray-900">₹0.00</span>
                            </div>
                            <div className="pt-4 md:pt-6 border-t border-gray-50 flex justify-between items-end">
                                <span className="text-sm md:text-lg font-black text-gray-900 uppercase tracking-widest">Total</span>
                                <span className="text-2xl md:text-4xl font-black text-primary-600 tracking-tighter">₹{cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full h-14 md:h-16 bg-primary-600 hover:bg-primary-700 text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg flex items-center justify-center space-x-3 transition-all shadow-xl shadow-primary-500/20 group active:scale-[0.98]"
                        >
                            <span>Checkout</span>
                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-center text-[8px] md:text-[10px] text-gray-400 mt-4 md:mt-6 uppercase tracking-[0.2em] font-black">Secure SSL Encrypted Payment</p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Cart;
