import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();
        if (!userId) return NextResponse.json({ error: 'No userId' }, { status: 400 });

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const today = format(new Date(), 'yyyy-MM-dd');

        // Upsert daily stats: increment active minutes if it exists, insert otherwise
        // We first check if the row exists to avoid UPSERT complexity with arrays
        const { data: existing } = await supabase
            .from('daily_learning_stats')
            .select('id, platform_active_minutes')
            .eq('user_id', userId)
            .eq('date', today)
            .maybeSingle();

        if (existing) {
            await supabase
                .from('daily_learning_stats')
                .update({
                    platform_active_minutes: (existing.platform_active_minutes || 0) + 1,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', existing.id);
        } else {
            await supabase
                .from('daily_learning_stats')
                .insert({
                    user_id: userId,
                    date: today,
                    platform_active_minutes: 1,
                    sessions_count: 0,
                    total_minutes: 0,
                    subjects_studied: [],
                });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Ping Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
