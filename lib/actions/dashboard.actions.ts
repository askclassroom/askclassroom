'use server'

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { createClient } from "@supabase/supabase-js";
import { subDays, startOfDay, endOfDay, differenceInDays, format } from "date-fns";

export type SubjectAnalytics = {
    subject: string;
    totalTimeMinutes: number;
    sessionsCount: number;
    averageQuizScore: number;
    quizzesTaken: number;
    scorePercentage: number;
};

export type StudentDashboardData = {
    weeklyLearningTime: number; // in minutes
    sessionsCompletedThisWeek: number;
    subjectsStudied: string[];
    currentFocusTopic: {
        subject: string;
        topic: string;
        companion_id?: string | null;
    } | null;
    learningStreak: number; // days
    engagementTrend: 'up' | 'stable' | 'down';
    weeklyActivity: { day: string; minutes: number }[];
    totalSessionsAllTime: number;
    totalLearningTimeAllTime: number; // in minutes
    favoriteSubject: string;

    // Subject Analytics
    strongSubject: SubjectAnalytics | null;
    weakSubject: SubjectAnalytics | null;

    // Parental Controls Data
    platformActiveMinutesToday: number;
    exitAttemptsToday: number;
    parentalSettings: { parentEmail: string | null; notifyOnExit: boolean } | null;
    recentExits: { time: string; type: string }[];
};

// Calculate learning streak
const calculateLearningStreak = async (userId: string): Promise<number> => {
    const supabase = createSupabaseClient();

    const { data } = await supabase
        .from('daily_learning_stats')
        .select('date, total_minutes')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(30);

    if (!data || data.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < data.length; i++) {
        const statDate = new Date(data[i].date);
        statDate.setHours(0, 0, 0, 0);

        const dayDiff = differenceInDays(currentDate, statDate);

        if (i === 0) {
            // Check if there's activity today or yesterday
            if (dayDiff === 0 || dayDiff === 1) {
                streak = 1;
                currentDate = statDate;
            } else {
                break;
            }
        } else if (dayDiff === 1) {
            streak++;
            currentDate = statDate;
        } else {
            break;
        }
    }

    return streak;
};

// Calculate engagement trend
const calculateEngagementTrend = async (userId: string): Promise<'up' | 'stable' | 'down'> => {
    const supabase = createSupabaseClient();

    const thisWeekStart = subDays(new Date(), 7);
    const lastWeekStart = subDays(new Date(), 14);
    const lastWeekEnd = subDays(new Date(), 7);

    const { data: thisWeekData } = await supabase
        .from('daily_learning_stats')
        .select('total_minutes')
        .eq('user_id', userId)
        .gte('date', startOfDay(thisWeekStart).toISOString().split('T')[0]);

    const { data: lastWeekData } = await supabase
        .from('daily_learning_stats')
        .select('total_minutes')
        .eq('user_id', userId)
        .gte('date', startOfDay(lastWeekStart).toISOString().split('T')[0])
        .lt('date', startOfDay(lastWeekEnd).toISOString().split('T')[0]);

    const thisWeekTotal = thisWeekData?.reduce((sum, day) => sum + (day.total_minutes || 0), 0) || 0;
    const lastWeekTotal = lastWeekData?.reduce((sum, day) => sum + (day.total_minutes || 0), 0) || 0;

    if (lastWeekTotal === 0) return thisWeekTotal > 0 ? 'up' : 'stable';

    const percentChange = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;

    if (percentChange > 10) return 'up';
    if (percentChange < -10) return 'down';
    return 'stable';
};

// Get current focus topic
const getCurrentFocusTopic = async (userId: string) => {
    const supabase = createSupabaseClient();

    const { data } = await supabase
        .from('focus_topics')
        .select('subject, topic')
        .eq('user_id', userId)
        .eq('is_current', true)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!data) return null;

    const { data: sessionData } = await supabase
        .from('learning_sessions')
        .select('companion_id')
        .eq('user_id', userId)
        .eq('subject', data.subject)
        .eq('topic', data.topic)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    return {
        ...data,
        companion_id: sessionData?.companion_id || null
    };
};

