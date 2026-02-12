import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Calendar, Tag, ChevronRight, Loader2 } from 'lucide-react';
import API from '../../api/apiClient';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/orders/myorders');
                setOrders(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load orders. Please try again later.');
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Fetching your orders...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">My Orders</h1>
                    <p className="text-gray-500 mt-1">Track and manage your recent purchases</p>
                </div>
                <div className="bg-primary-50 px-4 py-2 rounded-2xl flex items-center space-x-2 border border-primary-100">
                    <Package className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-bold text-primary-700">{orders.length} Total Orders</span>
                </div>
            </div>

            {error && (
                <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] text-red-600 text-center mb-8">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <ShoppingBag className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">No Orders Yet</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">Looks like you haven't placed any orders. Start shopping for fresh groceries today!</p>
                    <button
                        onClick={() => window.location.href = '/shop'}
                        className="mt-8 px-8 py-3.5 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-primary-100 transition-all duration-300">
                            <div className="px-8 py-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                                        <Tag className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Order ID</p>
                                        <p className="text-sm font-black text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-8">
                                    <div className="hidden sm:block text-right">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Date</p>
                                        <div className="flex items-center justify-end text-sm font-bold text-gray-700">
                                            <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                                        <p className="text-lg font-black text-primary-600">₹{order.totalPrice.toFixed(2)}</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full text-xs font-black border uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50/30">
                                <div className="flex items-center overflow-x-auto gap-4 pb-2 scrollbar-hide">
                                    {order.orderItems.map((item, idx) => (
                                        <div key={idx} className="flex-shrink-0 flex items-center space-x-3 bg-white p-3 rounded-2xl border border-gray-100">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded-xl"
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                            />
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 line-clamp-1 w-24">{item.name}</p>
                                                <p className="text-[10px] text-gray-500 font-medium">Qty: {item.qty}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.orderItems.length > 3 && (
                                        <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 font-bold text-xs ring-2 ring-white">
                                            +{order.orderItems.length - 3}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6 flex justify-between items-center">
                                    <div>
                                        {order.status === 'Delivered' && (
                                            <button
                                                onClick={() => window.location.href = `/product/${order.orderItems[0].product}`}
                                                className="px-6 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
                                            >
                                                Review Items
                                            </button>
                                        )}
                                    </div>
                                    <button className="flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 group transition-colors">
                                        <span>View Details</span>
                                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
