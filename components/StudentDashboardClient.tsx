// 'use client';

// import { StudentDashboardData } from "@/lib/actions/dashboard.actions";
// import { cn, getSubjectColor } from "@/lib/utils";
// import {
//     Clock,
//     CalendarCheck,
//     BookOpen,
//     Target,
//     Flame,
//     TrendingUp,
//     TrendingDown,
//     Minus,
//     Award,
//     BarChart3,
//     Sparkles,
//     ShieldAlert,
//     MonitorPlay,
//     Shield
// } from "lucide-react";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import { ParentalControlsModal } from "./ParentalControlsModal";

// const Sparkline = ({ path, color, gradientId, endY, labelY }: { path: string, color: string, gradientId: string, endY: number, labelY: string }) => (
//   <svg className="w-24 h-16 ml-auto" viewBox="0 0 100 40" preserveAspectRatio="none">
//     <defs>
//       <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
//         <stop offset="0%" stopColor={color} stopOpacity="0.2" />
//         <stop offset="100%" stopColor={color} stopOpacity="0" />
//       </linearGradient>
//     </defs>
//     <path d={`${path} L 100 40 L 0 40 Z`} fill={`url(#${gradientId})`} />
//     <path d={path} fill="none" stroke={color} strokeWidth="2.5" />
//     <circle cx="100" cy={endY} r="3" fill={color} stroke="#fff" strokeWidth="1" />
//     <line x1="100" y1={endY} x2="100" y2="40" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 2" />
//     <text x="100" y={endY - 6} fontSize="11" fill="#111827" fontWeight="bold" textAnchor="end">{labelY}</text>
//   </svg>
// );

// const RingChart = ({ value, color }: { value: number, color: string }) => {
//   const dash = `${value}, 100`;
//   return (
//     <div className="flex flex-col items-center">
//       <div className="relative w-12 h-12 flex items-center justify-center">
//         <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
//           <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
//           <path style={{ color }} strokeDasharray={dash} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
//         </svg>
//         <div className="absolute flex items-center justify-center text-[10px] font-semibold text-gray-900 border-2 border-white rounded-full bg-white h-7 w-7 shadow-sm">
//           {value}
//         </div>
//       </div>
//       <span className="text-[10px] font-medium text-gray-500 mt-1">Completion</span>
//     </div>
//   );
// };

// const generateSparklineCurve = (data: number[]) => {
//     if (!data || data.length === 0) return { path: "M 0 40 L 100 40", endY: 40 };
//     const max = Math.max(...data, 1);
//     const yOffsets = data.map(val => 40 - ((val / max) * 30));
//     const stepX = 100 / (data.length - 1 || 1);
//     const points = yOffsets.map((y, i) => ({ x: i * stepX, y }));

//     let path = `M ${points[0].x} ${points[0].y}`;
//     for (let i = 0; i < points.length - 1; i++) {
//         const x_mid = (points[i].x + points[i + 1].x) / 2;
//         path += ` C ${x_mid} ${points[i].y}, ${x_mid} ${points[i+1].y}, ${points[i+1].x} ${points[i+1].y}`;
//     }
//     return { path, endY: points[points.length - 1].y };
// };

// interface StudentDashboardClientProps {
//     data: StudentDashboardData | null;
// }

// const StudentDashboardClient = ({ data }: StudentDashboardClientProps) => {
//     if (!data) {
//         return (
//             <div className="text-center py-16 bg-white rounded-4xl border border-black">
//                 <Image
//                     src="/images/limit.svg"
//                     alt="No data"
//                     width={200}
//                     height={200}
//                     className="mx-auto mb-6"
//                 />
//                 <h2 className="text-2xl font-bold mb-3">No Learning Data Yet</h2>
//                 <p className="text-muted-foreground mb-6 max-w-md mx-auto">
//                     Start your first learning session to see your stats and track your progress!
//                 </p>
//                 <Link href="/companions" className="btn-primary inline-flex">
//                     <Sparkles className="w-5 h-5 mr-2" />
//                     Find a Companion
//                 </Link>
//             </div>
//         );
//     }