// Get weekly learning time
const getWeeklyLearningTime = async (userId: string): Promise<number> => {
    const supabase = createSupabaseClient();
    const weekAgo = subDays(new Date(), 7);

    const { data } = await supabase
        .from('learning_sessions')
        .select('duration_seconds')
        .eq('user_id', userId)
        .gte('started_at', startOfDay(weekAgo).toISOString())
        .not('duration_seconds', 'is', null);

    const totalSeconds = data?.reduce((sum, session) => sum + (session.duration_seconds || 0), 0) || 0;
    return Math.round(totalSeconds / 60); // Convert to minutes
};

// Get weekly activity data for chart
const getWeeklyActivity = async (userId: string): Promise<{ day: string; minutes: number }[]> => {
    const supabase = createSupabaseClient();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result: { day: string; minutes: number }[] = [];

    for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayName = days[date.getDay()];

        const { data } = await supabase
            .from('daily_learning_stats')
            .select('total_minutes')
            .eq('user_id', userId)
            .eq('date', dateStr)
            .maybeSingle();

        result.push({
            day: dayName,
            minutes: data?.total_minutes || 0
        });
    }

    return result;
};

// Get sessions completed this week
const getSessionsCompletedThisWeek = async (userId: string): Promise<number> => {
    const supabase = createSupabaseClient();
    const weekAgo = subDays(new Date(), 7);

    const { count } = await supabase
        .from('learning_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('started_at', startOfDay(weekAgo).toISOString())
        .not('ended_at', 'is', null);

    return count || 0;
};

// Get total sessions all time
const getTotalSessionsAllTime = async (userId: string): Promise<number> => {
    const supabase = createSupabaseClient();

    const { count } = await supabase
        .from('learning_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .not('ended_at', 'is', null);

    return count || 0;
};

// Get total learning time all time
const getTotalLearningTimeAllTime = async (userId: string): Promise<number> => {
    const supabase = createSupabaseClient();

    const { data } = await supabase
        .from('learning_sessions')
        .select('duration_seconds')
        .eq('user_id', userId)
        .not('duration_seconds', 'is', null);

    const totalSeconds = data?.reduce((sum, session) => sum + (session.duration_seconds || 0), 0) || 0;
    return Math.round(totalSeconds / 60);
};

// Get favorite subject
const getFavoriteSubject = async (userId: string): Promise<string> => {
    const supabase = createSupabaseClient();

    const { data } = await supabase
        .from('learning_sessions')
        .select('subject')
        .eq('user_id', userId)
        .not('subject', 'is', null);

    if (!data || data.length === 0) return 'Not enough data';

    const subjectCounts: Record<string, number> = {};
    data.forEach(session => {
        if (session.subject) {
            subjectCounts[session.subject] = (subjectCounts[session.subject] || 0) + 1;
        }
    });

    let favorite = '';
    let maxCount = 0;

    Object.entries(subjectCounts).forEach(([subject, count]) => {
        if (count > maxCount) {
            maxCount = count;
            favorite = subject;
        }
    });

    return favorite || 'Various';
};

// Get subjects studied this week
const getSubjectsStudiedThisWeek = async (userId: string): Promise<string[]> => {
    const supabase = createSupabaseClient();
    const weekAgo = subDays(new Date(), 7);

    const { data } = await supabase
        .from('learning_sessions')
        .select('subject')
        .eq('user_id', userId)
        .gte('started_at', startOfDay(weekAgo).toISOString())
        .not('subject', 'is', null);

    const subjects = new Set(data?.map(s => s.subject).filter(Boolean));
    return Array.from(subjects);
};

// Parental Controls Functions
const getPlatformActiveMinutesToday = async (userId: string): Promise<number> => {
    const supabase = createSupabaseClient();
    const today = format(new Date(), 'yyyy-MM-dd');

    const { data } = await supabase
        .from('daily_learning_stats')
        .select('platform_active_minutes')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle();

    return data?.platform_active_minutes || 0;
};

const getExitAttemptsToday = async (userId: string) => {
    const supabase = createSupabaseClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data } = await supabase
        .from('platform_exits')
        .select('created_at, exit_type')
        .eq('user_id', userId)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

    return {
        count: data?.length || 0,
        recent: data?.slice(0, 5).map(exit => ({
            time: new Date(exit.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: exit.exit_type
        })) || []
    };
};

const getParentalSettings = async (userId: string) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data } = await supabase
        .from('parental_settings')
        .select('parent_email, notify_on_exit')
        .eq('user_id', userId)
        .maybeSingle();

    return data ? {
        parentEmail: data.parent_email,
        notifyOnExit: data.notify_on_exit
    } : null;
};

