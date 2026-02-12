import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/customer/Navbar';
import Footer from '../components/customer/Footer';
import MobileBottomNav from '../components/customer/MobileBottomNav';

const CustomerLayout = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <main className="flex-grow pb-24 md:pb-0">
                <Outlet />
            </main>

            <MobileBottomNav />
            <Footer />
        </div>
    );
};

export default CustomerLayout;