//     const {
//         weeklyLearningTime,
//         sessionsCompletedThisWeek,
//         subjectsStudied,
//         currentFocusTopic,
//         learningStreak,
//         engagementTrend,
//         weeklyActivity,
//         totalSessionsAllTime,
//         totalLearningTimeAllTime,
//         favoriteSubject,
//         platformActiveMinutesToday,
//         exitAttemptsToday,
//         recentExits,
//         parentalSettings
//     } = data;

//     const [isParentalModalOpen, setIsParentalModalOpen] = useState(false);

//     const getTrendIcon = () => {
//         switch (engagementTrend) {
//             case 'up':
//                 return <TrendingUp className="w-6 h-6 text-green-600" />;
//             case 'down':
//                 return <TrendingDown className="w-6 h-6 text-red-600" />;
//             default:
//                 return <Minus className="w-6 h-6 text-yellow-600" />;
//         }
//     };

//     const getTrendText = () => {
//         switch (engagementTrend) {
//             case 'up':
//                 return 'Up 10%+';
//             case 'down':
//                 return 'Down 10%+';
//             default:
//                 return 'Stable';
//         }
//     };

//     const activityData = weeklyActivity.map(d => d.minutes);
//     const sparklineData = generateSparklineCurve(activityData);

//     const statCards = [
//         {
//             icon: <Clock className="w-6 h-6" />,
//             label: "This Week's Learning",
//             subLabel: "Time spent learning",
//             value: weeklyLearningTime.toString(),
//             valueSuffix: "min",
//             trend: engagementTrend === 'stable' ? "" : `10%+`,
//             trendUp: engagementTrend === 'up',
//             subValue: `${sessionsCompletedThisWeek} sessions`,
//             iconBg: "#3B82F6",
//             chart: "sparkline" as const,
//             sparklinePath: sparklineData.path,
//             endY: sparklineData.endY,
//             labelY: weeklyActivity.length > 0 ? weeklyActivity[weeklyActivity.length - 1].minutes.toString() : "0"
//         },
//         {
//             icon: <Award className="w-6 h-6" />,
//             label: "All Time",
//             subLabel: "Total learning time",
//             value: totalLearningTimeAllTime.toString(),
//             valueSuffix: "min",
//             trend: "",
//             trendUp: true,
//             subValue: `${totalSessionsAllTime} total sessions`,
//             iconBg: "#8B5CF6",
//             chart: "ring" as const,
//             ringValue: Math.min(100, Math.round((totalLearningTimeAllTime / 1000) * 100)) || 10
//         },
//         {
//             icon: <BookOpen className="w-6 h-6" />,
//             label: "Subjects This Week",
//             subLabel: subjectsStudied.length > 0 ? subjectsStudied.join(', ') : 'None yet',
//             value: subjectsStudied.length.toString(),
//             valueSuffix: "",
//             trend: "",
//             trendUp: true,
//             subValue: "Active subjects",
//             iconBg: "#6366F1",
//             chart: "ring" as const,
//             ringValue: subjectsStudied.length > 0 ? Math.min(100, subjectsStudied.length * 20) : 0
//         },
//         {
//             icon: <Target className="w-6 h-6" />,
//             label: "Current Focus",
//             subLabel: currentFocusTopic?.subject || 'Start a session to set focus',
//             value: currentFocusTopic?.topic || 'None',
//             valueSuffix: "",
//             trend: "",
//             trendUp: true,
//             subValue: "Active topic",
//             iconBg: "#F97316",
//             chart: "ring" as const,
//             ringValue: currentFocusTopic ? 100 : 0
//         },
//         {
//             icon: <Flame className="w-6 h-6" />,
//             label: "Learning Streak",
//             subLabel: learningStreak > 0 ? 'Keep it up! 🔥' : 'Start learning today!',
//             value: learningStreak.toString(),
//             valueSuffix: " days",
//             trend: "",
//             trendUp: true,
//             subValue: "Daily consistency",
//             iconBg: "#EF4444",
//             chart: "sparkline" as const,
//             sparklinePath: sparklineData.path,
//             endY: sparklineData.endY,
//             labelY: learningStreak.toString()
//         },
//         {
//             icon: <BarChart3 className="w-6 h-6" />,
//             label: "Favorite Subject",
//             subLabel: `Trend: ${getTrendText()}`,
//             value: favoriteSubject || "None",
//             valueSuffix: "",
//             trend: engagementTrend === 'up' ? "10%" : engagementTrend === 'down' ? "10%" : "",
//             trendUp: engagementTrend === 'up',
//             subValue: "Highest engagement",
//             iconBg: engagementTrend === 'down' ? '#EF4444' : '#10B981',
//             chart: "ring" as const,
//             ringValue: engagementTrend === 'up' ? 90 : engagementTrend === 'stable' ? 50 : 30
//         },
//         {
//             icon: <MonitorPlay className="w-6 h-6" />,
//             label: "Active Focus Time",
//             subLabel: "Platform activity today",
//             value: platformActiveMinutesToday.toString(),
//             valueSuffix: " min",
//             trend: "",
//             trendUp: true,
//             subValue: "Today's activity",
//             iconBg: "#14B8A6",
//             chart: "sparkline" as const,
//             sparklinePath: sparklineData.path,
//             endY: sparklineData.endY,
//             labelY: platformActiveMinutesToday.toString()
//         },
//         {
//             icon: <ShieldAlert className="w-6 h-6" />,
//             label: "Distractions / Exits",
//             subLabel: exitAttemptsToday > 0 ? "Tabs closed or switched" : "Great focus today! 🌟",
//             value: exitAttemptsToday.toString(),
//             valueSuffix: "",
//             trend: "",
//             trendUp: false,
//             subValue: "Exits today",
//             iconBg: exitAttemptsToday > 0 ? "#F59E0B" : "#10B981",
//             chart: "ring" as const,
//             ringValue: exitAttemptsToday > 0 ? Math.min(100, Math.max(10, 100 - (exitAttemptsToday * 15))) : 100
//         }
//     ];

