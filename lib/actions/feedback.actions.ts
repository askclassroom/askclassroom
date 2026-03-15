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
