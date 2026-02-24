'use server'

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { revalidatePath } from "next/cache";
import { GetAllCompanions, CreateCompanion, SavedMessage } from "@/types";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    const supabase = createSupabaseClient();

    let query = supabase.from('companions').select();

    if (subject && topic) {
        query = query.ilike('subject', `%${subject}%`)
            .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    } else if (subject) {
        query = query.ilike('subject', `%${subject}%`)
    } else if (topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companions, error } = await query;

    if (error) throw new Error(error.message);

    return companions;
}


export const createCompanion = async (FormData: CreateCompanion) => {
    const { userId: author } = await auth();
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.from('companions').insert({
        ...FormData,
        author
    }).select();

    if (error || !data) throw new Error(error?.message || "Faled to create a companion");

    return data[0];
}

export const getCompanion = async (id: string) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('id', id);

    if (error) return console.log(error);

    return data[0];
}

// export const addToSessionHistory = async (companionId: string) => {
//     const { userId } = await auth();
//     const supabase = createSupabaseClient();
//     const { data, error } = await supabase.from('session_history')
//         .insert({
//             companion_id: companionId,
//             user_id: userId,
//         })

//     if (error) throw new Error(error.message);

//     return data;
// }

export const getRecentSessions = async (limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw new Error(error.message);

    return data.map(({ companions }) => companions);
}

export const getUserSessions = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw new Error(error.message);

    return data.map(({ companions }) => companions);
}

export const getUserCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('author', userId)

    if (error) throw new Error(error.message);

    return data;
}

export const newCompanionPermissions = async () => {
    const { userId, has } = await auth();
    const supabase = createSupabaseClient();

    let limit = 0;

    if (has({ plan: 'pro' })) {
        // return true;
        limit = 15;
    } else if (has({ feature: "3_companion_limit" })) {
        limit = 15;
    } else if (has({ feature: "10_companion_limit" })) {
        limit = 15;
    }

    const { data, error } = await supabase
        .from('companions')
        .select('id', { count: 'exact' })
        .eq('author', userId)

    if (error) throw new Error(error.message);

    const companionCount = data?.length;

    if (companionCount >= limit) {
        return false
    } else {
        return true;
    }
}

// Bookmarks
export const addBookmark = async (companionId: string, path: string) => {
    const { userId } = await auth();
    if (!userId) return;
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from("bookmarks").insert({
        companion_id: companionId,
        user_id: userId,
    });
    if (error) {
        throw new Error(error.message);
    }
    // Revalidate the path to force a re-render of the page

    revalidatePath(path);
    return data;
};

export const removeBookmark = async (companionId: string, path: string) => {
    const { userId } = await auth();
    if (!userId) return;
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("companion_id", companionId)
        .eq("user_id", userId);
    if (error) {
        throw new Error(error.message);
    }
    revalidatePath(path);
    return data;
};

// It's almost the same as getUserCompanions, but it's for the bookmarked companions
export const getBookmarkedCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("bookmarks")
        .select(`companions:companion_id (*)`) // Notice the (*) to get all the companion data
        .eq("user_id", userId);
    if (error) {
        throw new Error(error.message);
    }
    // We don't need the bookmarks data, so we return only the companions
    return data.map(({ companions }) => companions);
};

export const saveSessionTranscript = async (sessionId: string, transcript: SavedMessage[]) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .update({
            transcript: transcript,
            // updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select();

    if (error) {
        console.error('Error saving transcript:', error);
        throw new Error(error.message);
    }
    return data;
}

// export const createSessionHistory = async (companionId: string): Promise<string> => {
//   const { userId } = await auth();
//   if (!userId) throw new Error('User not authenticated');

//   const supabase = createSupabaseClient();

//   const { data, error } = await supabase
//     .from('session_history')
//     .insert({
//       companion_id: companionId,
//       user_id: userId,
//       transcript: [] // Initialize empty transcript
//     })
//     .select('id')
//     .single();

//   if (error) {
//     console.error('Error creating session history:', error);
//     throw new Error(error.message);
//   }

//   return data.id;
// };

export const createSessionHistory = async (companionId: string): Promise<string> => {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId,
            transcript: [] // Initialize empty transcript
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error creating session history:', error);
        throw new Error(error.message);
    }

    return data.id;
};
/**
 * Update the addToSessionHistory function to return the session ID
 */
