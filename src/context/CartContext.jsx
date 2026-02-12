import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [userInfo, setUserInfo] = useState(
        localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
    );

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const logout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('cartItems'); // Optional: clear cart on logout
        setUserInfo(null);
        setCartItems([]);
    };

    const addToCart = (product) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item._id === product._id);
            if (existing) {
                return prev.map((item) =>
                    item._id === product._id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
                );
            }
            return [...prev, { ...product, cartQuantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item._id === productId ? { ...item, cartQuantity: quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    const cartTotal = cartItems.reduce(
        (total, item) => {
            const price = item.price - (item.price * (item.discount || 0) / 100);
            return total + price * item.cartQuantity;
        },
        0
    );

    const updateUserInfo = (newData) => {
        const updated = { ...userInfo, ...newData };
        setUserInfo(updated);
        localStorage.setItem('userInfo', JSON.stringify(updated));
    };

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, userInfo, updateUserInfo, logout }}
        >
            {children}
        </CartContext.Provider>
    );
};
