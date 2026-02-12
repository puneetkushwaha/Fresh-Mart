import React, { useState, useEffect } from 'react';
import { Search, Loader2, Eye, Clock, CheckCircle, Truck, XCircle, MoreVertical, CreditCard, User, MapPin, Calendar, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/apiClient';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [lastOrderCount, setLastOrderCount] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        fetchOrders();

        // Auto-refresh every 15 seconds
        const interval = setInterval(() => {
            fetchOrders(true); // pass true for background fetch
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const playSiren = () => {
        if (isMuted) return;
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(err => console.log('Audio play blocked by browser. Click anywhere on page to enable.'));
    };

    const fetchOrders = async (isBackground = false) => {
        try {
            const { data } = await API.get('/orders');

            // If it's a background fetch and we have more orders than before, play alert
            if (isBackground && data.length > orders.length && orders.length > 0) {
                console.log('New order detected! Playing siren...');
                playSiren();
            }

            setOrders(data);
            if (!isBackground) setLoading(false);
        } catch (err) {
            console.error(err);
            if (!isBackground) setLoading(false);
        }
    };

    const updateStatus = async (orderId, status) => {
        console.log(`Requesting status update for ${orderId} to ${status}`);
        try {
            const { data } = await API.put(`/orders/${orderId}/status`, { status });
            console.log('Update response:', data);
            fetchOrders();
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status }));
            }
        } catch (err) {
            console.error('Status update failed:', err);
            alert('Failed to update status');
        }
    };

    const handleVerifyPayment = async (order) => {
        if (!window.confirm('Are you sure you want to verify this payment? This will mark the order as PAID and PROCESSING.')) return;

        setActionLoading(true);
        try {
            // Mark as Paid
            await API.put(`/orders/${order._id}/pay`);
            // Update Status to Processing
            await API.put(`/orders/${order._id}/status`, { status: 'Processing' });

            await fetchOrders();
            setSelectedOrder(null);
            alert('Payment Verified & Order Processed!');
        } catch (err) {
            alert('Failed to verify payment');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectPayment = async (order) => {
        if (!window.confirm('Are you sure you want to REJECT this payment? This will CANCEL the order.')) return;

        setActionLoading(true);
        try {
            await API.put(`/orders/${order._id}/status`, { status: 'Cancelled' });
            await fetchOrders();
            setSelectedOrder(null);
            alert('Order Cancelled due to payment rejection.');
        } catch (err) {
            alert('Failed to cancel order');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Processing': return 'bg-blue-50 text-blue-600';
            case 'Shipped': return 'bg-orange-50 text-orange-600';
            case 'Delivered': return 'bg-green-50 text-green-600';
            case 'Cancelled': return 'bg-red-50 text-red-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    const filteredOrders = orders.filter(o =>
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Order Management</h1>
                    <p className="text-gray-500 mt-1">Monitor and fulfill customer orders.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all ${isMuted ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
                    >
                        {isMuted ? (
                            <><XCircle className="w-4 h-4" /> <span>Alerts Muted</span></>
                        ) : (
                            <><CheckCircle className="w-4 h-4" /> <span>Alerts Active</span></>
                        )}
                    </button>
                    <div className="bg-primary-50 px-4 py-2 rounded-xl text-primary-600 font-bold text-sm">
                        Total: {orders.length}
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer Name..."
                        className="w-full bg-gray-50 pl-12 pr-4 py-3.5 rounded-xl border-2 border-transparent focus:border-primary-500 focus:bg-white outline-none transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">Order ID</th>
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">Customer</th>
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">Payment</th>
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">Total</th>
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">Status</th>
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">Date</th>
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-20 text-center">
                                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order._id} className="group hover:bg-gray-50/30 transition-all">
                                    <td className="px-8 py-6">
                                        <p className="font-black text-gray-900">#{order._id.substring(18)}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="font-bold text-gray-900">{order.user?.name || 'Guest User'}</p>
                                            <p className="text-xs text-gray-400">{order.shippingAddress?.email || 'N/A'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-xs uppercase tracking-wider text-gray-700">{order.paymentMethod}</span>
                                            {order.isPaid ? (
                                                <span className="text-[10px] text-green-600 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Paid</span>
                                            ) : (
                                                <span className="text-[10px] text-red-500 font-bold">Unpaid</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-lg text-gray-900">₹{order.totalPrice.toFixed(2)}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusStyles(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-2.5 bg-gray-50 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <XCircle className="w-6 h-6 text-gray-400" />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
                                    <Truck className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Order Details</p>
                                    <h2 className="text-3xl font-black text-gray-900">Order #{selectedOrder._id.substring(18)}</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <User className="w-5 h-5" />
                                            <span className="font-bold text-sm">Customer Info</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-lg">{selectedOrder.user?.name}</p>
                                            <p className="text-gray-500 font-medium">{selectedOrder.user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <MapPin className="w-5 h-5" />
                                            <span className="font-bold text-sm">Delivery Address</span>
                                        </div>
                                        <p className="font-bold text-gray-700 leading-relaxed">
                                            {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zipCode}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className={`p-6 rounded-3xl space-y-4 border-2 ${selectedOrder.isPaid ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <CreditCard className="w-5 h-5" />
                                            <span className="font-bold text-sm">Payment Info</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-xl mb-1">{selectedOrder.paymentMethod}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedOrder.isPaid ? (
                                                    <span className="px-3 py-1 bg-green-200 text-green-800 rounded-lg text-xs font-black uppercase tracking-wider">PAID</span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-red-200 text-red-800 rounded-lg text-xs font-black uppercase tracking-wider">UNPAID</span>
                                                )}
                                                {selectedOrder.paymentResult?.id && (
                                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-black tracking-wider flex items-center gap-1">
                                                        UTR: {selectedOrder.paymentResult.id}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons for Pending UPI */}
                                    {!selectedOrder.isPaid && selectedOrder.paymentMethod === 'UPI / NetBanking' && selectedOrder.status !== 'Cancelled' && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleVerifyPayment(selectedOrder)}
                                                disabled={actionLoading}
                                                className="bg-green-600 text-white p-4 rounded-2xl font-black text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:opacity-50"
                                            >
                                                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'VERIFY & CONFIRM'}
                                            </button>
                                            <button
                                                onClick={() => handleRejectPayment(selectedOrder)}
                                                disabled={actionLoading}
                                                className="bg-red-100 text-red-600 p-4 rounded-2xl font-black text-sm hover:bg-red-200 transition-all disabled:opacity-50"
                                            >
                                                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'REJECT & CANCEL'}
                                            </button>
                                        </div>
                                    )}

                                    {/* Detailed Status Changer */}
                                    <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <Clock className="w-5 h-5" />
                                            <span className="font-bold text-sm">Update Order Status</span>
                                        </div>
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
                                            disabled={!selectedOrder.isPaid && selectedOrder.paymentMethod === 'UPI / NetBanking'}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        {!selectedOrder.isPaid && selectedOrder.paymentMethod === 'UPI / NetBanking' && (
                                            <p className="text-xs text-red-500 font-medium">Verify payment to update status.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-8">
                                <h3 className="font-black text-xl text-gray-900 mb-6">Order Items</h3>
                                <div className="space-y-4">
                                    {selectedOrder.orderItems.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                                            <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shadow-sm">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                                            </div>
                                            <p className="font-black text-gray-900">₹{item.qty * item.price}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-100">
                                    <span className="font-bold text-gray-500">Total Amount</span>
                                    <span className="font-black text-4xl text-gray-900">₹{selectedOrder.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminOrders;
