import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingCart, Plus, Minus, Heart, Share2, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import API from '../../api/apiClient';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, reviewsRes] = await Promise.all([
                    API.get(`/products/${id}`),
                    API.get(`/reviews/product/${id}`)
                ]);
                setProduct(productRes.data);
                setSelectedImage(productRes.data.image);
                setReviews(reviewsRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        </div>
    );

    if (!product) return <div>Product not found</div>;

    const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);

    const handleAddToCart = () => {
        setAdding(true);
        for (let i = 0; i < quantity; i++) addToCart(product);
        setTimeout(() => setAdding(false), 1000);
    };

    const handleBuyNow = () => {
        for (let i = 0; i < quantity; i++) addToCart(product);
        navigate('/cart');
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: product.name,
                    text: `Check out this ${product.name} on Martify!`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mb-10 group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Back to Shop</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                {/* Image Gallery */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-square bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl"
                    >
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="w-full h-full object-cover p-12"
                        />
                    </motion.div>
                    <div className="grid grid-cols-4 gap-4">
                        {[product.image, product.image, product.image, product.image].map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(img)}
                                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all p-2 bg-white ${selectedImage === img ? 'border-primary-500 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-8">
                    <div>
                        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                            {product.category}
                        </span>
                        <div className="flex justify-between items-start">
                            <h1 className="text-4xl font-black text-gray-900 leading-tight">{product.name}</h1>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className={`p-3 rounded-2xl transition-all border border-gray-100 ${isInWishlist(product._id) ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                                >
                                    <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-3 bg-gray-50 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-2xl transition-all border border-gray-100"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-6">
                            <div className="flex items-center bg-yellow-400/10 px-3 py-1.5 rounded-xl border border-yellow-400/20">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="ml-1.5 font-bold text-gray-900">{product.rating}</span>
                            </div>
                            <span className="text-gray-400">|</span>
                            <span className="text-sm font-semibold text-gray-500 underline cursor-pointer hover:text-primary-600 transition-colors">
                                {reviews.length} customer reviews
                            </span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div className="flex items-baseline space-x-3 mb-6">
                            <span className="text-5xl font-black text-gray-900">₹{discountedPrice}</span>
                            {product.discount > 0 && (
                                <span className="text-xl font-bold text-gray-300 line-through">₹{product.price}</span>
                            )}
                        </div>
                        <p className="text-gray-500 leading-relaxed font-light text-lg">
                            {product.description || "Our premium products are sourced from sustainable sources and guaranteed for freshness and quality. Perfect for your daily needs."}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Quantity</h4>
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 bg-white rounded-xl shadow-sm text-gray-600 hover:text-primary-600 transition-all flex items-center justify-center active:scale-90"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="w-16 text-center font-black text-xl text-gray-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 bg-white rounded-xl shadow-sm text-gray-600 hover:text-primary-600 transition-all flex items-center justify-center active:scale-90"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <span className="text-sm font-bold text-gray-400">In Stock: {product.quantity} units</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 text-center items-center">
                        <button
                            onClick={handleAddToCart}
                            disabled={adding}
                            className={`flex-1 w-full sm:w-auto h-16 rounded-[2rem] font-black text-lg flex items-center justify-center space-x-3 transition-all shadow-xl active:scale-[0.98] group ${adding ? 'bg-green-500 text-white shadow-green-200' : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200'}`}
                        >
                            {adding ? (
                                <>
                                    <ShieldCheck className="w-6 h-6" />
                                    <span>Added!</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span>Add to Cart</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 w-full sm:w-auto h-16 bg-gray-900 hover:bg-black text-white rounded-[2rem] font-black text-lg transition-all shadow-xl shadow-gray-200 active:scale-[0.98]"
                        >
                            Buy Now
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
                        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-3xl group hover:bg-primary-50 transition-all cursor-default">
                            <Truck className="w-6 h-6 text-primary-500 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black text-gray-900 text-center">Fast Delivery</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-3xl group hover:bg-primary-50 transition-all cursor-default">
                            <ShieldCheck className="w-6 h-6 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black text-gray-900 text-center">100% Quality</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-3xl group hover:bg-primary-50 transition-all cursor-default">
                            <RefreshCw className="w-6 h-6 text-yellow-500 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black text-gray-900 text-center">Easy Returns</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-16 border-t border-gray-100">
                <h2 className="text-3xl font-black text-gray-900 mb-12">Customer Reviews ({reviews.length})</h2>
                {reviews.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        {reviews.map((review, i) => (
                            <div key={i} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                                        {review.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{review.user?.name || 'Anonymous User'}</h4>
                                        <div className="flex text-yellow-400 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed">"{review.comment}"</p>
                                <p className="text-xs text-gray-400 mt-4 font-medium">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-gray-100 border-dashed">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Star className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                        <p className="text-gray-500">Be the first to review this product!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;

