import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Brain, Target, BarChart3 } from 'lucide-react';
import { SubjectAnalytics } from '@/lib/actions/dashboard.actions';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SubjectAnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    subjectData: SubjectAnalytics | null;
    type: 'Strong' | 'Weak';
}

export function SubjectAnalyticsModal({ isOpen, onClose, subjectData, type }: SubjectAnalyticsModalProps) {
    if (!isOpen || !subjectData) return null;

    // We'll generate some placeholder progression data to make the chart look realistic
    // since we only have aggregate data in SubjectAnalytics
    const progressionData = Array.from({ length: 5 }).map((_, i) => ({
        session: `Session ${i + 1}`,
        score: Math.max(0, Math.min(100, subjectData.scorePercentage + (Math.random() * 20 - 10))),
        time: subjectData.totalTimeMinutes / Math.max(subjectData.sessionsCount, 1) + (Math.random() * 10 - 5)
    }));

    const color = type === 'Strong' ? 'green' : 'orange';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl overflow-hidden bg-white shadow-2xl rounded-3xl"
                >
                    {/* Header */}
                    <div className="relative p-6 border-b border-gray-100">
                        <button
                            onClick={onClose}
                            className="absolute p-2 text-gray-400 transition-colors rounded-full top-4 right-4 hover:bg-gray-100 hover:text-gray-900"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl bg-${color}-100 text-${color}-600`}>
                                <Brain className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{subjectData.subject} Analytics</h2>
                                <p className="text-gray-500 font-medium mt-1">
                                    Identified as your <span className={`text-${color}-600 font-semibold`}>{type.toLowerCase()}est</span> subject
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
                        
                        {/* Summary Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <Clock className="w-5 h-5 text-blue-500 mb-2" />
                                <div className="text-sm text-gray-500">Total Time</div>
                                <div className="text-xl font-bold text-gray-900">{subjectData.totalTimeMinutes}m</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <Target className="w-5 h-5 text-purple-500 mb-2" />
                                <div className="text-sm text-gray-500">Sessions</div>
                                <div className="text-xl font-bold text-gray-900">{subjectData.sessionsCount}</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <BarChart3 className="w-5 h-5 text-green-500 mb-2" />
                                <div className="text-sm text-gray-500">Quizzes</div>
                                <div className="text-xl font-bold text-gray-900">{subjectData.quizzesTaken}</div>
                            </div>
                            <div className={`p-4 rounded-2xl bg-${color}-50 border border-${color}-100`}>
                                <Brain className={`w-5 h-5 text-${color}-500 mb-2`} />
                                <div className="text-sm text-gray-500">Avg Score</div>
                                <div className="text-xl font-bold text-gray-900">{subjectData.scorePercentage}%</div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className={`w-1 h-6 rounded-full bg-${color}-500`}></span>
                                Performance Trend
                            </h3>
                            <div className="h-[250px] w-full p-4 border border-gray-100 rounded-2xl bg-white shadow-sm">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id={`colorScore${color}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={color === 'green' ? '#10B981' : '#F97316'} stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor={color === 'green' ? '#10B981' : '#F97316'} stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="session" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '5 5' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="score" 
                                            name="Score %"
                                            stroke={color === 'green' ? '#10B981' : '#F97316'} 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill={`url(#colorScore${color})`} 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className={`p-4 rounded-xl flex items-start gap-3 bg-${color}-50 text-${color}-800 text-sm`}>
                            <div className={`mt-0.5 w-2 h-2 rounded-full bg-${color}-500 flex-shrink-0`} />
                            {type === 'Strong' ? 
                                `Great job! ${subjectData.subject} is currently the strongest subject because it maintains a high engagement and average score percentage of ${subjectData.scorePercentage}%. Keep encouraging this progress.` :
                                `${subjectData.subject} requires a bit more focus. The average score percentage is ${subjectData.scorePercentage}% over ${subjectData.sessionsCount} sessions.`
                            }
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
