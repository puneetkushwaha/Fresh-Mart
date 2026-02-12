import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { MapPin, CreditCard, ChevronRight, CheckCircle2, Truck, Loader2, Crosshair, Plus, Tag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/apiClient';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart, userInfo } = useCart();
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        firstName: userInfo?.name?.split(' ')[0] || '',
        lastName: userInfo?.name?.split(' ')[1] || '',
        address: userInfo?.address?.street || '',
        city: userInfo?.address?.city || '',
        zipCode: userInfo?.address?.zip || '',
        state: userInfo?.address?.state || ''
    });

    // Settings & Financials
    const [settings, setSettings] = useState(null);
    const [taxAmount, setTaxAmount] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [distance, setDistance] = useState(null);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');

    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [showCouponList, setShowCouponList] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);

    // 1. Fetch Settings on Mount
    useEffect(() => {
        const fetchSettingsAndCoupons = async () => {
            try {
                const [settingsRes, couponsRes] = await Promise.all([
                    API.get('/settings'),
                    API.get('/coupons/public')
                ]);
                setSettings(settingsRes.data);
                setAvailableCoupons(couponsRes.data);
            } catch (err) {
                console.error("Failed to fetch settings/coupons", err);
            }
        };
        fetchSettingsAndCoupons();
    }, []);

    // 2. Fetch User Profile Address
    useEffect(() => {
        const fetchProfile = async () => {
            if (userInfo?.token) {
                try {
                    const { data } = await API.get('/auth/profile');
                    if (data.address && !showNewAddressForm) {
                        setShippingAddress(prev => ({
                            ...prev,
                            address: data.address.street || prev.address,
                            city: data.address.city || prev.city,
                            zipCode: data.address.zip || prev.zipCode,
                            state: data.address.state || prev.state
                        }));
                    }
                } catch (err) {
                    console.error("Failed to fetch profile address", err);
                }
            }
        };
        fetchProfile();
    }, [userInfo, showNewAddressForm]);

    // 3. Calculate Distance & Delivery Fee
    useEffect(() => {
        if (!settings || !settings.storeLocation || !shippingAddress.address) return;

        // Debounce geocoding to avoid API spam
        const timer = setTimeout(async () => {
            try {
                // If we have user coordinates (from Locate Me), use them. 
                // Otherwise we might need to geocode the address string (skipped for now to keep simple, 
                // assuming 'Locate Me' gives accurate coords or we use a default logic).

                // For this implementation, we will use the coordinates from 'Locate Me' if available.
                // If not, we fall back to the base delivery charge + a standard method.
                // Ideally, we would geocode `shippingAddress` here.

                // Simplified Logic: If no coordinates, just use base charge.
                // Real Logic: Geocode address -> Get Lat/Lng -> Calc Distance.

                let dist = 0;
                // Mock distance for demo if address is present (In real app, use Google Maps/GraphHopper API)
                if (shippingAddress.address.length > 5) {
                    // Random distance between 2 and 15 km for demo purposes since we lack a real Geocoding API key
                    dist = Math.random() * 10 + 2;
                }

                setDistance(dist);

                // Calculate Fee
                let fee = settings.deliveryCharge;
                if (cartTotal >= settings.minOrderForFreeDelivery) {
                    fee = 0;
                } else if (dist > settings.deliveryThreshold) {
                    const extraKm = dist - settings.deliveryThreshold;
                    fee += extraKm * settings.pricePerKm;
                }
                setDeliveryFee(Math.round(fee));

            } catch (err) {
                console.error("Delivery calc error", err);
                setDeliveryFee(settings?.deliveryCharge || 20);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [shippingAddress.address, settings, cartTotal]);

    // 4. Calculate Tax
    useEffect(() => {
        if (settings) {
            const tax = (cartTotal * settings.taxRate) / 100;
            setTaxAmount(tax);
        }
    }, [cartTotal, settings]);

    const handleAddressChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleLocateMe = () => {
        setIsLocating(true);
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                if (data && data.address) {
                    setShippingAddress(prev => ({
                        ...prev,
                        address: `${data.address.road || ''} ${data.address.house_number || ''}`.trim() || prev.address,
                        city: data.address.city || data.address.town || data.address.village || prev.city,
                        zipCode: data.address.postcode || prev.zipCode,
                        state: data.address.state || prev.state
                    }));

                    // ACCURATE DISTANCE CALCULATION
                    if (settings?.storeLocation?.lat) {
                        const R = 6371; // Radius of the earth in km
                        const dLat = deg2rad(latitude - settings.storeLocation.lat);
                        const dLon = deg2rad(longitude - settings.storeLocation.lng);
                        const a =
                            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(deg2rad(settings.storeLocation.lat)) * Math.cos(deg2rad(latitude)) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        const d = R * c; // Distance in km

                        setDistance(d);

                        let fee = settings.deliveryCharge;
                        if (cartTotal >= settings.minOrderForFreeDelivery) {
                            fee = 0;
                        } else if (d > settings.deliveryThreshold) {
                            fee += (d - settings.deliveryThreshold) * settings.pricePerKm;
                        }
                        setDeliveryFee(Math.round(fee));
                    }
                }
            } catch (err) {
                console.error("Error getting location", err);
                setError('Failed to get location details');
            } finally {
                setIsLocating(false);
            }
        }, () => {
            setError('Unable to retrieve your location');
            setIsLocating(false);
        });
    };

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    const handleAddNewAddress = () => {
        setShowNewAddressForm(true);
        setShippingAddress({ firstName: '', lastName: '', address: '', city: '', zipCode: '', state: '' });
    };

    const handleContinueToPayment = () => {
        const { firstName, lastName, address, city, zipCode } = shippingAddress;
        if (!firstName || !lastName || !address || !city || !zipCode) {
            setError('Please fill in all shipping details');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setError('');
        setStep(2);
    };

    const handlePaymentStep = () => {
        if (!paymentMethod) {
            setError('Please select a payment method');
            return;
        }
        if (paymentMethod === 'UPI / NetBanking') {
            if (!transactionId.trim()) {
                setError('Please enter transaction ID');
                return;
            }
            if (!/^\d{12}$/.test(transactionId.trim())) {
                setError('Transaction ID must be exactly 12 digits');
                return;
            }
        }
        setError('');
        setStep(3);
    };

    const handleApplyCoupon = async (manualCode = null) => {
        const codeToApply = manualCode || couponCode;
        if (!codeToApply) return;

        setCouponLoading(true);
        setCouponError('');
        try {
            const { data } = await API.post('/coupons/validate', { code: codeToApply, orderTotal: cartTotal });
            setAppliedCoupon(data);
            setCouponCode(data.code);
            setShowCouponList(false);
        } catch (error) {
            setCouponError(error.response?.data?.message || 'Invalid Coupon');
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
    };

    // Calculate Final Total
    const finalTotal = cartTotal + taxAmount + deliveryFee - (appliedCoupon?.discount || 0);

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');

        if (!paymentMethod) {
            setError('Payment method is required');
            setLoading(false);
            return;
        }

        if (paymentMethod === 'UPI / NetBanking') {
            if (!transactionId.trim() || !/^\d{12}$/.test(transactionId.trim())) {
                setError('Invalid Transaction ID.');
                setLoading(false);
                return;
            }
        }

        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.cartQuantity,
                    image: item.image,
                    price: item.price,
                    product: item._id
                })),
                shippingAddress,
                paymentMethod,
                paymentResult: paymentMethod === 'UPI / NetBanking' ? {
                    id: transactionId,
                    status: 'Pending Verification',
                    update_time: new Date().toISOString(),
                    email_address: userInfo.email
                } : {},
                itemsPrice: cartTotal,
                taxPrice: taxAmount,
                shippingPrice: deliveryFee,
                discountPrice: appliedCoupon?.discount || 0,
                couponCode: appliedCoupon?.code || '',
                totalPrice: finalTotal
            };
            await API.post('/orders', orderData);
            clearCart();
            navigate('/order-success');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
            {/* Step Indicator */}
            <div className="flex justify-between items-center mb-16 px-4">
                {[
                    { icon: MapPin, label: 'Shipping' },
                    { icon: CreditCard, label: 'Payment' },
                    { icon: CheckCircle2, label: 'Review' }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 relative">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 ${step >= i + 1 ? 'bg-primary-600 text-white shadow-xl shadow-primary-200' : 'bg-white border border-gray-100 text-gray-300'}`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <span className={`mt-4 text-xs font-bold uppercase tracking-widest ${step >= i + 1 ? 'text-primary-600' : 'text-gray-300'}`}>{item.label}</span>
                        {i < 2 && (
                            <div className={`absolute top-7 left-1/2 w-full h-[2px] -z-0 ${step > i + 1 ? 'bg-primary-600' : 'bg-gray-100'}`} />
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-black text-gray-900">Shipping Address</h2>
                                    {!showNewAddressForm && (
                                        <button onClick={handleAddNewAddress} className="flex items-center space-x-2 text-primary-600 font-bold hover:bg-primary-50 px-4 py-2 rounded-xl transition-colors">
                                            <Plus className="w-5 h-5" /> <span>Add New</span>
                                        </button>
                                    )}
                                </div>
                                <div className="w-full h-48 bg-blue-50 rounded-[2rem] overflow-hidden relative border border-blue-100 group cursor-pointer">
                                    <iframe width="100%" height="100%" frameBorder="0" scrolling="no" src="https://www.openstreetmap.org/export/embed.html?bbox=72.5%2C22.0%2C88.0%2C30.0&amp;layer=mapnik" className="opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500 pointer-events-none"></iframe>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600"><MapPin className="w-5 h-5 fill-current" /></div>
                                            <p className="text-xs font-bold text-gray-900">Delivery Location</p>
                                        </div>
                                    </div>
                                    <button onClick={handleLocateMe} disabled={isLocating} className="absolute bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-lg hover:bg-black transition-colors disabled:opacity-75">
                                        {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />} <span>{isLocating ? 'Locating...' : 'Use Current Location'}</span>
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 sm:col-span-1"><label className="block text-sm font-bold text-gray-700 mb-2">First Name</label><input type="text" name="firstName" required value={shippingAddress.firstName} onChange={handleAddressChange} className="w-full px-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-primary-500 outline-none shadow-sm font-medium" /></div>
                                    <div className="col-span-2 sm:col-span-1"><label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label><input type="text" name="lastName" required value={shippingAddress.lastName} onChange={handleAddressChange} className="w-full px-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-primary-500 outline-none shadow-sm font-medium" /></div>
                                    <div className="col-span-2"><label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label><input type="text" name="address" required value={shippingAddress.address} onChange={handleAddressChange} className="w-full px-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-primary-500 outline-none shadow-sm font-medium" /></div>
                                    <div className="col-span-2 sm:col-span-1"><label className="block text-sm font-bold text-gray-700 mb-2">City</label><input type="text" name="city" required value={shippingAddress.city} onChange={handleAddressChange} className="w-full px-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-primary-500 outline-none shadow-sm font-medium" /></div>
                                    <div className="col-span-2 sm:col-span-1"><label className="block text-sm font-bold text-gray-700 mb-2">Zip Code</label><input type="text" name="zipCode" required value={shippingAddress.zipCode} onChange={handleAddressChange} className="w-full px-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-primary-500 outline-none shadow-sm font-medium" /></div>
                                </div>
                                {error && step === 1 && <p className="text-red-500 text-sm font-bold">{error}</p>}
                                <button onClick={handleContinueToPayment} className="w-full h-16 bg-gray-900 text-white rounded-[2rem] font-black text-lg flex items-center justify-center space-x-3 shadow-xl hover:bg-black transition-all"><span>Continue to Payment</span><ChevronRight className="w-6 h-6" /></button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                                <h2 className="text-3xl font-black text-gray-900 mb-8">Payment Method</h2>
                                <div className="space-y-4">
                                    {['Credit/Debit Card', 'Cash on Delivery'].map((method, i) => (
                                        <label key={i} className="flex items-center p-6 bg-white border-2 border-gray-50 rounded-[2rem] cursor-pointer hover:border-primary-200 transition-all shadow-sm group">
                                            <input type="radio" name="payment" className="w-6 h-6 text-primary-600 focus:ring-primary-500 cursor-pointer" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                                            <span className="ml-6 text-xl font-bold text-gray-700 group-hover:text-primary-600">{method}</span>
                                        </label>
                                    ))}
                                    <label className={`flex flex-col p-6 bg-white border-2 rounded-[2rem] cursor-pointer transition-all shadow-sm group ${paymentMethod === 'UPI / NetBanking' ? 'border-primary-600 bg-primary-50/10' : 'border-gray-50 hover:border-primary-200'}`}>
                                        <div className="flex items-center">
                                            <input type="radio" name="payment" className="w-6 h-6 text-primary-600 focus:ring-primary-500 cursor-pointer" checked={paymentMethod === 'UPI / NetBanking'} onChange={() => setPaymentMethod('UPI / NetBanking')} />
                                            <span className="ml-6 text-xl font-bold text-gray-700 group-hover:text-primary-600">UPI / QR Code</span>
                                        </div>
                                        {paymentMethod === 'UPI / NetBanking' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 ml-12 space-y-6">
                                                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                                                    <div className="bg-white p-2 rounded-xl border border-dashed border-gray-300">
                                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=7380663685@airtel&pn=Martify&am=${finalTotal}&cu=INR`} alt="Payment QR Code" className="w-32 h-32" />
                                                    </div>
                                                    <div className="flex-1 space-y-2 text-center md:text-left">
                                                        <p className="font-bold text-gray-900">Scan to Pay</p>
                                                        <p className="text-sm text-gray-500">Scan with any UPI app</p>
                                                        <div className="bg-gray-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                                                            <span className="text-sm font-mono font-medium text-gray-700">7380663685@airtel</span>
                                                            <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText('7380663685@airtel'); alert('UPI ID copied!'); }} className="text-primary-600 text-xs font-bold hover:underline">COPY</button>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1">Amount: <span className="font-bold text-gray-900">₹{finalTotal.toFixed(2)}</span></p>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Transaction ID / UTR Number <span className="text-red-500">*</span></label>
                                                    <input type="text" placeholder="Enter 12-digit UPI Reference ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </label>
                                </div>
                                {error && step === 2 && <p className="text-red-500 text-sm font-bold">{error}</p>}
                                <button onClick={handlePaymentStep} className="w-full h-16 bg-gray-900 text-white rounded-[2rem] font-black text-lg flex items-center justify-center space-x-3 shadow-xl hover:bg-black transition-all"><span>Confirm Review</span><ChevronRight className="w-6 h-6" /></button>
                                <button onClick={() => { setStep(1); setError(''); }} className="w-full text-center text-gray-400 font-bold hover:text-gray-600 transition-colors">Back to Shipping</button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                                <h2 className="text-3xl font-black text-gray-900 mb-8">Order Review</h2>
                                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                                    <div className="flex items-center space-x-4"><Truck className="w-6 h-6 text-primary-500" /><div><p className="font-bold text-gray-900">Arrives in 30-45 mins</p><p className="text-sm text-gray-400">Express delivery from central hub</p></div></div>
                                    <div className="flex items-center space-x-4"><MapPin className="w-6 h-6 text-primary-500" /><p className="font-bold text-gray-900">{shippingAddress.address}, {shippingAddress.city} {shippingAddress.zipCode}</p></div>
                                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                                </div>
                                <button onClick={handlePlaceOrder} disabled={loading} className="w-full h-20 bg-primary-600 text-white rounded-[2.5rem] font-black text-2xl flex items-center justify-center space-x-3 shadow-2xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-[0.98] disabled:opacity-70">{loading ? <Loader2 className="w-8 h-8 animate-spin" /> : (<><CheckCircle2 className="w-8 h-8" /><span>Place Order Now</span></>)}</button>
                                <button onClick={() => setStep(2)} className="w-full text-center text-gray-400 font-bold hover:text-gray-600 transition-colors">Change Payment Method</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Side Order Info with Coupon & Breakdown */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl lg:sticky lg:top-28">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                            <h3 className="text-xl font-bold text-gray-900">Order Items</h3>
                            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-black text-gray-500">{cartItems.length} items</span>
                        </div>
                        <div className="space-y-6 max-h-[300px] overflow-y-auto mb-8 pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0"><img src={item.image} alt={item.name} className="w-full h-full object-cover" /></div>
                                    <div className="flex-1 min-w-0"><h4 className="font-bold text-gray-900 truncate">{item.name}</h4><p className="text-xs text-gray-400 font-medium">Qty: {item.cartQuantity} × ₹{item.price}</p></div>
                                    <span className="font-black text-gray-900">₹{(item.price * item.cartQuantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Coupon Section */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Tag className="w-4 h-4" /> Coupon Code</h3>
                            {appliedCoupon ? (
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                                    <div>
                                        <p className="text-green-700 font-bold text-sm tracking-wide">{appliedCoupon.code}</p>
                                        <p className="text-green-600 text-xs">Saved ₹{appliedCoupon.discount}</p>
                                    </div>
                                    <button onClick={handleRemoveCoupon} className="p-1 hover:bg-green-100 rounded-lg text-green-700 transition-colors"><X className="w-4 h-4" /></button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Enter Code" className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 text-sm font-bold uppercase" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
                                    <button onClick={handleApplyCoupon} disabled={!couponCode || couponLoading} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors disabled:opacity-50">{couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}</button>
                                </div>
                            )}
                            {couponError && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{couponError}</p>}

                            {!appliedCoupon && availableCoupons.length > 0 && (
                                <div className="mt-4">
                                    <button
                                        onClick={() => setShowCouponList(!showCouponList)}
                                        className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                                    >
                                        {showCouponList ? 'Hide Available Coupons' : 'View Available Coupons'}
                                        <ChevronRight className={`w-3 h-3 transition-transform ${showCouponList ? 'rotate-90' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showCouponList && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-3 space-y-2 overflow-hidden"
                                            >
                                                {availableCoupons.map((coupon) => {
                                                    const isEligible = cartTotal >= coupon.minOrderAmount;
                                                    return (
                                                        <div
                                                            key={coupon.code}
                                                            className={`p-3 rounded-xl border transition-all ${isEligible ? 'bg-white border-gray-100 hover:border-primary-200' : 'bg-gray-50 border-transparent opacity-70'}`}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <p className="text-sm font-black text-gray-900">{coupon.code}</p>
                                                                    <p className="text-[10px] text-gray-500 font-medium">
                                                                        {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                                                        {coupon.minOrderAmount > 0 && ` on ₹${coupon.minOrderAmount}+`}
                                                                    </p>
                                                                </div>
                                                                {isEligible ? (
                                                                    <button
                                                                        onClick={() => {
                                                                            setCouponCode(coupon.code);
                                                                            handleApplyCoupon(coupon.code);
                                                                        }}
                                                                        className="text-[10px] font-black text-primary-600 hover:underline"
                                                                    >
                                                                        APPLY
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-[9px] font-bold text-red-400">Add ₹{(coupon.minOrderAmount - cartTotal).toFixed(0)} more</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 pt-4 border-t border-gray-50 text-sm">
                            <div className="flex justify-between items-center text-gray-500 font-medium">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500 font-medium">
                                <span>Tax ({settings?.taxRate || 0}%)</span>
                                <span>₹{taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500 font-medium">
                                <span>Delivery Fee {distance && `(${distance.toFixed(1)} km)`}</span>
                                <span>{deliveryFee === 0 ? <span className="text-green-500 font-bold">FREE</span> : `₹${deliveryFee.toFixed(2)}`}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between items-center text-green-600 font-bold">
                                    <span>Discount ({appliedCoupon.code})</span>
                                    <span>-₹{appliedCoupon.discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <span className="text-gray-900 font-bold text-lg">Total Amount</span>
                                <span className="text-2xl font-black text-primary-600">₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
