import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowLeft, Heart } from 'lucide-react';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Your wishlist is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md text-center">
                    Looks like you haven't saved any items yet. Browse our products and find something you love!
                </p>
                <Link
                    to="/shop"
                    className="px-8 py-4 bg-primary-600 text-white rounded-[2rem] font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-black text-gray-900 mb-12 flex items-center gap-4">
                <Heart className="w-10 h-10 text-red-500 fill-current" />
                My Wishlist
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {wishlist.map((product) => (
                    <div key={product._id} className="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all group relative">
                        <button
                            onClick={() => removeFromWishlist(product._id)}
                            className="absolute top-6 right-6 p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors z-10"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="aspect-square bg-gray-50 rounded-[2rem] mb-6 overflow-hidden relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">{product.category}</p>
                                <Link to={`/product/${product._id}`}>
                                    <h3 className="text-lg font-black text-gray-900 line-clamp-1 hover:text-primary-600 transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>
                            </div>

                            <div className="flex items-end justify-between">
                                <span className="text-2xl font-black text-gray-900">
                                    ₹{product.price - (product.price * (product.discount || 0) / 100)}
                                </span>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 active:scale-95"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
