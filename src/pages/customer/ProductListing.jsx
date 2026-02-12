import React, { useState } from 'react';
import { Filter, ChevronDown, Star, ShoppingBag, LayoutGrid, List as ListIcon, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/apiClient';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductListing = () => {
    const { addToCart } = useCart();
    const [backendProducts, setBackendProducts] = useState([]);
    const [backendCategories, setBackendCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState(1000);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    API.get('/products'),
                    API.get('/categories')
                ]);
                setBackendProducts(prodRes.data);
                setBackendCategories(catRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getFilteredAndSortedProducts = () => {
        let result = backendProducts.filter(p =>
            (selectedCategory === 'All' || p.category === selectedCategory) &&
            (p.price - (p.price * (p.discount || 0) / 100) <= priceRange)
        );

        if (sortBy === 'price-low') {
            result.sort((a, b) => (a.price - (a.price * (a.discount || 0) / 100)) - (b.price - (b.price * (b.discount || 0) / 100)));
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => (b.price - (b.price * (b.discount || 0) / 100)) - (a.price - (a.price * (a.discount || 0) / 100)));
        } else if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return result;
    };

    const filteredProducts = getFilteredAndSortedProducts();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-8 border-b border-gray-100 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Online Grocery Shopping</h1>
                    <p className="text-gray-500 mt-1">Showing {filteredProducts.length} items for you</p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center bg-white rounded-xl border border-gray-200 p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative group flex-1 md:flex-none">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer w-full md:w-auto"
                        >
                            <option value="featured">Sort by: Featured</option>
                            <option value="newest">Sort by: Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="md:hidden p-2.5 bg-white border border-gray-200 rounded-xl text-gray-700"
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className={`lg:w-64 space-y-8 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <Filter className="w-5 h-5 mr-2 text-primary-600" />
                            Categories
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === 'All' ? 'bg-primary-50 text-primary-600 border border-primary-100' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                All Categories
                            </button>
                            {backendCategories.map(cat => (
                                <button
                                    key={cat._id}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.name ? 'bg-primary-50 text-primary-600 border border-primary-100' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Price Range</h3>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between mt-4 text-sm font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                            <span>₹0</span>
                            <span className="text-primary-600">Up to ₹{priceRange}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Brands</h3>
                        <div className="space-y-3">
                            {['FreshFarm', 'OrganicPlus', 'NatureWay', 'DailyBites'].map(brand => (
                                <label key={brand} className="flex items-center group cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 rounded-md border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                    <span className="ml-3 text-sm text-gray-600 font-medium group-hover:text-primary-600 transition-colors">{brand}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={selectedCategory + priceRange + viewMode}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" : "flex flex-col gap-6"}
                        >
                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                                </div>
                            ) : filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className={`bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:border-primary-100 transition-all duration-500 ${viewMode === 'list' ? 'flex items-center' : ''}`}
                                >
                                    <div className={`relative overflow-hidden bg-gray-50 ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'}`}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {product.discount > 0 && (
                                            <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                                                {product.discount}% OFF
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 flex-1">
                                        <span className="text-primary-600 text-[10px] font-bold uppercase tracking-wider mb-2 block">{product.category}</span>
                                        <Link to={`/product/${product._id}`}>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                                        </Link>
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="flex text-yellow-400">
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                <span className="text-sm font-bold text-gray-700 ml-1">{product.rating}</span>
                                            </div>
                                            <span className="text-xs text-gray-400">({product.reviews} reviews)</span>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                            <div>
                                                <span className="text-xl font-black text-gray-900">₹{product.price - (product.price * product.discount / 100)}</span>
                                                {product.discount > 0 && (
                                                    <span className="text-xs text-gray-400 line-through ml-2">₹{product.price}</span>
                                                )}
                                                <p className="text-[10px] text-gray-400 mt-0.5">{product.unit}</p>
                                            </div>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="w-11 h-11 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-primary-50 hover:scale-110 active:scale-95"
                                            >
                                                <ShoppingBag className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria</p>
                            <button
                                onClick={() => { setSelectedCategory('All'); setPriceRange(1000); }}
                                className="mt-6 text-primary-600 font-bold hover:underline"
                            >
                                Reset all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListing;
