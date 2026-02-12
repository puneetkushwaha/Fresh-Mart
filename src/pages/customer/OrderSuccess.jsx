import React from 'react';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white p-20 rounded-[4rem] border border-gray-100 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-100 rounded-full blur-[80px] opacity-40" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-green-100 rounded-full blur-[80px] opacity-40" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-32 h-32 bg-primary-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary-200 mb-10 rotate-12">
                        <CheckCircle2 className="w-16 h-16 text-white" />
                    </div>

                    <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Order Placed!</h1>
                    <p className="text-xl text-gray-500 mb-12 max-w-md mx-auto leading-relaxed">
                        Your fresh groceries are being prepared. You'll receive an update once they are out for delivery.
                    </p>

                    <div className="bg-gray-50 w-full p-8 rounded-[2.5rem] mb-12 border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Order Number</span>
                            <span className="text-gray-900 font-black">#FC-982341</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Estimated Delivery</span>
                            <span className="text-primary-600 font-black">35 Minutes</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button
                            onClick={() => navigate('/shop')}
                            className="flex-1 h-16 bg-primary-600 hover:bg-primary-700 text-white rounded-[1.5rem] font-black flex items-center justify-center space-x-3 transition-all shadow-xl shadow-primary-200 group"
                        >
                            <ShoppingBag className="w-6 h-6" />
                            <span>Continue Shopping</span>
                        </button>
                        <button
                            onClick={() => navigate('/orders')}
                            className="flex-1 h-16 bg-gray-900 hover:bg-black text-white rounded-[1.5rem] font-black flex items-center justify-center space-x-3 transition-all shadow-xl shadow-gray-200"
                        >
                            <span>Track Order</span>
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
