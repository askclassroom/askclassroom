'use client';

import { StudentDashboardData } from "@/lib/actions/dashboard.actions";
import { cn, getSubjectColor } from "@/lib/utils";
import {
    Clock,
    CalendarCheck,
    BookOpen,
    Target,
    Flame,
    TrendingUp,
    TrendingDown,
    Minus,
    Award,
    BarChart3,
    Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface StudentDashboardClientProps {
    data: StudentDashboardData | null;
}

const StudentDashboardClient = ({ data }: StudentDashboardClientProps) => {
    if (!data) {
        return (
            <div className="text-center py-16 bg-white rounded-4xl border border-black">
                <Image
                    src="/images/limit.svg"
                    alt="No data"
                    width={200}
                    height={200}
                    className="mx-auto mb-6"
                />
                <h2 className="text-2xl font-bold mb-3">No Learning Data Yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Start your first learning session to see your stats and track your progress!
                </p>
                <Link href="/companions" className="btn-primary inline-flex">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Find a Companion
                </Link>
            </div>
        );
    }

    const {
        weeklyLearningTime,
        sessionsCompletedThisWeek,
        subjectsStudied,
        currentFocusTopic,
        learningStreak,
        engagementTrend,
        weeklyActivity,
        totalSessionsAllTime,
        totalLearningTimeAllTime,
        favoriteSubject
    } = data;

    const getTrendIcon = () => {
        switch (engagementTrend) {
            case 'up':
                return <TrendingUp className="w-6 h-6 text-green-600" />;
            case 'down':
                return <TrendingDown className="w-6 h-6 text-red-600" />;
            default:
                return <Minus className="w-6 h-6 text-yellow-600" />;
        }
    };

    const getTrendText = () => {
        switch (engagementTrend) {
            case 'up':
                return 'Up 10%+';
            case 'down':
                return 'Down 10%+';
            default:
                return 'Stable';
        }
    };

    const getTrendColor = () => {
        switch (engagementTrend) {
            case 'up':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'down':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        }
    };

    const statCards = [
        {
            icon: <Clock className="w-8 h-8" />,
            label: "This Week's Learning",
            value: `${weeklyLearningTime} min`,
            subValue: `${sessionsCompletedThisWeek} sessions`,
            color: "bg-blue-50",
            iconColor: "text-blue-600",
            borderColor: "border-blue-200"
        },
        {
            icon: <Award className="w-8 h-8" />,
            label: "All Time Learning",
            value: `${totalLearningTimeAllTime} min`,
            subValue: `${totalSessionsAllTime} sessions total`,
            color: "bg-purple-50",
            iconColor: "text-purple-600",
            borderColor: "border-purple-200"
        },
        {
            icon: <BookOpen className="w-8 h-8" />,
            label: "Subjects This Week",
            value: subjectsStudied.length.toString(),
            subValue: subjectsStudied.length > 0 ? subjectsStudied.join(', ') : 'None yet',
            color: "bg-indigo-50",
            iconColor: "text-indigo-600",
            borderColor: "border-indigo-200"
        },
        {
            icon: <Target className="w-8 h-8" />,
            label: "Current Focus",
            value: currentFocusTopic?.topic || 'No active focus',
            subValue: currentFocusTopic?.subject || 'Start a session to set focus',
            color: "bg-orange-50",
            iconColor: "text-orange-600",
            borderColor: "border-orange-200"
        },
        {
            icon: <Flame className="w-8 h-8" />,
            label: "Learning Streak",
            value: `${learningStreak} day${learningStreak !== 1 ? 's' : ''}`,
            subValue: learningStreak > 0 ? 'Keep it up! 🔥' : 'Start learning today!',
            color: "bg-red-50",
            iconColor: "text-red-600",
            borderColor: "border-red-200"
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            label: "Favorite Subject",
            value: favoriteSubject,
            subValue: `Trend: ${getTrendText()}`,
            color: getTrendColor().split(' ')[0],
            iconColor: engagementTrend === 'up' ? 'text-green-600' : engagementTrend === 'down' ? 'text-red-600' : 'text-yellow-600',
            borderColor: getTrendColor().split(' ')[2] || 'border-gray-200'
        }
    ];

    // Calculate max minutes for chart scaling
    const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes), 1);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                            "rounded-3xl p-6 flex items-start gap-4 border-2",
                            stat.color,
                            stat.borderColor
                        )}
                    >
                        <div className={cn("p-3 rounded-2xl bg-white shadow-sm", stat.iconColor)}>
                            {stat.icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-500 capitalize">{stat.subValue}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Weekly Activity Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-4xl border-2 border-black p-8"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Weekly Activity</h2>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-cta-gold rounded-full"></span>
                        <span className="text-sm text-gray-600">Minutes learned</span>
                    </div>
                </div>

                <div className="flex items-end justify-between gap-2 h-48">
                    {weeklyActivity.map((day, i) => {
                        const height = maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0;
                        return (
                            <div key={day.day} className="flex-1 flex flex-col items-center gap-3 group">
                                <div className="relative w-full flex justify-center">
                                    <span className="absolute -top-6 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 rounded-lg">
                                        {day.minutes} min
                                    </span>
                                </div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                                    className="w-full bg-gradient-to-t from-cta-gold to-yellow-300 rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                                    style={{ minHeight: day.minutes > 0 ? '4px' : '2px' }}
                                />
                                <span className="text-sm font-medium text-gray-600">{day.day}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">Total this week</p>
                        <p className="text-3xl font-bold">{weeklyLearningTime} minutes</p>
                    </div>
                    <div className={cn(
                        "px-4 py-2 rounded-full border flex items-center gap-2",
                        getTrendColor()
                    )}>
                        {getTrendIcon()}
                        <span className="font-medium">{getTrendText()} vs last week</span>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions & Recommendations */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <div className="bg-gradient-to-br from-cta to-gray-900 text-white rounded-4xl p-8">
                    <Sparkles className="w-10 h-10 mb-4 text-cta-gold" />
                    <h3 className="text-2xl font-bold mb-2">Ready to learn more?</h3>
                    <p className="text-gray-300 mb-6">
                        Continue your learning journey with our AI companions
                    </p>
                    <Link href="/companions" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                        Explore Companions
                        <TrendingUp className="w-5 h-5" />
                    </Link>
                </div>

                <div className="bg-white rounded-4xl border-2 border-black p-8">
                    <h3 className="text-xl font-bold mb-4">Learning Tips</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="text-cta-gold text-xl">•</span>
                            <span className="text-gray-700">Consistency is key - try to learn a little every day</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-cta-gold text-xl">•</span>
                            <span className="text-gray-700">Mix different subjects to keep it interesting</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-cta-gold text-xl">•</span>
                            <span className="text-gray-700">Review past sessions to reinforce learning</span>
                        </li>
                        {learningStreak > 0 && (
                            <li className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-200">
                                <Flame className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <span className="font-semibold">
                                    You're on a {learningStreak}-day streak! Keep it going! 🔥
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default StudentDashboardClient;