//     // Calculate max minutes for chart scaling
//     const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes), 1);

//     return (
//         <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="space-y-8"
//         >
//             <div className="flex justify-between items-center bg-white rounded-3xl p-6 border-2 border-black">
//                 <div>
//                     <h1 className="text-2xl font-bold">Your Learning Dashboard</h1>
//                 </div>
//                 <button
//                     onClick={() => setIsParentalModalOpen(true)}
//                     className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
//                 >
//                     <Shield className="w-5 h-5 text-gray-300" />
//                     <span className="font-semibold text-sm">Parental Controls</span>
//                 </button>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 mt-4">
//                 {statCards.map((stat, index) => (
//                     <motion.div
//                         key={index}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.1 }}
//                         className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 flex flex-col justify-between"
//                     >
//                         <div className="flex items-center gap-3.5 mb-8">
//                             <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: stat.iconBg }}>
//                                 {stat.icon}
//                             </div>
//                             <div className="min-w-0">
//                                 <h3 className="font-semibold text-[15px] text-gray-900 truncate">{stat.label}</h3>
//                                 <p className="text-[13px] text-gray-500 truncate">{stat.subLabel}</p>
//                             </div>
//                         </div>
//                         <div className="flex justify-between items-end gap-2">
//                             <div className="min-w-0">
//                                 <div className="flex items-end gap-2 mb-1 flex-wrap">
//                                     <span className="text-2xl lg:text-[28px] leading-none font-semibold text-gray-900 tracking-tight truncate max-w-full">
//                                         {stat.value}
//                                         {stat.valueSuffix && <span className="text-lg lg:text-xl ml-1 font-medium">{stat.valueSuffix}</span>}
//                                     </span>
//                                     {stat.trend && (
//                                         <span className={`text-xs font-semibold flex items-center pb-0.5 whitespace-nowrap ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
//                                             <span className="text-[8px] mr-1">{stat.trendUp ? '▲' : '▼'}</span> {stat.trend}
//                                         </span>
//                                     )}
//                                 </div>
//                                 <p className="text-[13px] text-gray-500 truncate">{stat.subValue}</p>
//                             </div>
//                             <div className="shrink-0 pl-2">
//                                 {stat.chart === 'ring' && <RingChart value={stat.ringValue || 0} color={stat.iconBg} />}
//                                 {stat.chart === 'sparkline' && <Sparkline path={stat.sparklinePath || ""} color={stat.iconBg} gradientId={`grad-${index}`} endY={stat.endY || 40} labelY={stat.labelY || ""} />}
//                             </div>
//                         </div>
//                     </motion.div>
//                 ))}
//             </div>

