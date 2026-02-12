import React from 'react';

const Privacy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Privacy Policy</h1>
            <div className="prose prose-lg text-gray-500">
                <p>Last updated: February 12, 2026</p>

                <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">1. Information We Collect</h3>
                <p>We collect information you provide directly to us, such as when you create an account, update your profile, make a purchase, or sign up for our newsletter.</p>

                <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">2. How We Use Your Information</h3>
                <p>We use the information we collect to provide, maintain, and improve our services, such as to process transactions, send you related information, and respond to your comments and questions.</p>

                <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">3. Sharing of Information</h3>
                <p>We may share personal information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>

                <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">4. Security</h3>
                <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
            </div>
        </div>
    );
};

export default Privacy;
