import React from 'react';
import { Tag, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Offers = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <Tag className="w-8 h-8 text-primary-600" />
                    Special Offers
                </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Limited Time</span>
                        <h3 className="text-4xl font-black mb-4">50% OFF</h3>
                        <p className="text-primary-100 mb-8 max-w-xs">On your first order of organic vegetables via the app.</p>
                        <Link to="/shop" className="bg-white text-primary-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors inline-block">
                            Shop Now
                        </Link>
                    </div>
                    {/* Abstract circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Flash Sale</span>
                        <h3 className="text-4xl font-black mb-4">Buy 1 Get 1</h3>
                        <p className="text-gray-300 mb-8 max-w-xs">On all bakery items every weekend. Don't miss out!</p>
                        <Link to="/shop" className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors inline-block">
                            Browse Bakery
                        </Link>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                </div>
            </div>

            <div className="mt-16 text-center bg-gray-50 rounded-[2rem] p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">More offers coming soon!</h2>
                <p className="text-gray-500">Subscribe to our newsletter to stay updated on the latest deals.</p>
            </div>
        </div>
    );
};

export default Offers;
