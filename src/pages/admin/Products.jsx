import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Filter, MoreVertical, Download, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/apiClient';

const AdminProducts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [adminProducts, setAdminProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
    const [currentProduct, setCurrentProduct] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        discount: 0,
        quantity: '',
        unit: '',
        image: '',
        description: '',
        isFeatured: false
    });

    const fetchCategories = async () => {
        try {
            const { data } = await API.get('/categories');
            setCategories(data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await API.get('/products');
            setAdminProducts(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleOpenModal = (type, product = null) => {
        setModalType(type);
        if (type === 'edit' && product) {
            setCurrentProduct(product);
            setFormData({
                name: product.name,
                category: product.category,
                price: product.price,
                discount: product.discount || 0,
                quantity: product.quantity,
                unit: product.unit,
                image: product.image,
                description: product.description,
                isFeatured: product.isFeatured || false
            });
        } else {
            setCurrentProduct(null);
            setFormData({
                name: '',
                category: '',
                price: '',
                discount: 0,
                quantity: '',
                unit: '',
                image: '',
                description: '',
                isFeatured: false
            });
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (modalType === 'add') {
                await API.post('/products', formData);
            } else {
                await API.put(`/products/${currentProduct._id}`, formData);
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save product');
        } finally {
            setSubmitting(false);
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`/products/${id}`);
                fetchProducts();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    const filteredProducts = adminProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Product Management</h1>
                    <p className="text-gray-500 mt-1">Manage your inventory, prices and product data.</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => handleOpenModal('add')}
                        className="flex items-center space-x-2 px-6 py-3.5 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-gray-200"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Product</span>
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by product name, SKU or ID..."
                        className="w-full bg-gray-50 pl-12 pr-4 py-3.5 rounded-xl border-2 border-transparent focus:border-primary-500 focus:bg-white outline-none transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex space-x-3 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none flex items-center justify-center space-x-2 px-6 py-3.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                    </button>
                    <button className="flex-1 lg:flex-none flex items-center justify-center space-x-2 px-6 py-3.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">Product</th>
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">Category</th>
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">Price</th>
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">Stock</th>
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredProducts.map((product) => (
                                <tr key={product._id} className="group hover:bg-gray-50/30 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 line-clamp-1">{product.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {product._id.substring(18)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-black text-lg text-gray-900">₹{product.price}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-1 w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${product.quantity < 20 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${Math.min(product.quantity, 100)}%` }}></div>
                                            </div>
                                            <span className={`text-xs font-black ${product.quantity < 20 ? 'text-orange-600' : 'text-gray-900'}`}>{product.quantity}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => handleOpenModal('edit', product)}
                                                className="p-2.5 bg-gray-50 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(product._id)}
                                                className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-8 py-8 bg-gray-50/50 flex items-center justify-between border-t border-gray-50">
                    <p className="text-sm font-bold text-gray-400">Total Products: <span className="text-gray-900">{filteredProducts.length}</span></p>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm font-bold text-gray-400 disabled:opacity-50">Previous</button>
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-900 shadow-sm">Next</button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                <h2 className="text-xl font-black text-gray-900">
                                    {modalType === 'add' ? 'Add New Product' : 'Edit Product'}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Product Name</label>
                                        <input
                                            required
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all outline-none font-bold text-gray-900"
                                            placeholder="e.g. Organic Bananas"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Category</label>
                                        <select
                                            required
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all outline-none font-bold text-gray-900 appearance-none"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Price (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all outline-none font-bold text-gray-900"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Discount (%)</label>
                                        <input
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all outline-none font-bold text-gray-900"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Stock Quantity</label>
                                        <input
                                            required
                                            type="number"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all outline-none font-bold text-gray-900"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Unit</label>
                                        <input
                                            required
                                            name="unit"
                                            value={formData.unit}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all outline-none font-bold text-gray-900"
                                            placeholder="e.g. 1kg, 500g, 12 pcs"
                                        />
                                    </div>

                                    <div className="col-span-full space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Image URL</label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                                                <ImageIcon className="w-5 h-5" />
                                            </div>
                                            <input
                                                required
                                                name="image"
                                                value={formData.image}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 pl-14 pr-5 py-4 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all outline-none font-bold text-gray-900"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Description</label>
                                        <textarea
                                            required
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                            className="w-full bg-gray-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all outline-none font-bold text-gray-900 resize-none"
                                            placeholder="Tell us about this product..."
                                        />
                                    </div>

                                    <div className="col-span-full">
                                        <label className="flex items-center space-x-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    name="isFeatured"
                                                    checked={formData.isFeatured}
                                                    onChange={handleInputChange}
                                                    className="sr-only"
                                                />
                                                <div className={`w-12 h-6 rounded-full transition-colors ${formData.isFeatured ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isFeatured ? 'translate-x-6' : ''}`}></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-primary-600 transition-colors">Featured Product</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-10 flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-8 py-4 bg-gray-50 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all border border-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-sm hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <span>{modalType === 'add' ? 'Create Product' : 'Save Changes'}</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProducts;