export const updateParentalSettings = async (userId: string, email: string, notify: boolean) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from('parental_settings').upsert({
        user_id: userId,
        parent_email: email,
        notify_on_exit: notify,
        updated_at: new Date().toISOString()
    }, {
        onConflict: 'user_id'
    });

    if (error) {
        console.error("Failed to update parental settings:", error);
        throw new Error(error.message);
    }
};

// Get Subject Analytics (Strong / Weak Subjects)
// const getSubjectAnalytics = async (userId: string): Promise<{ strongSubject: SubjectAnalytics | null, weakSubject: SubjectAnalytics | null }> => {
//     const supabase = createSupabaseClient();

//     // Fetch all learning sessions with subjects
//     const { data: sessions } = await supabase
//         .from('learning_sessions')
//         .select('id, subject, duration_seconds')
//         .eq('user_id', userId)
//         .not('subject', 'is', null);

//     if (!sessions || sessions.length === 0) {
//         return { strongSubject: null, weakSubject: null };
//     }

//     // Fetch quizzes linked to these sessions
//     const { data: quizzes } = await supabase
//         .from('quizzes')
//         .select('score, status, session_id')
//         .eq('status', 'completed');

//     // Group data by subject
//     const subjectMap: Record<string, SubjectAnalytics> = {};

//     sessions.forEach(session => {
//         if (!subjectMap[session.subject]) {
//             subjectMap[session.subject] = {
//                 subject: session.subject,
//                 totalTimeMinutes: 0,
//                 sessionsCount: 0,
//                 averageQuizScore: 0,
//                 quizzesTaken: 0,
//                 scorePercentage: 0
//             };
//         }
//         subjectMap[session.subject].totalTimeMinutes += Math.round((session.duration_seconds || 0) / 60);
//         subjectMap[session.subject].sessionsCount += 1;
//     });

//     // Add quiz scores
//     if (quizzes) {
//         quizzes.forEach(quiz => {
//             const session = sessions.find(s => s.id === quiz.session_id);
//             if (session && session.subject && typeof quiz.score === 'number' && subjectMap[session.subject]) {
//                 subjectMap[session.subject].averageQuizScore += quiz.score;
//                 subjectMap[session.subject].quizzesTaken += 1;
//             }
//         });
//     }

//     // Calculate averages and percentages
//     Object.values(subjectMap).forEach(stat => {
//         if (stat.quizzesTaken > 0) {
//             stat.averageQuizScore = stat.averageQuizScore / stat.quizzesTaken;
//             // Assuming max score is 5 for multiple choice questions
//             stat.scorePercentage = Math.round((stat.averageQuizScore / 5) * 100);
//         } else {
//             stat.averageQuizScore = 0;
//             stat.scorePercentage = 0;
//         }
//     });

//     const subjectsArray = Object.values(subjectMap);
//     if (subjectsArray.length === 0) return { strongSubject: null, weakSubject: null };

//     // Determine strong/weak by a combination metric (or just score percentage / time)
//     // Formula: ScorePercentage * 0.7 + (Time / MaxTime) * 30
//     const maxTime = Math.max(...subjectsArray.map(s => s.totalTimeMinutes), 1);

//     // Sort logic
//     subjectsArray.sort((a, b) => {
//         const scoreA = (a.scorePercentage * 0.7) + ((a.totalTimeMinutes / maxTime) * 100 * 0.3);
//         const scoreB = (b.scorePercentage * 0.7) + ((b.totalTimeMinutes / maxTime) * 100 * 0.3);
//         return scoreB - scoreA; // Descending mapping
//     });

//     const strongSubject = subjectsArray.length > 0 ? subjectsArray[0] : null;
//     const weakSubject = subjectsArray.length > 1 ? subjectsArray[subjectsArray.length - 1] : subjectsArray.length > 0 ? subjectsArray[0] : null;

//     return { strongSubject, weakSubject };
// };

