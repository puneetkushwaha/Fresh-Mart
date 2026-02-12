import React, { useState, useEffect } from 'react';
import { Search, Loader2, User, Mail, Calendar, ShieldCheck, Shield } from 'lucide-react';
import API from '../../api/apiClient';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCustomers = async () => {
        try {
            const { data } = await API.get('/auth/users');
            setCustomers(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Customer Management</h1>
                    <p className="text-gray-500 mt-1">View and manage all registered users.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
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
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">Customer</th>
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">Role</th>
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">Email</th>
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50">Joined</th>
                                <th className="px-8 py-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-50 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredCustomers.map((customer) => (
                                <tr key={customer._id} className="group hover:bg-gray-50/30 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900">{customer.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {customer._id.substring(18)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-2">
                                            {customer.role === 'admin' ? (
                                                <div className="flex items-center space-x-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-lg">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg">
                                                    <Shield className="w-3 h-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Customer</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4 text-gray-300" />
                                            <span>{customer.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-2 text-sm font-bold text-gray-500">
                                            <Calendar className="w-4 h-4 text-gray-300" />
                                            <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ring-green-100">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomers;
