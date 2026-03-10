'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Bell, Save, Loader2 } from 'lucide-react';
import { updateParentalSettings } from '@/lib/actions/dashboard.actions';
import { useAuth } from '@clerk/nextjs';

interface ParentalControlsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialEmail: string | null;
    initialNotify: boolean;
}

export function ParentalControlsModal({ isOpen, onClose, initialEmail, initialNotify }: ParentalControlsModalProps) {
    const { userId } = useAuth();
    const [email, setEmail] = useState(initialEmail || '');
    const [notify, setNotify] = useState(initialNotify);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        // Basic email validation
        if (notify && !email.includes('@')) {
            setError('Please enter a valid email address to enable notifications.');
            return;
        }

        setIsSaving(true);
        setError('');
        setSuccess(false);

        try {
            await updateParentalSettings(userId, email, notify);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 1500);
        } catch (err) {
            setError('Failed to save settings. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 flex items-center justify-between text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-10">
                                <Shield className="w-32 h-32" />
                            </div>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Parental Controls</h2>
                                    <p className="text-gray-300 text-sm">Manage activity tracking & alerts</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="relative z-10 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 text-blue-800 text-sm">
                                    <Bell className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                                    <p>When enabled, we automatically track active focus time and will instantly email you if your child switches tabs or attempts to exit the learning platform.</p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="parentEmail" className="block text-sm font-semibold text-gray-700">
                                        Parent/Guardian Email Address
                                    </label>
                                    <input
                                        id="parentEmail"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="parent@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400"
                                    />
                                </div>

                                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div>
                                        <span className="block font-semibold text-gray-900">Notify on Platform Exit</span>
                                        <span className="block text-sm text-gray-500 mt-0.5">Send me an email alert when they leave</span>
                                    </div>
                                    <div className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notify ? 'bg-green-500' : 'bg-gray-200'}`} onClick={(e) => { e.preventDefault(); setNotify(!notify); }}>
                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notify ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                </label>
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>
                            )}
                            {success && (
                                <p className="text-sm text-green-700 bg-green-50 p-3 rounded-xl border border-green-100 font-medium">Settings saved successfully!</p>
                            )}

                            <div className="pt-4 border-t border-gray-100 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-70"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {isSaving ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