//             {/* Weekly Activity Chart */}
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//                 className="bg-white rounded-4xl border-2 border-black p-8"
//             >
//                 <div className="flex justify-between items-center mb-8">
//                     <h2 className="text-2xl font-bold">Weekly Activity</h2>
//                     <div className="flex items-center gap-2">
//                         <span className="w-3 h-3 bg-cta-gold rounded-full"></span>
//                         <span className="text-sm text-gray-600">Minutes learned</span>
//                     </div>
//                 </div>

//                 <div className="flex items-end justify-between gap-2 h-48">
//                     {weeklyActivity.map((day, i) => {
//                         const height = maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0;
//                         return (
//                             <div key={day.day} className="flex-1 flex flex-col items-center gap-3 group">
//                                 <div className="relative w-full flex justify-center">
//                                     <span className="absolute -top-6 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 rounded-lg">
//                                         {day.minutes} min
//                                     </span>
//                                 </div>
//                                 <motion.div
//                                     initial={{ height: 0 }}
//                                     animate={{ height: `${height}%` }}
//                                     transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
//                                     className="w-full bg-gradient-to-t from-cta-gold to-yellow-300 rounded-t-lg transition-all duration-300 group-hover:brightness-110"
//                                     style={{ minHeight: day.minutes > 0 ? '4px' : '2px' }}
//                                 />
//                                 <span className="text-sm font-medium text-gray-600">{day.day}</span>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
//                     <div>
//                         <p className="text-sm text-gray-600">Total this week</p>
//                         <p className="text-3xl font-bold">{weeklyLearningTime} minutes</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         {getTrendIcon()}
// <span className="font-medium text-gray-800">{getTrendText()}</span>
//                     </div>
//                 </div>
//             </motion.div>

//             {/* Quick Actions & Recommendations */}
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.7 }}
//                 className="grid grid-cols-1 md:grid-cols-2 gap-6"
//             >
//                 <div className="bg-gradient-to-br from-cta to-gray-900 text-white rounded-4xl p-8">
//                     <Sparkles className="w-10 h-10 mb-4 text-cta-gold" />
//                     <h3 className="text-2xl font-bold mb-2">Ready to learn more?</h3>
//                     <p className="text-gray-300 mb-6">
//                         Continue your learning journey with our AI companions
//                     </p>
//                     <Link href="/companions" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
//                         Explore Companions
//                         <TrendingUp className="w-5 h-5" />
//                     </Link>
//                 </div>

//                 <div className="bg-white rounded-4xl border-2 border-black p-8">
//                     <h3 className="text-xl font-bold mb-4">Learning Tips</h3>
//                     <ul className="space-y-3">
//                         <li className="flex items-start gap-3">
//                             <span className="text-cta-gold text-xl">•</span>
//                             <span className="text-gray-700">Consistency is key - try to learn a little every day</span>
//                         </li>
//                         <li className="flex items-start gap-3">
//                             <span className="text-cta-gold text-xl">•</span>
//                             <span className="text-gray-700">Mix different subjects to keep it interesting</span>
//                         </li>
//                         <li className="flex items-start gap-3">
//                             <span className="text-cta-gold text-xl">•</span>
//                             <span className="text-gray-700">Review past sessions to reinforce learning</span>
//                         </li>
//                         {learningStreak > 0 && (
//                             <li className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-200">
//                                 <Flame className="w-5 h-5 text-red-500 flex-shrink-0" />
//                                 <span className="font-semibold">
//                                     You're on a {learningStreak}-day streak! Keep it going! 🔥
//                                 </span>
//                             </li>
//                         )}
//                     </ul>
//                 </div>
//             </motion.div>

//             <ParentalControlsModal
//                 isOpen={isParentalModalOpen}
//                 onClose={() => setIsParentalModalOpen(false)}
//                 initialEmail={parentalSettings?.parentEmail || null}
//                 initialNotify={parentalSettings?.notifyOnExit || false}
//             />
//         </motion.div>
//     );
// };

// export default StudentDashboardClient;

'use client';

