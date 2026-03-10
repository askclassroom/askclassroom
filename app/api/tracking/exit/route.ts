// import { NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';
// import { format } from 'date-fns';
// import nodemailer from 'nodemailer';

// // Helper function to send email via Gmail
// async function sendParentalEmail(parentEmail: string, exitType: string, path: string) {
//     // Uses environment variables for authentication
//     // Create an app password in your Gmail account for this!
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.GMAIL_USER, // e.g. yourmail@gmail.com
//             pass: process.env.GMAIL_APP_PASSWORD, // your 16-char app password
//         },
//     });

//     const time = new Date().toLocaleString();
//     let readableExitType = 'left the platform';
//     if (exitType === 'tab_switch_or_hide') readableExitType = 'switched tabs or minimized the browser';
//     if (exitType === 'tab_close_or_navigate') readableExitType = 'closed the tab or navigated away';

//     const mailOptions = {
//         from: process.env.GMAIL_USER,
//         to: parentEmail,
//         subject: `AskClassroom: Platform Exit Detected`,
//         html: `
//       <div style="font-family: Arial, sans-serif; padding: 20px;">
//         <h2>AskClassroom Activity Alert</h2>
//         <p>This is an automated notification to inform you that your child <strong>${readableExitType}</strong>.</p>
//         <p><strong>Time:</strong> ${time}</p>
//         <p><strong>Last Activity Page:</strong> ${path || 'Unknown'}</p>
//         <br/>
//         <p style="color: #666; font-size: 12px;">You are receiving this because Parental Notifications are enabled on your AskClassroom account.</p>
//       </div>
//     `,
//     };

//     await transporter.sendMail(mailOptions);
// }

// export async function POST(req: Request) {
//     try {
//         const textData = await req.text();
//         const { userId, exitType, path, isImmediate } = JSON.parse(textData);

//         if (!userId) return NextResponse.json({ error: 'No userId' }, { status: 400 });

//         const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//         const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
//         const supabase = createClient(supabaseUrl, supabaseKey);

//         if (isImmediate) {
//             const exitTime = Date.now();

//             // For page close/reload, we wait 30 seconds on the server.
//             // If they reload, they'll immediately send a new ping within 1-2 seconds.
//             setTimeout(async () => {
//                 const today = format(new Date(), 'yyyy-MM-dd');
//                 const { data: stats } = await supabase
//                     .from('daily_learning_stats')
//                     .select('updated_at')
//                     .eq('user_id', userId)
//                     .eq('date', today)
//                     .maybeSingle();

//                 if (stats && stats.updated_at) {
//                     const lastPingTime = new Date(stats.updated_at).getTime();
//                     // If they pinged AFTER the exit event, it was just a reload or quick return!
//                     if (lastPingTime > exitTime) {
//                         console.log('User returned within 30s (reload). Ignoring exit.');
//                         return;
//                     }
//                 }

//                 // If no ping received, proceed to process exit.
//                 await processExit(userId, exitType, path, supabase);
//             }, 30000);

//             return NextResponse.json({ success: true, pending: true });
//         } else {
//             // Tab switch waited 30s on the client already, process immediately
//             await processExit(userId, exitType, path, supabase);
//             return NextResponse.json({ success: true });
//         }

//     } catch (error) {
//         console.error('Exit tracking error:', error);
//         return NextResponse.json({ error: 'Internal error' }, { status: 500 });
//     }
// }

// async function processExit(userId: string, exitType: string, path: string, supabase: any) {
//     // 1. Log the exit 
//     await supabase.from('platform_exits').insert({
//         user_id: userId,
//         exit_type: exitType,
//         last_path: path || 'unknown',
//     });

//     // 2. Check parental settings for email notification
//     const { data: settings } = await supabase
//         .from('parental_settings')
//         .select('parent_email, notify_on_exit')
//         .eq('user_id', userId)
//         .maybeSingle();

//     if (settings && settings.notify_on_exit && settings.parent_email) {
//         sendParentalEmail(settings.parent_email, exitType, path).catch(err => {
//             console.error('Failed to send exit email:', err);
//         });
//     }
// }

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import nodemailer from 'nodemailer';

