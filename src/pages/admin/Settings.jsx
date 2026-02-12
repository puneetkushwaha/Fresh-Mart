import React, { useState, useEffect } from 'react';
import { Save, MapPin, Loader2, DollarSign, Truck, AlertCircle } from 'lucide-react';
import API from '../../api/apiClient';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet Marker Icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Settings = () => {
    const [settings, setSettings] = useState({
        taxRate: 5,
        deliveryCharge: 20,
        deliveryThreshold: 5,
        pricePerKm: 10,
        storeLocation: { lat: 26.8467, lng: 80.9462, address: 'Lucknow, India' }, // Default Lucknow
        minOrderForFreeDelivery: 500
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await API.get('/settings');
            if (data) setSettings(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch settings', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await API.put('/settings', settings);
            alert('Settings Updated Successfully!');
        } catch (error) {
            alert('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setSettings(prev => ({
                    ...prev,
                    storeLocation: {
                        ...prev.storeLocation,
                        lat: e.latlng.lat,
                        lng: e.latlng.lng,
                        address: 'Selected on Map'
                    }
                }));
            },
        });

        return settings.storeLocation.lat ? (
            <Marker position={[settings.storeLocation.lat, settings.storeLocation.lng]} />
        ) : null;
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin w-10 h-10 text-primary-600" /></div>;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Store Settings</h1>
                    <p className="text-gray-500 mt-1">Configure tax, delivery rules, and store location.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-70"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>Save Changes</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Financial Settings */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">Financials</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tax Rate (GST %)</label>
                            <input
                                type="number"
                                name="taxRate"
                                value={settings.taxRate}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-primary-500 focus:bg-white outline-none font-bold transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Min Order for Free Delivery (₹)</label>
                            <input
                                type="number"
                                name="minOrderForFreeDelivery"
                                value={settings.minOrderForFreeDelivery}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-primary-500 focus:bg-white outline-none font-bold transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Logistics Settings */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Truck className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">Logistics</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Base Delivery Charge (₹)</label>
                            <input
                                type="number"
                                name="deliveryCharge"
                                value={settings.deliveryCharge}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-primary-500 focus:bg-white outline-none font-bold transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Base Distance (Km)</label>
                            <input
                                type="number"
                                name="deliveryThreshold"
                                value={settings.deliveryThreshold}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-primary-500 focus:bg-white outline-none font-bold transition-all"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Charge per Extra Km (₹)</label>
                            <input
                                type="number"
                                name="pricePerKm"
                                value={settings.pricePerKm}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-primary-500 focus:bg-white outline-none font-bold transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Store Location</h2>
                            <p className="text-sm text-gray-500">Click on the map to set your store's dispatch location.</p>
                        </div>
                    </div>

                    <div className="h-[400px] rounded-2xl overflow-hidden border-2 border-gray-100 relative z-0">
                        <MapContainer center={[settings.storeLocation.lat, settings.storeLocation.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker />
                        </MapContainer>
                    </div>
                    <div className="flex gap-4 text-sm font-bold text-gray-600 bg-gray-50 p-4 rounded-xl">
                        <span>Lat: {settings.storeLocation.lat.toFixed(6)}</span>
                        <span>Lng: {settings.storeLocation.lng.toFixed(6)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
