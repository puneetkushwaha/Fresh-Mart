import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    console.log('AdminRoute: checking access', {
        hasUserInfo: !!userInfo,
        role: userInfo?.role
    });

    if (userInfo) {
        if (userInfo.role?.toLowerCase() === 'admin') {
            return children;
        }
        console.log('AdminRoute: Not an admin, redirecting to /');
        return <Navigate to="/" replace />;
    }

    console.log('AdminRoute: No user info, redirecting to /login');
    return <Navigate to="/login" replace />;
};

export default AdminRoute;
