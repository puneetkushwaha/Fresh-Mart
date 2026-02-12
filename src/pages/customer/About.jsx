import React from 'react';
import { Truck, ShieldCheck, Leaf, Users } from 'lucide-react';

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-black text-gray-900 mb-4">About Martify</h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                    We're on a mission to deliver the freshest, highest quality groceries directly from local farms where possible, right to your doorstep.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                <div className="rounded-[2.5rem] overflow-hidden shadow-xl">
                    <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                        alt="Fresh Vegetables"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Founded in 2024, Martify started with a simple idea: grocery shopping should be easy, transparent, and fresh. We noticed that meaningful connection between farmers and consumers was missing in the modern retail landscape.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Today, we serve thousands of families, ensuring that they have access to nutritious food without the hassle of crowded supermarkets.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: Leaf, title: "100% Organic", desc: "Sourced directly from certified organic farms." },
                    { icon: Truck, title: "Fast Delivery", desc: "Same-day delivery for orders placed before 2 PM." },
                    { icon: ShieldCheck, title: "Quality Check", desc: "Every item is hand-picked and quality checked." }
                ].map((item, i) => (
                    <div key={i} className="bg-gray-50 p-8 rounded-[2rem] text-center hover:bg-white hover:shadow-xl transition-all border border-gray-100">
                        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <item.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                        <p className="text-gray-500">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default About;