import { StudentDashboardData } from "@/lib/actions/dashboard.actions";
import { cn } from "@/lib/utils";
import {
    Sparkles,
    ShieldAlert,
    Shield,
    ChevronRight,
    Zap
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ParentalControlsModal } from "./ParentalControlsModal";
import { SubjectAnalyticsModal } from "./SubjectAnalyticsModal";
import { SubjectAnalytics } from "@/lib/actions/dashboard.actions";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ComposedChart,
    Line
} from 'recharts';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-xl shadow-xl border border-gray-100"
            >
                <p className="font-semibold text-gray-900 mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-gray-600">{entry.name}:</span>
                        <span className="font-medium text-gray-900">{entry.value} {entry.unit}</span>
                    </div>
                ))}
            </motion.div>
        );
    }
    return null;
};

interface StudentDashboardClientProps {
    data: StudentDashboardData | null;
}

const StudentDashboardClient = ({ data }: StudentDashboardClientProps) => {
    const [isParentalModalOpen, setIsParentalModalOpen] = useState(false);
    const [selectedChart, setSelectedChart] = useState<'activity' | 'subjects' | 'progress' | 'insights'>('activity');
    const [chartRange, setChartRange] = useState<'week' | 'month' | 'year'>('week');
    const [selectedSubject, setSelectedSubject] = useState<{ data: SubjectAnalytics, type: 'Strong' | 'Weak' } | null>(null);

    if (!data) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white rounded-4xl border border-black"
            >
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
            </motion.div>
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
        platformActiveMinutesToday,
        exitAttemptsToday,
        recentExits,
        parentalSettings
    } = data;

    // Enhanced data for charts
    const subjectPerformanceData = subjectsStudied.map((subject, index) => ({
        subject,
        sessions: Math.floor(Math.random() * 20) + 5,
        timeSpent: Math.floor(Math.random() * 300) + 100,
        progress: Math.floor(Math.random() * 40) + 60,
        color: `hsl(${index * 45}, 70%, 60%)`
    }));

    const monthlyProgressData = [
        { month: 'Jan', math: 65, science: 70, history: 75, english: 80 },
        { month: 'Feb', math: 68, science: 72, history: 78, english: 82 },
        { month: 'Mar', math: 72, science: 75, history: 82, english: 85 },
        { month: 'Apr', math: 78, science: 80, history: 85, english: 88 },
        { month: 'May', math: 85, science: 78, history: 88, english: 90 },
        { month: 'Jun', math: 88, science: 85, history: 92, english: 89 },
    ];

    const insightsData = [
        { metric: 'Retention', value: 85, fullMark: 100 },
        { metric: 'Focus', value: 78, fullMark: 100 },
        { metric: 'Participation', value: 92, fullMark: 100 },
        { metric: 'Understanding', value: 88, fullMark: 100 },
        { metric: 'Application', value: 82, fullMark: 100 },
    ];

    // Calculate total productive time (weekly learning time in hours)
    const productiveTimeHours = (weeklyLearningTime / 60).toFixed(1);

    // Calculate trend percentages (mock data - replace with actual calculations)
    const trendValues = {
        productiveTime: '+23%',
        sessionsCompleted: '+15%',
        subjectsStudied: '+8%',
        learningStreak: learningStreak > 0 ? '+5%' : '0%',
        totalTime: '+32%',
        todayActive: platformActiveMinutesToday > 30 ? '+12%' : '-5%',
        focusTime: '+12%',
        distractions: exitAttemptsToday === 0 ? '-100%' : '-18%'
    };

    const cards = [
        {
            label: "Productive Time / Day",
            value: `${productiveTimeHours} hr`,
            trend: weeklyLearningTime > 300 ? 'up' : 'down',
            trendValue: trendValues.productiveTime
        },
        {
            label: "Sessions Completed",
            value: sessionsCompletedThisWeek.toString(),
            trend: sessionsCompletedThisWeek > 5 ? 'up' : 'down',
            trendValue: trendValues.sessionsCompleted,
            suffix: "this week"
        },
        {
            label: "Subjects Studied",
            value: subjectsStudied.length.toString(),
            trend: subjectsStudied.length > 3 ? 'up' : 'down',
            trendValue: trendValues.subjectsStudied
        },
        {
            label: "Learning Streak",
            value: `${learningStreak} days`,
            trend: learningStreak > 0 ? 'up' : 'down',
            trendValue: trendValues.learningStreak
        },
        {
            label: "Total Learning Time",
            value: `${totalLearningTimeAllTime} min`,
            trend: 'up',
            trendValue: trendValues.totalTime
        },
        {
            label: "Today's Activity",
            value: `${platformActiveMinutesToday} min`,
            trend: platformActiveMinutesToday > 30 ? 'up' : 'down',
            trendValue: trendValues.todayActive
        },
        {
            label: "Focus Time",
            value: `${Math.round(platformActiveMinutesToday * 0.8)} min`,
            trend: 'up',
            trendValue: trendValues.focusTime
        },
        {
            label: "Distractions",
            value: exitAttemptsToday.toString(),
            trend: exitAttemptsToday === 0 ? 'up' : 'down',
            trendValue: trendValues.distractions,
            suffix: "exits"
        }
    ];

    // Add strong subject card if available
    if (data.strongSubject && data.strongSubject.scorePercentage > 0) {
        cards.push({
            label: "Strongest Subject",
            value: data.strongSubject.subject,
            trend: 'up',
            trendValue: `${data.strongSubject.scorePercentage}%`,
            suffix: "avg score",
            isClickable: true,
            onClick: () => setSelectedSubject({ data: data.strongSubject!, type: 'Strong' })
        } as any);
    }

    // Add weak subject card if available and different from strong subject
    if (data.weakSubject &&
        data.weakSubject.scorePercentage > 0 &&
        data.weakSubject.subject !== data.strongSubject?.subject) {
        cards.push({
            label: "Needs Attention",
            value: data.weakSubject.subject,
            trend: 'down',
            trendValue: `${data.weakSubject.scorePercentage}%`,
            suffix: "avg score",
            isClickable: true,
            onClick: () => setSelectedSubject({ data: data.weakSubject!, type: 'Weak' })
        } as any);
    }

    // if (data.strongSubject && data.strongSubject.scorePercentage > 0) {
    //     cards.push({
    //         label: "Strongest Subject",
    //         value: data.strongSubject.subject,
    //         trend: 'up',
    //         trendValue: `${data.strongSubject.scorePercentage}%`,
    //         suffix: "avg score",
    //         isClickable: true,
    //         onClick: () => setSelectedSubject({ data: data.strongSubject!, type: 'Strong' })
    //     } as any);
    // }

    // if (data.weakSubject && data.weakSubject.scorePercentage > 0 && data.weakSubject.subject !== data.strongSubject?.subject) {
    //     cards.push({
    //         label: "Needs Attention",
    //         value: data.weakSubject.subject,
    //         trend: 'down',
    //         trendValue: `${data.weakSubject.scorePercentage}%`,
    //         suffix: "avg score",
    //         isClickable: true,
    //         onClick: () => setSelectedSubject({ data: data.weakSubject!, type: 'Weak' })
    //     } as any);
    // }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Learning Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Track your progress and learning journey</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsParentalModalOpen(true)}
                        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">Parental Controls</span>
                    </button>
                </div>
            </div>

            {/* 3x3 Stats Grid - 8 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={(card as any).isClickable ? (card as any).onClick : undefined}
                        className={cn(
                            "bg-white rounded-xl p-5 border border-gray-200 transition-all",
                            (card as any).isClickable
                                ? "hover:border-blue-300 hover:shadow-md cursor-pointer hover:-translate-y-1"
                                : "hover:border-gray-300"
                        )}
                    >
                        {/* Label */}
                        <div className="text-sm text-gray-500 mb-2 flex justify-between items-center">
                            <span>{card.label}</span>
                            {(card as any).isClickable && (
                                <span className="text-xs text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Analytics <ChevronRight className="w-3 h-3" />
                                </span>
                            )}
                        </div>

                        {/* Value and Trend */}
                        <div className="flex items-end justify-between">
                            <div className="text-2xl font-semibold text-gray-900">
                                {card.value}
                                {card.suffix && (
                                    <span className="text-sm font-normal text-gray-400 ml-1">
                                        {card.suffix}
                                    </span>
                                )}
                            </div>

                            {card.trend && card.trendValue && (
                                <div className={cn(
                                    "flex items-center gap-1 text-sm",
                                    card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                )}>
                                    <span>{card.trend === 'up' ? '📈' : '📉'}</span>
                                    <span className="font-medium">{card.trendValue}</span>
                                    <span className="text-xs text-gray-400 ml-1">last week</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Chart Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2">
                    {(['activity', 'subjects', 'progress', 'insights'] as const).map((chart) => (
                        <button
                            key={chart}
                            onClick={() => setSelectedChart(chart)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors",
                                selectedChart === chart
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            {chart}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    {(['week', 'month', 'year'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setChartRange(range)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors",
                                chartRange === range
                                    ? "bg-cta-gold text-black"
                                    : "text-gray-500 hover:bg-gray-100"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chart Area */}
            <motion.div
                key={selectedChart}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        {selectedChart === 'activity' && (
                            <ComposedChart data={weeklyActivity}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="day" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="sessions" fill="#8884d8" name="Sessions" radius={[4, 4, 0, 0]} />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="minutes"
                                    stroke="#ff7300"
                                    name="Minutes"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </ComposedChart>
                        )}

                        {selectedChart === 'subjects' && (
                            <BarChart data={subjectPerformanceData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="subject" width={80} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="sessions" fill="#8884d8" name="Sessions" radius={[0, 4, 4, 0]} />
                                <Bar dataKey="timeSpent" fill="#82ca9d" name="Minutes" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        )}

                        {selectedChart === 'progress' && (
                            <AreaChart data={monthlyProgressData}>
                                <defs>
                                    <linearGradient id="colorMath" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="colorScience" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area type="monotone" dataKey="math" stroke="#8884d8" fillOpacity={1} fill="url(#colorMath)" />
                                <Area type="monotone" dataKey="science" stroke="#82ca9d" fillOpacity={1} fill="url(#colorScience)" />
                            </AreaChart>
                        )}

                        {selectedChart === 'insights' && (
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={insightsData}>
                                <PolarGrid stroke="#e0e0e0" />
                                <PolarAngleAxis dataKey="metric" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar
                                    name="Performance"
                                    dataKey="value"
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                    fillOpacity={0.6}
                                />
                                <Tooltip />
                            </RadarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Exits */}
                {recentExits && recentExits.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldAlert className="w-5 h-5 text-orange-500" />
                            <h3 className="font-semibold text-gray-900">Recent Distractions</h3>
                        </div>
                        <div className="space-y-3">
                            {recentExits.slice(0, 3).map((exit, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {exit.type === 'tab_switch_or_hide' ? 'Tab Switched/Minimized' : 'Tab Closed/Navigated'}
                                        </p>
                                        <p className="text-xs text-gray-500">{exit.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className={cn(
                        "bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6",
                        recentExits?.length ? "lg:col-span-2" : "lg:col-span-3"
                    )}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <Sparkles className="w-8 h-8 text-cta-gold mb-3" />
                            <h3 className="text-xl font-bold mb-2">Continue Learning</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                {learningStreak > 0
                                    ? `You're on a ${learningStreak}-day streak! Keep the momentum going.`
                                    : 'Start your learning journey today!'}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/companions"
                            className="flex items-center gap-2 bg-cta-gold text-black px-4 py-2 rounded-xl font-medium hover:bg-cta-gold/90 transition-colors"
                        >
                            Find Companion
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                        {currentFocusTopic && currentFocusTopic.companion_id && (
                            <Link
                                href={`/companions/${currentFocusTopic.companion_id}`}
                                className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl font-medium hover:bg-white/20 transition-colors"
                            >
                                Continue {currentFocusTopic.topic}
                                <Zap className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>

            <ParentalControlsModal
                isOpen={isParentalModalOpen}
                onClose={() => setIsParentalModalOpen(false)}
                initialEmail={parentalSettings?.parentEmail || null}
                initialNotify={parentalSettings?.notifyOnExit || false}
            />

            <SubjectAnalyticsModal
                isOpen={!!selectedSubject}
                onClose={() => setSelectedSubject(null)}
                subjectData={selectedSubject?.data || null}
                type={selectedSubject?.type || 'Strong'}
            />
        </motion.div>
    );
};

export default StudentDashboardClient;