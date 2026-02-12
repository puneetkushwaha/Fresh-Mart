import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Loader2, Calendar, DollarSign, Percent } from 'lucide-react';
import API from '../../api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        maxDiscount: '',
        minOrderAmount: '',
        expirationDate: '',
        usageLimit: 1000
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const { data } = await API.get('/coupons');
            setCoupons(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch coupons', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await API.delete(`/coupons/${id}`);
            setCoupons(prev => prev.filter(c => c._id !== id));
        } catch (error) {
            alert('Failed to delete coupon');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const { data } = await API.post('/coupons', formData);
            setCoupons([...coupons, data]);
            setShowModal(false);
            setFormData({
                code: '',
                discountType: 'PERCENTAGE',
                discountValue: '',
                maxDiscount: '',
                minOrderAmount: '',
                expirationDate: '',
                usageLimit: 1000
            });
            alert('Coupon Created!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create coupon');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Coupon Management</h1>
                    <p className="text-gray-500 mt-1">Create and manage discount codes.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create Coupon</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin w-10 h-10 text-primary-600" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon) => (
                        <div key={coupon._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all relative group">
                            <button
                                onClick={() => handleDelete(coupon._id)}
                                className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                                    <Tag className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-wider">{coupon.code}</h3>
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${new Date() > new Date(coupon.expirationDate) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {new Date() > new Date(coupon.expirationDate) ? 'Expired' : 'Active'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Discount</span>
                                    <span className="font-bold text-gray-900 flex items-center gap-1">
                                        {coupon.discountType === 'PERCENTAGE' ? <Percent className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                                        {coupon.discountValue}{coupon.discountType === 'PERCENTAGE' ? '%' : ' OFF'}
                                    </span>
                                </div>
                                {coupon.maxDiscount > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Max Discount</span>
                                        <span className="font-bold text-gray-900">₹{coupon.maxDiscount}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Min Order</span>
                                    <span className="font-bold text-gray-900">₹{coupon.minOrderAmount}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Expires</span>
                                    <span className="font-bold text-gray-900">{new Date(coupon.expirationDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {coupons.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-[2rem]">
                            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold">No coupons found. Create one to get started!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-black text-gray-900 mb-6">Create New Coupon</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Coupon Code</label>
                                    <input required type="text" placeholder="e.g. WELCOME50" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-bold uppercase"
                                        value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-medium"
                                            value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                        >
                                            <option value="PERCENTAGE">Percentage (%)</option>
                                            <option value="FIXED">Fixed Amount (₹)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Value</label>
                                        <input required type="number" placeholder="e.g. 10" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-bold"
                                            value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Min Order (₹)</label>
                                        <input type="number" placeholder="0" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-bold"
                                            value={formData.minOrderAmount} onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Max Discount (₹)</label>
                                        <input type="number" placeholder="Optional" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-bold"
                                            disabled={formData.discountType === 'FIXED'}
                                            value={formData.maxDiscount} onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Expiration Date</label>
                                    <input required type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-medium"
                                        value={formData.expirationDate} onChange={e => setFormData({ ...formData, expirationDate: e.target.value })}
                                    />
                                </div>
                                <button type="submit" disabled={creating} className="w-full py-4 bg-gray-900 text-white rounded-xl font-black text-lg hover:bg-black transition-all shadow-lg mt-4 disabled:opacity-70">
                                    {creating ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Create Coupon'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Coupons;
