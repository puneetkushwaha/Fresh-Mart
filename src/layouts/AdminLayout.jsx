import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Layers,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Tag
} from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Package, label: 'Products', path: '/admin/products' },
        { icon: Layers, label: 'Categories', path: '/admin/categories' },
        { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
        { icon: Users, label: 'Customers', path: '/admin/customers' },
        { icon: Tag, label: 'Coupons', path: '/admin/coupons' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-gray-100 transition-all duration-300 z-50 fixed lg:relative flex flex-col h-screen ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-50">
                    <div className={`font-black text-2xl bg-gradient-to-r from-primary-600 to-green-500 bg-clip-text text-transparent truncate transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                        Martify Admin
                    </div>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                        {isSidebarOpen ? <X className="lg:hidden w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                <nav className="p-4 space-y-2 flex-1 overflow-y-auto mt-4 custom-scrollbar">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all group ${location.pathname === item.path ? 'bg-primary-600 text-white shadow-xl shadow-primary-100' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <item.icon className="w-6 h-6 flex-shrink-0" />
                            <span className={`font-bold transition-opacity whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-50">
                    <button
                        onClick={() => {
                            localStorage.removeItem('userInfo');
                            window.location.href = '/login';
                        }}
                        className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold group`}
                    >
                        <LogOut className="w-6 h-6 flex-shrink-0" />
                        <span className={`transition-opacity whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>Logout Admin</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="relative group max-w-md w-full hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-600 transition-colors" />
                        <input type="text" placeholder="Search analytics..." className="w-full bg-gray-50 pl-12 pr-4 py-2.5 rounded-xl border border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm" />
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="relative p-2.5 bg-gray-50 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center space-x-3 pl-6 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-gray-900">Admin User</p>
                                <p className="text-[10px] text-primary-600 font-black uppercase tracking-widest">Super Agent</p>
                            </div>
                            <div className="w-10 h-10 bg-primary-100 rounded-2xl border-2 border-primary-200 overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Admin+User&background=22c55e&color=fff" alt="Admin" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
