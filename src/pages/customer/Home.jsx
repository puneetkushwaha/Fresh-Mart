import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, ShoppingBag, Zap, ShieldCheck, Clock, Loader2, Play, Users, Mail, Bell, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/apiClient';
import { Link, useNavigate } from 'react-router-dom';
import ReviewPopup from '../../components/customer/ReviewPopup';

const Home = () => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [liveProducts, setLiveProducts] = useState([]);
    const [liveCategories, setLiveCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [catIndex, setCatIndex] = useState(0);
    const [bestSellerIndex, setBestSellerIndex] = useState(0);
    const [catItemsPerPage, setCatItemsPerPage] = useState(6);
    const [bestSellerPerPage, setBestSellerPerPage] = useState(8);
    const [dynamicReviews, setDynamicReviews] = useState([]);
    const [allReviews, setAllReviews] = useState([]);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [pendingOrder, setPendingOrder] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes, reviewRes] = await Promise.all([
                    API.get('/products'),
                    API.get('/categories'),
                    API.get('/reviews/featured')
                ]);
                setLiveProducts(prodRes.data);
                setLiveCategories(catRes.data);
                setDynamicReviews(reviewRes.data);
                setLoading(false);

                // Check for pending reviews if user is logged in
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    const pendingRes = await API.get('/reviews/pending');
                    if (pendingRes.data) {
                        setPendingOrder(pendingRes.data);
                    }
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();

        // Responsive items per page
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setCatItemsPerPage(2);
                setBestSellerPerPage(1);
            } else if (window.innerWidth < 1024) {
                setCatItemsPerPage(3);
                setBestSellerPerPage(2);
            } else if (window.innerWidth < 1280) {
                setCatItemsPerPage(4);
                setBestSellerPerPage(3);
            } else {
                setCatItemsPerPage(6);
                setBestSellerPerPage(4);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const featuredProducts = liveProducts.filter(p => p.isFeatured);

    const nextCategories = () => {
        if (catIndex + catItemsPerPage < liveCategories.length) {
            setCatIndex(catIndex + 1);
        }
    };

    const prevCategories = () => {
        if (catIndex > 0) {
            setCatIndex(catIndex - 1);
        }
    };

    const nextBestSellers = () => {
        if (bestSellerIndex + bestSellerPerPage < featuredProducts.length) {
            setBestSellerIndex(bestSellerIndex + 1);
        }
    };

    const prevBestSellers = () => {
        if (bestSellerIndex > 0) {
            setBestSellerIndex(bestSellerIndex - 1);
        }
    };

    const handleViewAllReviews = async () => {
        if (showAllReviews) {
            setShowAllReviews(false);
            return;
        }

        if (allReviews.length === 0) {
            setLoadingReviews(true);
            try {
                const { data } = await API.get('/reviews');
                setAllReviews(data);
            } catch (err) {
                console.error('Failed to fetch all reviews', err);
            } finally {
                setLoadingReviews(false);
            }
        }
        setShowAllReviews(true);
    };


    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative min-h-[580px] flex items-center overflow-hidden bg-gray-900">
                {/* Visual Elements */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop"
                        alt="Grocery wide"
                        className="w-full h-full object-cover opacity-40 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-gray-900/80 to-transparent" />
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <span className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 font-black text-xs tracking-[0.2em] uppercase mb-8 backdrop-blur-md">
                                <Zap className="w-4 h-4 mr-2" />
                                Instant Delivery in 30 Mins
                            </span>
                            <h1 className="text-6xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                                Freshness <br />
                                <span className="text-primary-500 italic">Delivered.</span>
                            </h1>
                            <p className="text-xl text-gray-400 mb-12 leading-relaxed font-medium max-w-lg">
                                Experience the finest organic produce and everyday essentials sourced directly from farms to your table.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <button
                                    onClick={() => navigate('/shop')}
                                    className="px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-[2rem] font-black text-lg flex items-center justify-center space-x-3 transition-all shadow-2xl shadow-primary-500/30 hover:scale-105 active:scale-95"
                                >
                                    <span>Start Shopping</span>
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                                <button className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-black text-lg border-2 border-white/10 backdrop-blur-xl transition-all flex items-center justify-center space-x-3 group">
                                    <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
                                    <span>How it Works</span>
                                </button>
                            </div>

                            <div className="mt-16 flex items-center space-x-8">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-800">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-4 border-gray-900 bg-primary-600 flex items-center justify-center text-white font-black text-xs">
                                        5k+
                                    </div>
                                </div>
                                <div>
                                    <div className="flex text-yellow-400 mb-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Trust by 5000+ Happy Customers</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="hidden lg:block relative"
                        >
                            <div className="absolute inset-0 bg-primary-600/30 blur-[120px] rounded-full animate-pulse" />
                            <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[4rem] shadow-2xl">
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500">
                                                <Gift className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-white font-black">First Order Offer</p>
                                                <p className="text-gray-400 text-sm italic">Use code: FRESH25</p>
                                            </div>
                                        </div>
                                        <span className="text-orange-500 font-black text-xl">25% OFF</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center">
                                            <p className="text-primary-500 text-3xl font-black mb-1">100%</p>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Organic</p>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center">
                                            <p className="text-primary-500 text-3xl font-black mb-1">24/7</p>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Support</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <span className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Our Departments</span>
                        <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Shop by Category</h2>
                        <p className="text-gray-500 text-lg">Explore our curated selection of fresh goods from top local producers.</p>
                    </div>
                    <button onClick={() => navigate('/shop')} className="inline-flex items-center space-x-3 text-primary-600 font-black hover:text-primary-700 transition-colors group px-6 py-3 bg-primary-50 rounded-2xl">
                        <span>Explore All</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="relative group">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevCategories}
                        disabled={catIndex === 0}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center transition-all ${catIndex === 0 ? 'opacity-0 cursor-default' : 'hover:bg-primary-600 hover:text-white group-hover:translate-x-0'}`}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={nextCategories}
                        disabled={catIndex + catItemsPerPage >= liveCategories.length}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center transition-all ${catIndex + catItemsPerPage >= liveCategories.length ? 'opacity-0 cursor-default' : 'hover:bg-primary-600 hover:text-white group-hover:translate-x-0'}`}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="overflow-hidden px-2">
                        <motion.div
                            className="flex gap-8"
                            animate={{ x: `-${catIndex * (100 / catItemsPerPage)}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {liveCategories.map((cat, i) => (
                                <motion.div
                                    key={cat._id}
                                    className="min-w-[calc(100%/2-1.5rem)] md:min-w-[calc(100%/3-2rem)] lg:min-w-[calc(100%/6-1.5rem)] group"
                                    whileHover={{ y: -10 }}
                                >
                                    <Link to="/shop">
                                        <div className="aspect-[4/5] bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center p-8 group-hover:shadow-2xl group-hover:border-primary-100 transition-all duration-500 text-center">
                                            <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                                <ShoppingBag className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-lg font-black text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight line-clamp-1">{cat.name}</h3>
                                            <p className="text-xs text-gray-400 font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Browse</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Banner */}
            <section className="pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-900 rounded-[4rem] p-12 md:p-24 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/10 blur-[150px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-1/2 h-full bg-green-600/5 blur-[150px] rounded-full" />

                    <div className="relative grid md:grid-cols-3 gap-20">
                        {[
                            { icon: Zap, label: 'Fast Delivery', desc: 'Get your goods in 30 minutes', color: 'primary' },
                            { icon: ShieldCheck, label: 'Quality Assured', desc: 'Sourced from local farms', color: 'green' },
                            { icon: Clock, label: '24/7 Support', desc: 'Always here to help you', color: 'yellow' }
                        ].map((feature, i) => (
                            <div key={i} className="flex flex-col items-center text-center space-y-8">
                                <div className={`w-24 h-24 bg-${feature.color}-600/20 rounded-[2rem] flex items-center justify-center border border-${feature.color}-500/20`}>
                                    <feature.icon className={`w-12 h-12 text-${feature.color}-500`} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black text-white tracking-tight">{feature.label}</h3>
                                    <p className="text-gray-400 leading-relaxed font-medium text-lg">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="pb-32 bg-gray-50/50 py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
                        <div className="max-w-xl">
                            <span className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Trending Now</span>
                            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Best Sellers</h2>
                            <p className="text-gray-500 text-lg">Our most loved products this week, picked for premium quality.</p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={prevBestSellers}
                                disabled={bestSellerIndex === 0}
                                className={`w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center transition-all ${bestSellerIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-primary-600 hover:text-white hover:border-primary-600 shadow-lg'}`}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextBestSellers}
                                disabled={bestSellerIndex + bestSellerPerPage >= featuredProducts.length}
                                className={`w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center transition-all ${bestSellerIndex + bestSellerPerPage >= featuredProducts.length ? 'opacity-30 cursor-not-allowed' : 'hover:bg-primary-600 hover:text-white hover:border-primary-600 shadow-lg'}`}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-hidden relative pb-8">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
                            </div>
                        ) : (
                            <motion.div
                                className="flex gap-10"
                                animate={{ x: `-${bestSellerIndex * (100 / (window.innerWidth > 1280 ? 4 : window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1))}%` }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                {featuredProducts.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        className="min-w-[calc(100%-0rem)] sm:min-w-[calc(50%-1.25rem)] lg:min-w-[calc(33.333%-1.7rem)] xl:min-w-[calc(25%-1.9rem)] group"
                                        whileHover={{ y: -12 }}
                                    >
                                        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-primary-100 transition-all duration-700 h-full">
                                            <div className="relative aspect-[1/1] overflow-hidden bg-gray-50">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                />
                                                {product.discount > 0 && (
                                                    <div className="absolute top-6 left-6 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-xl shadow-red-500/30">
                                                        Save {product.discount}%
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-10">
                                                <span className="text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">{product.category}</span>
                                                <Link to={`/product/${product._id}`}>
                                                    <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-primary-600 transition-colors line-clamp-1 tracking-tight">{product.name}</h3>
                                                </Link>
                                                <div className="flex items-center space-x-2 mb-8">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />)}
                                                        <span className="text-xs font-black text-gray-700 ml-2">{product.rating}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                                    <div>
                                                        <span className="text-3xl font-black text-gray-900">₹{product.price - (product.price * product.discount / 100)}</span>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{product.unit}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => addToCart(product)}
                                                        className="w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-primary-500/20 active:scale-90"
                                                    >
                                                        <ShoppingBag className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 bg-white px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center mb-24 max-w-2xl mx-auto">
                        <span className="text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block underline decoration-4 underline-offset-8">Community Voice</span>
                        <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">What Our Customers Say</h2>
                        <p className="text-gray-500 text-xl font-medium">Join thousands of happy families who trust Martify for their daily meals.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative z-10">
                        {((showAllReviews ? allReviews : dynamicReviews).length > 0 ? (showAllReviews ? allReviews : dynamicReviews) : [
                            { name: "Priya Sharma", rating: 5, comment: "The quality of organic vegetables I get here is unmatched. It's my go-to for healthy meal prep.", user: { name: "Priya Sharma" } },
                            { name: "Rahul Mehra", rating: 5, comment: "Fastest delivery in town! Super convenient for busy workdays.", user: { name: "Rahul Mehra" } },
                            { name: "Ananya Iyer", rating: 5, comment: "Love the packaging and the freshness. The mobile app makes it so easy.", user: { name: "Ananya Iyer" } }
                        ]).map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 hover:bg-white hover:shadow-2xl hover:border-primary-100 transition-all duration-500 group"
                            >
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 font-black text-xl">
                                        {(t.user?.name || t.name || "?").charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-gray-900 tracking-tight">{t.user?.name || t.name}</h4>
                                        <p className="text-primary-600 text-[10px] font-black uppercase tracking-widest">Verified Buyer</p>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400 mb-6">
                                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-gray-600 leading-relaxed font-medium italic">"{t.comment || t.content}"</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <button
                            onClick={handleViewAllReviews}
                            disabled={loadingReviews}
                            className="inline-flex items-center space-x-3 px-8 py-4 bg-white border-2 border-primary-100 text-primary-600 rounded-[2rem] font-black hover:bg-primary-50 transition-all shadow-lg shadow-primary-50 active:scale-95 disabled:opacity-50"
                        >
                            {loadingReviews ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>{showAllReviews ? 'Show Featured Only' : 'View All Community Reviews'}</span>
                                    <ArrowRight className={`w-5 h-5 transition-transform ${showAllReviews ? 'rotate-90' : ''}`} />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Background Decorative Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-50 rounded-full blur-[120px] -z-10 opacity-30" />
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="pb-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-primary-600 rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-2xl shadow-primary-500/40">
                        {/* Decorative Patterns */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />

                        <div className="relative grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <span className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white font-black text-[10px] tracking-widest uppercase mb-8">
                                    <Bell className="w-4 h-4 mr-2" />
                                    Don't Miss Out
                                </span>
                                <h2 className="text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                                    Subscribe for Exclusive Deals & Tips
                                </h2>
                                <p className="text-primary-100 text-xl font-medium leading-relaxed opacity-80">
                                    Get notified about flash sales, seasonal recipes, and fresh arrivals. We promise no spam, only goodness.
                                </p>
                            </div>

                            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="relative flex-1 group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-300 w-6 h-6 group-focus-within:text-white transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="Enter your best email..."
                                            className="w-full bg-white/10 border-2 border-white/20 rounded-[2rem] py-5 pl-16 pr-8 text-white placeholder-primary-200 outline-none focus:bg-white/20 focus:border-white transition-all font-bold"
                                        />
                                    </div>
                                    <button className="bg-white text-primary-600 hover:bg-gray-100 px-10 py-5 rounded-[2rem] font-black text-lg shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-3">
                                        <span>Notify Me</span>
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-primary-200 text-xs mt-6 text-center lg:text-left font-bold tracking-wider uppercase opacity-60">
                                    By subscribing, you agree to our privacy policy.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Review Popup */}
            {pendingOrder && (
                <ReviewPopup
                    order={pendingOrder}
                    onClose={() => setPendingOrder(null)}
                />
            )}
        </div>
    );
};

// Add Send to imports from lucide-react above if not already there
const Send = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

export default Home;