// Helper function to send email via Gmail
async function sendParentalEmail(parentEmail: string, exitType: string, path: string, userId: string) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const time = new Date().toLocaleString();
        let readableExitType = 'left the platform';
        if (exitType === 'tab_switch_or_hide') readableExitType = 'switched tabs or minimized the browser for over 30 seconds';
        if (exitType === 'tab_close_or_navigate') readableExitType = 'closed the tab or navigated away';

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: parentEmail,
            subject: `AskClassroom: Your child has left the platform`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                    <h2 style="color: #333;">AskClassroom Activity Alert</h2>
                    <p>This is an automated notification to inform you that your child has:</p>
                    <p><strong>${readableExitType}</strong></p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p><strong>Time:</strong> ${time}</p>
                    <p><strong>Last Activity Page:</strong> ${path || 'Unknown'}</p>
                    <p><strong>User ID:</strong> ${userId}</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        You are receiving this because Parental Notifications are enabled on your AskClassroom account.
                        To disable these notifications, visit your parental control settings.
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Parental email sent successfully to', parentEmail);
    } catch (error) {
        console.error('Failed to send parental email:', error);
    }
}

export async function POST(req: Request) {
    try {
        const textData = await req.text();
        const { userId, exitType, path, isImmediate } = JSON.parse(textData);

        if (!userId) {
            return NextResponse.json({ error: 'No userId' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // For immediate exits (tab close/reload), we wait 30 seconds
        if (isImmediate) {
            const exitTime = Date.now();

            // Store this pending exit in a Map or database
            // For simplicity, we'll use a setTimeout
            setTimeout(async () => {
                try {
                    // Check if user has been active in the last 30 seconds
                    const today = format(new Date(), 'yyyy-MM-dd');

                    // Get the most recent ping from daily_learning_stats
                    const { data: stats } = await supabase
                        .from('daily_learning_stats')
                        .select('updated_at')
                        .eq('user_id', userId)
                        .eq('date', today)
                        .maybeSingle();

                    if (stats && stats.updated_at) {
                        const lastPingTime = new Date(stats.updated_at).getTime();
                        // If they pinged AFTER the exit event, it was just a reload
                        if (lastPingTime > exitTime) {
                            console.log('User returned within 30s (reload). Ignoring exit.');
                            return;
                        }
                    }

                    // Also check platform_exits for recent activity
                    const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
                    const { data: recentExits } = await supabase
                        .from('platform_exits')
                        .select('id')
                        .eq('user_id', userId)
                        .eq('exit_type', exitType)
                        .gte('created_at', fiveSecondsAgo)
                        .limit(1);

                    if (recentExits && recentExits.length > 0) {
                        console.log('Exit already logged recently, skipping');
                        return;
                    }

                    // No recent activity, log the exit and send email
                    await processExit(userId, exitType, path, supabase);

                } catch (error) {
                    console.error('Error in delayed exit processing:', error);
                }
            }, 30000);

            return NextResponse.json({ success: true, pending: true });
        } else {
            // Tab switch - already waited 30s on client, process immediately
            await processExit(userId, exitType, path, supabase);
            return NextResponse.json({ success: true });
        }

    } catch (error) {
        console.error('Exit tracking error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

async function processExit(userId: string, exitType: string, path: string, supabase: any) {
    try {
        // 1. Log the exit
        const { error: insertError } = await supabase
            .from('platform_exits')
            .insert({
                user_id: userId,
                exit_type: exitType,
                last_path: path || 'unknown',
            });

        if (insertError) {
            console.error('Failed to log exit:', insertError);
            return;
        }

        // 2. Check parental settings for email notification
        const { data: settings, error: settingsError } = await supabase
            .from('parental_settings')
            .select('parent_email, notify_on_exit')
            .eq('user_id', userId)
            .maybeSingle();

        if (settingsError) {
            console.error('Failed to fetch parental settings:', settingsError);
        }

        // 3. Send email if enabled
        if (settings && settings.notify_on_exit && settings.parent_email) {
            await sendParentalEmail(settings.parent_email, exitType, path, userId);
        } else {
            console.log('Email not sent: settings missing or notifications disabled');
        }

    } catch (error) {
        console.error('Error in processExit:', error);
    }
}