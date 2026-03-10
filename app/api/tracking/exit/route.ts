import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Helper function to send email via Gmail
async function sendParentalEmail(parentEmail: string, exitType: string, path: string) {
    // Uses environment variables for authentication
    // Create an app password in your Gmail account for this!
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER, // e.g. yourmail@gmail.com
            pass: process.env.GMAIL_APP_PASSWORD, // your 16-char app password
        },
    });

    const time = new Date().toLocaleString();
    let readableExitType = 'left the platform';
    if (exitType === 'tab_switch_or_hide') readableExitType = 'switched tabs or minimized the browser';
    if (exitType === 'tab_close_or_navigate') readableExitType = 'closed the tab or navigated away';

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: parentEmail,
        subject: `AskClassroom: Platform Exit Detected`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>AskClassroom Activity Alert</h2>
        <p>This is an automated notification to inform you that your child <strong>${readableExitType}</strong>.</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Last Activity Page:</strong> ${path || 'Unknown'}</p>
        <br/>
        <p style="color: #666; font-size: 12px;">You are receiving this because Parental Notifications are enabled on your AskClassroom account.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
}

export async function POST(req: Request) {
    try {
        // navigator.sendBeacon sends raw text or form data if we are not careful
        // Safely parse it depending on content type
        const textData = await req.text();
        const { userId, exitType, path } = JSON.parse(textData);

        if (!userId) return NextResponse.json({ error: 'No userId' }, { status: 400 });

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Log the exit 
        await supabase.from('platform_exits').insert({
            user_id: userId,
            exit_type: exitType,
            last_path: path || 'unknown',
        });

        // 2. Check parental settings for email notification
        const { data: settings } = await supabase
            .from('parental_settings')
            .select('parent_email, notify_on_exit, distraction_threshold')
            .eq('user_id', userId)
            .maybeSingle();

        if (settings && settings.notify_on_exit && settings.parent_email) {
            const threshold = settings.distraction_threshold || 5;

            // 3. Count today's exits to see if it meets threshold
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { count: exitCount } = await supabase
                .from('platform_exits')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .gte('created_at', today.toISOString());

            // Only send the email if the exit count is EXACTLY a multiple of the threshold
            // This prevents spamming on every exit and fulfills "after each X distractions"
            if (exitCount && exitCount > 0 && exitCount % threshold === 0) {
                // Send email (don't await it so we return faster to the beacon)
                sendParentalEmail(settings.parent_email, exitType, path).catch(err => {
                    console.error('Failed to send exit email:', err);
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Exit tracking error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
