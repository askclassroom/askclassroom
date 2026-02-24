'use server'

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { subDays, startOfDay, endOfDay, differenceInDays, format } from "date-fns";

export type StudentDashboardData = {
    weeklyLearningTime: number; // in minutes
    sessionsCompletedThisWeek: number;
    subjectsStudied: string[];
    currentFocusTopic: {
        subject: string;
        topic: string;
    } | null;
    learningStreak: number; // days
    engagementTrend: 'up' | 'stable' | 'down';
    weeklyActivity: { day: string; minutes: number }[];
    totalSessionsAllTime: number;
    totalLearningTimeAllTime: number; // in minutes
    favoriteSubject: string;
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

    return data || null;
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
        favoriteSubject
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
        getFavoriteSubject(userId)
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
        favoriteSubject
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