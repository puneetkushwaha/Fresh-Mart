import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Loader2, X, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/apiClient';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', icon: 'Package' });

    const fetchCategories = async () => {
        try {
            const { data } = await API.get('/categories');
            setCategories(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await API.post('/categories', newCategory);
            setIsModalOpen(false);
            setNewCategory({ name: '', icon: 'Package' });
            fetchCategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create category');
        } finally {
            setSubmitting(false);
        }
    };

    const deleteCategory = async (id) => {
        if (window.confirm('Are you sure? This will not delete products in this category, but they will become uncategorized.')) {
            try {
                await API.delete(`/categories/${id}`);
                fetchCategories();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete category');
            }
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Category Management</h1>
                    <p className="text-gray-500 mt-1">Organize your products into logical groups.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 px-6 py-3.5 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-gray-200"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Category</span>
                </button>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full bg-gray-50 pl-12 pr-4 py-3.5 rounded-xl border-2 border-transparent focus:border-primary-500 focus:bg-white outline-none transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto" />
                    </div>
                ) : filteredCategories.map((category) => (
                    <motion.div
                        layout
                        key={category._id}
                        className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                                <Tag className="w-6 h-6" />
                            </div>
                            <button
                                onClick={() => deleteCategory(category._id)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-1">{category.name}</h3>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                            ID: {category._id.substring(18)}
                        </p>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
                            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                <h2 className="text-xl font-black text-gray-900">New Category</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Category Name</label>
                                        <input
                                            required
                                            value={newCategory.name}
                                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                            className="w-full bg-gray-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all outline-none font-bold text-gray-900"
                                            placeholder="e.g. Beverages"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-sm hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 disabled:opacity-50 flex items-center justify-center space-x-2"
                                    >
                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Create Category</span>}
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

export default AdminCategories;
