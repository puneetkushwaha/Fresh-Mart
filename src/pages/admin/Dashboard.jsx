import React from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    ShoppingBag,
    Users,
    ArrowUpRight,
    AlertTriangle,
    Package,
    ArrowDownRight,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../api/apiClient';

const AdminDashboard = () => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const fetchStats = async () => {
        try {
            const { data } = await API.get('/admin/stats');
            setData(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Revenue',
            value: `₹${data?.stats?.totalRevenue?.toLocaleString() || '0'}`,
            change: '+12.5%',
            icon: TrendingUp,
            color: 'primary',
            trend: 'up'
        },
        {
            label: 'Active Orders',
            value: data?.stats?.activeOrders?.toString() || '0',
            change: '+8.2%',
            icon: ShoppingBag,
            color: 'blue',
            trend: 'up'
        },
        {
            label: 'Total Customers',
            value: data?.stats?.totalCustomers?.toString() || '0',
            change: '+4.1%',
            icon: Users,
            color: 'purple',
            trend: 'up'
        },
        {
            label: 'Low Stock Items',
            value: data?.stats?.lowStockItems?.toString() || '0',
            change: 'Alert',
            icon: AlertTriangle,
            color: 'orange',
            trend: 'alert'
        },
    ];

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-all">Download Report</button>
                    <button className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all">Today's Sales</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-500"
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${stat.color === 'primary' ? 'bg-primary-50 text-primary-600' :
                            stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                                    'bg-orange-50 text-orange-600'
                            }`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-gray-400 mb-1">{stat.label}</p>
                        <div className="flex items-baseline justify-between">
                            <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                            <div className={`flex items-center text-xs font-black px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'text-green-600 bg-green-50' :
                                stat.trend === 'down' ? 'text-red-600 bg-red-50' :
                                    'text-orange-600 bg-orange-50'
                                }`}>
                                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : stat.trend === 'down' ? <ArrowDownRight className="w-3 h-3 mr-1" /> : null}
                                {stat.change}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="xl:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">Recent Orders</h3>
                        <Link to="/admin/orders" className="text-primary-600 font-bold text-sm hover:underline">View All Orders</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="pb-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Order ID</th>
                                    <th className="pb-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Customer</th>
                                    <th className="pb-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Amount</th>
                                    <th className="pb-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data?.recentOrders?.map((order, i) => (
                                    <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-6 font-bold text-gray-900">#{order._id.substring(18)}</td>
                                        <td className="py-6 font-bold text-gray-700">{order.user?.name || 'Guest'}</td>
                                        <td className="py-6 font-black text-gray-900">₹{order.totalPrice.toFixed(2)}</td>
                                        <td className="py-6">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Highlight */}
                <div className="xl:col-span-1 space-y-8">
                    <div className="bg-orange-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-orange-200">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <AlertTriangle className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold">Stock Alerts</h3>
                        </div>
                        <p className="font-medium opacity-80 mb-10 leading-relaxed">
                            There are {data?.stats?.lowStockItems || 0} items currently below reaching critical stock level. Restock soon to avoid lost sales.
                        </p>
                        <Link to="/admin/products" className="w-full py-4 bg-white text-orange-600 rounded-2xl font-black text-sm flex items-center justify-center group">
                            <span>Open Inventory</span>
                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-6 uppercase tracking-widest">New Customers</h3>
                        <div className="space-y-6">
                            {data?.newCustomers?.map((customer, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 capitalize font-black text-lg">
                                            {customer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{customer.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Joined {new Date(customer.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <Link to="/admin/customers" className="text-gray-300 hover:text-primary-600"><ChevronRight className="w-5 h-5" /></Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
