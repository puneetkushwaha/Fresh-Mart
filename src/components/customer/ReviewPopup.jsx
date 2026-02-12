import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, CheckCircle2 } from 'lucide-react';
import API from '../../api/apiClient';

const ReviewPopup = ({ order, onClose }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/reviews', {
                orderId: order._id,
                rating,
                comment
            });
            setSubmitted(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full overflow-hidden relative"
                >
                    {!submitted ? (
                        <>
                            <button
                                onClick={onClose}
                                className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="p-12">
                                <span className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full text-primary-600 font-black text-[10px] tracking-widest uppercase mb-6">
                                    Share Your Experience
                                </span>
                                <h2 className="text-4xl font-black text-gray-900 mb-4 leading-tight">How was your order?</h2>
                                <p className="text-gray-500 mb-10 font-medium">Your feedback helps us improve and helps others shop better.</p>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="flex flex-col items-center space-y-4">
                                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Rate your experience</p>
                                        <div className="flex space-x-3">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setRating(s)}
                                                    className={`transition-all duration-300 transform ${rating >= s ? 'text-yellow-400 scale-125' : 'text-gray-200 hover:text-gray-300'}`}
                                                >
                                                    <Star className={`w-10 h-10 ${rating >= s ? 'fill-current' : ''}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Tell us more</p>
                                        <textarea
                                            placeholder="The freshness was amazing..."
                                            required
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-[2rem] p-6 outline-none transition-all font-medium min-h-[120px]"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Submit Review</span>
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="p-20 text-center flex flex-col items-center space-y-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 12 }}
                                className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center"
                            >
                                <CheckCircle2 className="w-12 h-12" />
                            </motion.div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-gray-900 leading-tight">Thank You!</h2>
                                <p className="text-gray-500 text-lg font-medium">Your review has been submitted successfully.</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReviewPopup;
