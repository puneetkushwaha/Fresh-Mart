import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Save, Loader2, MapPin, Navigation, Calendar } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import API from '../../api/apiClient';

const Profile = () => {
    const { userInfo, updateUserInfo } = useCart();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: userInfo?.name || '',
        email: userInfo?.email || '',
        phone: userInfo?.phone || '',
        address: {
            street: userInfo?.address?.street || '',
            city: userInfo?.address?.city || '',
            state: userInfo?.address?.state || '',
            zip: userInfo?.address?.zip || ''
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/auth/profile');
                if (updateUserInfo) updateUserInfo(data);
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: {
                        street: data.address?.street || '',
                        city: data.address?.city || '',
                        state: data.address?.state || '',
                        zip: data.address?.zip || ''
                    }
                });
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleDetectLocation = () => {
        setLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    if (data.address) {
                        const addr = data.address;
                        setFormData(prev => ({
                            ...prev,
                            address: {
                                street: addr.road || addr.suburb || '',
                                city: addr.city || addr.town || addr.village || '',
                                state: addr.state || '',
                                zip: addr.postcode || ''
                            }
                        }));
                    }
                    setLoading(false);
                } catch (err) {
                    console.error("Geocoding failed", err);
                    setLoading(false);
                }
            }, (error) => {
                console.error("Geolocation failed", error);
                setLoading(false);
            });
        } else {
            alert("Geolocation is not supported by your browser");
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const { data } = await API.put('/auth/profile', formData);
            if (updateUserInfo) {
                updateUserInfo(data);
            } else {
                localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...data }));
            }
            setSuccess(true);
            setLoading(false);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-green-500 px-8 py-12 text-white">
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl font-black">
                            {userInfo?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black">{userInfo?.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 mt-1">
                                <p className="opacity-80 font-medium flex items-center">
                                    <Shield className="w-4 h-4 mr-2" />
                                    {userInfo?.role?.toUpperCase()} ACCOUNT
                                </p>
                                {userInfo?.createdAt && (
                                    <p className="opacity-60 text-xs font-medium flex items-center">
                                        <Calendar className="w-3.5 h-3.5 mr-2" />
                                        MEMBER SINCE {new Date(userInfo.createdAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors w-5 h-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium"
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                <div className="relative group opacity-60">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        disabled
                                        value={formData.email}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-transparent rounded-2xl outline-none font-medium cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 ml-1">Email cannot be changed</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors w-5 h-5" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="pt-8 border-t border-gray-50">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                                    Delivery Address
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleDetectLocation}
                                    className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center bg-primary-50 px-4 py-2 rounded-xl transition-all hover:shadow-sm border border-primary-100"
                                >
                                    <Navigation className="w-4 h-4 mr-2" />
                                    Detect My Location
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Street Address</label>
                                    <input
                                        type="text"
                                        name="address.street"
                                        value={formData.address.street}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium"
                                        placeholder="Street Name & House No."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">City</label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        value={formData.address.city}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium"
                                        placeholder="City"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">State</label>
                                        <input
                                            type="text"
                                            name="address.state"
                                            value={formData.address.state}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium"
                                            placeholder="State"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Zip Code</label>
                                        <input
                                            type="text"
                                            name="address.zip"
                                            value={formData.address.zip}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium"
                                            placeholder="Zip Code"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-green-50 text-green-600 rounded-2xl text-sm font-bold border border-green-100 animate-in fade-in slide-in-from-top-4">
                                Profile updated successfully!
                            </div>
                        )}

                        <div className="pt-4 flex items-center space-x-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-xl shadow-primary-200 transition-all flex items-center justify-center space-x-3 disabled:opacity-70 disabled:scale-95"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