// Get Subject Analytics (Strong / Weak Subjects)
const getSubjectAnalytics = async (userId: string): Promise<{ strongSubject: SubjectAnalytics | null, weakSubject: SubjectAnalytics | null }> => {
    const supabase = createSupabaseClient();

    // Fetch all learning sessions with subjects
    const { data: sessions } = await supabase
        .from('learning_sessions')
        .select('id, subject, duration_seconds')
        .eq('user_id', userId)
        .not('subject', 'is', null);

    if (!sessions || sessions.length === 0) {
        return { strongSubject: null, weakSubject: null };
    }

    // First get all session_history ids for this user
    const { data: sessionHistory } = await supabase
        .from('session_history')
        .select('id')
        .eq('user_id', userId);

    const sessionHistoryIds = sessionHistory?.map(sh => sh.id) || [];

    // Fetch quizzes linked to session_history
    const { data: quizzes } = await supabase
        .from('quizzes')
        .select('score, session_id')
        .eq('status', 'completed')
        .in('session_id', sessionHistoryIds);

    // Group data by subject
    const subjectMap: Record<string, SubjectAnalytics> = {};

    sessions.forEach(session => {
        if (!subjectMap[session.subject]) {
            subjectMap[session.subject] = {
                subject: session.subject,
                totalTimeMinutes: 0,
                sessionsCount: 0,
                averageQuizScore: 0,
                quizzesTaken: 0,
                scorePercentage: 0
            };
        }
        subjectMap[session.subject].totalTimeMinutes += Math.round((session.duration_seconds || 0) / 60);
        subjectMap[session.subject].sessionsCount += 1;
    });

    // Add quiz scores
    if (quizzes && quizzes.length > 0) {
        // We need to map quizzes back to subjects
        // Since quizzes don't directly have subject, we need to get the companion from session_history
        const { data: sessionsWithCompanions } = await supabase
            .from('session_history')
            .select('id, companion_id')
            .eq('user_id', userId)
            .in('id', sessionHistoryIds);

        // Get companions with their subjects
        const companionIds = sessionsWithCompanions?.map(sc => sc.companion_id).filter(Boolean) || [];
        const { data: companions } = await supabase
            .from('companions')
            .select('id, subject')
            .in('id', companionIds);

        // Create a map of session_id to subject
        const sessionToSubject: Record<string, string> = {};
        sessionsWithCompanions?.forEach(sc => {
            const companion = companions?.find(c => c.id === sc.companion_id);
            if (companion?.subject) {
                sessionToSubject[sc.id] = companion.subject;
            }
        });

        // Now add quiz scores to subjects
        quizzes.forEach(quiz => {
            const subject = sessionToSubject[quiz.session_id];
            if (subject && subjectMap[subject] && typeof quiz.score === 'number') {
                subjectMap[subject].averageQuizScore += quiz.score;
                subjectMap[subject].quizzesTaken += 1;
            }
        });
    }

    // Calculate averages and percentages
    Object.values(subjectMap).forEach(stat => {
        if (stat.quizzesTaken > 0) {
            stat.averageQuizScore = stat.averageQuizScore / stat.quizzesTaken;
            // Assuming max score is 5 for multiple choice questions
            stat.scorePercentage = Math.min(100, Math.round((stat.averageQuizScore / 5) * 100));
        } else {
            // If no quizzes, estimate based on time spent
            stat.averageQuizScore = 0;
            stat.scorePercentage = Math.min(100, Math.round((stat.totalTimeMinutes / 120) * 100)); // Assume 120 mins = 100%
        }
    });

    const subjectsArray = Object.values(subjectMap);
    if (subjectsArray.length === 0) return { strongSubject: null, weakSubject: null };

    // Determine strong/weak by a combination metric
    const maxTime = Math.max(...subjectsArray.map(s => s.totalTimeMinutes), 1);

    // Sort by score percentage (with time as tiebreaker)
    subjectsArray.sort((a, b) => {
        // Use scorePercentage as primary metric, with time as secondary
        if (a.scorePercentage !== b.scorePercentage) {
            return b.scorePercentage - a.scorePercentage;
        }
        return b.totalTimeMinutes - a.totalTimeMinutes;
    });

    const strongSubject = subjectsArray.length > 0 ? subjectsArray[0] : null;
    const weakSubject = subjectsArray.length > 1 ? subjectsArray[subjectsArray.length - 1] :
        subjectsArray.length > 0 ? subjectsArray[0] : null;

    return { strongSubject, weakSubject };
};

