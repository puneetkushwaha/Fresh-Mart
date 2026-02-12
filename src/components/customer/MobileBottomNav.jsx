import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems } = useCart();

    const cartCount = cartItems.reduce((acc, item) => acc + item.cartQuantity, 0);

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: ShoppingBag, label: 'Shop', path: '/shop' },
        { icon: ShoppingCart, label: 'Cart', path: '/cart', count: cartCount },
        { icon: Heart, label: 'Wishlist', path: '/wishlist' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around px-2 py-3 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="relative flex flex-col items-center justify-center w-16 group"
                    >
                        <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary-50 text-primary-600 scale-110' : 'text-gray-400 group-hover:text-primary-500'}`}>
                            <item.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                        </div>

                        {item.count > 0 && (
                            <span className="absolute top-1 right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                {item.count}
                            </span>
                        )}

                        {isActive && (
                            <motion.div
                                layoutId="bottomNavTab"
                                className="absolute -bottom-1 w-1 h-1 bg-primary-600 rounded-full"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}

                        <span className={`text-[10px] font-black mt-1 uppercase tracking-tight transition-colors duration-300 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'}`}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

export default MobileBottomNav;