export const addToSessionHistory = async (companionId: string): Promise<string> => {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId,
            transcript: [] // Initialize empty transcript
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error adding to session history:', error);
        throw new Error(error.message);
    }

    return data.id;
};

/**
 * Get session transcript by session ID
 */

export const getSessionTranscript = async (sessionId: string) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('session_history')
        .select('created_at, transcript, transcript_summary, companions(*)')
        .eq('id', sessionId)
        .single();

    if (error) {
        console.error('Error fetching transcript:', error);
        throw new Error(error.message);
    }

    return data;
};

/**
 * Get all sessions with transcripts for a user
 */

export const getUserSessionsWithTranscripts = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('session_history')
        .select(`
      id,
      created_at,
      transcript,
      transcript_summary,
      companions:companion_id (*)
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching user sessions:', error);
        throw new Error(error.message);
    }

    return data;
};

export const generateAndSaveTranscriptSummary = async (
    sessionId: string,
    transcript: SavedMessage[],
    companionName: string
) => {
    console.log('📝 Generating transcript summary...');

    const conversationText = transcript
        .map(msg => `${msg.role === 'assistant' ? companionName : 'Student'}: ${msg.content}`)
        .join('\n');

    const prompt = `
You are an expert educator summarizing a tutoring session.

Tutor: ${companionName}

Here is the transcript of the tutoring session:
${conversationText}

Based on this session, provide a concise summary of what the student has learned. Focus on the key concepts explained by the tutor. Keep the summary under 3 sentences. Do not use any introductory phrases, just provide the summary text directly.
`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert educational summarizer. Provide clear, concise summaries."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.5,
            max_tokens: 500,
        });

        const summaryResponse = completion.choices[0]?.message?.content;
        if (!summaryResponse) throw new Error('No response from Groq');

        const summary = summaryResponse.trim();

        // Save to Supabase
        const supabase = createSupabaseClient();
        const { error } = await supabase
            .from('session_history')
            .update({ transcript_summary: summary })
            .eq('id', sessionId);

        if (error) {
            console.error('Error saving transcript summary:', error);
            throw new Error(error.message);
        }

        console.log('✅ Transcript summary generated and saved');
        return summary;
    } catch (error) {
        console.error('❌ Error generating transcript summary:', error);
        throw error;
    }
};

/**
 * Generate highly visual image keywords for Unsplash based on companion profile
 */
export const generateImageKeywords = async (companionName: string, subject: string, topic: string) => {
    console.log(`🖼️ Generating image keywords for ${companionName} (${subject} - ${topic})...`);

    const prompt = `
You are an expert prompt engineer for stock photography search. 
Generate a JSON object containing an array of 5 highly visual, distinct image search keywords for Unsplash.
The keywords should capture the essence of:
Subject: ${subject}
Topic: ${topic}
Companion Name: ${companionName}

Requirements:
- Make the keywords visual and descriptive (e.g., "vintage telescope astronomy", "modern chemistry lab", "ancient greek ruins").
- Do NOT include the companion's raw name unless it is a famous historical figure or place.
- Return ONLY valid JSON in this exact format, with no markdown formatting or other text:
{
  "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"]
}
`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an AI that outputs pure JSON for image search keywords."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 150,
            response_format: { type: "json_object" }
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) throw new Error('No response from Groq');

        const parsedContent = JSON.parse(responseContent);
        console.log('✅ Image keywords generated:', parsedContent.keywords);
        return parsedContent as { keywords: string[] };
    } catch (error) {
        console.error('❌ Error generating image keywords:', error);
        // Fallback keywords if AI generation fails
        return { keywords: [`${subject} ${topic}`.trim(), subject, topic].filter(Boolean) };
    }
};