'use server';

import { createSupabaseAdmin } from '../supabase';
import { auth } from '@clerk/nextjs/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/** Use AI to generate a short heading that summarises the feedback */
async function generateFeedbackHeading(
    moodLabel: string,
    comment: string
): Promise<string> {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a concise assistant. Given a user feedback mood and optional comment, generate a very short heading (4–7 words) that captures the essence of the feedback. Return ONLY the heading — no punctuation at the end, no quotes, no extra text.',
                },
                {
                    role: 'user',
                    content: `Mood: ${moodLabel}\nComment: ${comment || '(no comment)'}`,
                },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.4,
            max_tokens: 30,
        });

        const heading = completion.choices[0]?.message?.content?.trim();
        return heading || `${moodLabel} feedback`;
    } catch (err) {
        console.error('Error generating feedback heading:', err);
        // Graceful fallback
        return `${moodLabel} feedback`;
    }
}

export async function submitFeedback({
    mood,
    moodLabel,
    comment,
}: {
    mood: number;       // 0–4 index
    moodLabel: string;  // "Very Bad" … "Excellent"
    comment: string;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    // Generate AI heading in parallel with nothing else — fast enough
    const heading = await generateFeedbackHeading(moodLabel, comment);

    const supabase = createSupabaseAdmin();

    const { error } = await supabase.from('feedback').insert({
        user_id: userId,
        mood,
        mood_label: moodLabel,
        comment: comment.trim() || null,
        heading,
    });

    if (error) {
        console.error('Error saving feedback:', error);
        throw new Error('Failed to submit feedback.');
    }

    return { success: true };
}

export type PublicFeedback = {
    id: string;
    heading: string | null;
    comment: string | null;
    mood: number;
    mood_label: string;
    user_name: string;
    user_image: string | null;
    created_at: string;
};

/** Fetch recent feedback for the public Testimonials section.
 *  User name + profile picture come from Clerk (not the users table). */
export async function getPublicFeedback(limit = 12): Promise<PublicFeedback[]> {
    const supabase = createSupabaseAdmin();

    // 1. Fetch raw feedback rows — no join needed
    const { data, error } = await supabase
        .from('feedback')
        .select('id, heading, comment, mood, mood_label, user_id, created_at')
        .not('comment', 'is', null)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching public feedback:', error);
        return [];
    }

    if (!data || data.length === 0) return [];

    // 2. Collect unique Clerk user IDs
    const uniqueUserIds = [...new Set(data.map((r: any) => r.user_id as string))];

    // 3. Batch-fetch Clerk profiles
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const clerkUsers = await client.users.getUserList({ userId: uniqueUserIds, limit: uniqueUserIds.length });

    // 4. Build a lookup map  userId → { name, imageUrl }
    const userMap = new Map<string, { name: string; imageUrl: string | null }>();
    for (const u of clerkUsers.data) {
        const name =
            `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() ||
            u.emailAddresses?.[0]?.emailAddress ||
            'Anonymous';
        userMap.set(u.id, { name, imageUrl: u.imageUrl ?? null });
    }

    // 5. Merge and return
    return data.map((row: any) => {
        const clerk = userMap.get(row.user_id);
        return {
            id: row.id,
            heading: row.heading,
            comment: row.comment,
            mood: row.mood,
            mood_label: row.mood_label,
            user_name: clerk?.name ?? 'Anonymous',
            user_image: clerk?.imageUrl ?? null,
            created_at: row.created_at,
        };
    });
}