// Main function to get student dashboard data
export const getStudentDashboardData = async (): Promise<StudentDashboardData | null> => {
    const { userId } = await auth();
    if (!userId) return null;

    // Fetch all metrics
    const [
        weeklyLearningTime,
        sessionsCompletedThisWeek,
        subjectsStudied,
        currentFocusTopic,
        learningStreak,
        engagementTrend,
        weeklyActivity,
        totalSessionsAllTime,
        totalLearningTimeAllTime,
        favoriteSubject,
        platformActiveMinutesToday,
        exitData,
        parentalSettings,
        subjectAnalytics
    ] = await Promise.all([
        getWeeklyLearningTime(userId),
        getSessionsCompletedThisWeek(userId),
        getSubjectsStudiedThisWeek(userId),
        getCurrentFocusTopic(userId),
        calculateLearningStreak(userId),
        calculateEngagementTrend(userId),
        getWeeklyActivity(userId),
        getTotalSessionsAllTime(userId),
        getTotalLearningTimeAllTime(userId),
        getFavoriteSubject(userId),
        getPlatformActiveMinutesToday(userId),
        getExitAttemptsToday(userId),
        getParentalSettings(userId),
        getSubjectAnalytics(userId)
    ]);

    return {
        weeklyLearningTime,
        sessionsCompletedThisWeek,
        subjectsStudied,
        currentFocusTopic,
        learningStreak,
        engagementTrend,
        weeklyActivity,
        totalSessionsAllTime,
        totalLearningTimeAllTime,
        favoriteSubject,
        strongSubject: subjectAnalytics.strongSubject,
        weakSubject: subjectAnalytics.weakSubject,
        platformActiveMinutesToday: platformActiveMinutesToday,
        exitAttemptsToday: exitData.count,
        recentExits: exitData.recent,
        parentalSettings
    };
};

// Update session end with duration
export const completeLearningSession = async (
    companionId: string,
    subject?: string,
    topic?: string,
    durationSeconds?: number
) => {
    const { userId } = await auth();
    if (!userId) return;

    const supabase = createSupabaseClient();

    // Insert into learning_sessions
    const { error: sessionError } = await supabase.from('learning_sessions')
        .insert({
            companion_id: companionId,
            user_id: userId,
            subject,
            topic,
            started_at: new Date(Date.now() - (durationSeconds || 0) * 1000).toISOString(),
            ended_at: new Date().toISOString(),
            duration_seconds: durationSeconds
        });

    if (sessionError) throw new Error(sessionError.message);

    // Update daily stats
    const today = format(new Date(), 'yyyy-MM-dd');
    const minutes = Math.round((durationSeconds || 0) / 60);

    // Check if entry exists for today
    const { data: existing } = await supabase
        .from('daily_learning_stats')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle();

    if (existing) {
        // Update existing
        await supabase
            .from('daily_learning_stats')
            .update({
                total_minutes: existing.total_minutes + minutes,
                sessions_count: existing.sessions_count + 1,
                subjects_studied: subject && !existing.subjects_studied.includes(subject)
                    ? [...existing.subjects_studied, subject]
                    : existing.subjects_studied,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
    } else {
        // Insert new
        await supabase
            .from('daily_learning_stats')
            .insert({
                user_id: userId,
                date: today,
                total_minutes: minutes,
                sessions_count: 1,
                subjects_studied: subject ? [subject] : []
            });
    }

    // Update focus topic if needed
    if (subject && topic) {
        // Check if this topic is already a focus
        const { data: existingFocus } = await supabase
            .from('focus_topics')
            .select('*')
            .eq('user_id', userId)
            .eq('subject', subject)
            .eq('topic', topic)
            .eq('is_current', true)
            .maybeSingle();

        if (!existingFocus) {
            // Set all other focus topics to not current
            await supabase
                .from('focus_topics')
                .update({ is_current: false })
                .eq('user_id', userId)
                .eq('is_current', true);

            // Insert new focus topic
            await supabase
                .from('focus_topics')
                .insert({
                    user_id: userId,
                    subject,
                    topic,
                    is_current: true
                });
        }
    }
};