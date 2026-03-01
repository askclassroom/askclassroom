'use server'

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { revalidatePath } from "next/cache";
import { GetAllCompanions, CreateCompanion, SavedMessage } from "@/types";
import Groq from "groq-sdk";
import { google } from "googleapis";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
})

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
            model: "llama-3.3-70b-versatile",
            temperature: 0.25,
            max_tokens: 5000,
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
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
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

/**
 * Generate real-time examples based on the learning session transcript
 */
export const generateRealTimeExamples = async (
    transcript: SavedMessage[],
    companionName: string,
    subject: string,
    topic: string
) => {
    console.log(`🧠 Generating real-time examples for ${subject} - ${topic}...`);

    if (!transcript || transcript.length === 0) {
        throw new Error("Transcript is empty. Cannot generate examples without context.");
    }

    const conversationText = transcript
        .map(msg => `${msg.role === 'assistant' ? companionName : 'Student'}: ${msg.content}`)
        .join('\n');

    const prompt = `
You are an expert educator (${companionName}) teaching ${subject} (Topic: ${topic}).
Based on the following transcript of our learning session so far, generate 3 real-world, practical examples that illustrate the key concepts we discussed.

Transcript so far:
${conversationText}

Requirements:
- Provide exactly 3 real-world examples.
- For each example, provide a clear, concise explanation of how it relates to the concepts discussed in the transcript.
- Format the output clearly using Markdown (e.g., use headings for each example, bullet points if necessary). Do not include any introductory or concluding remarks outside of the markdown structure.

Example format:
### 1. [Title of Example 1]
**Concept:** [Brief description of the concept]
**Real-world application:** [Explanation of how the concept is applied in this example]

### 2. [Title of Example 2]
...
`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert educator providing clear, real-world examples based on a learning session transcript. Output ONLY the requested markdown format."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "openai/gpt-oss-120b",
            temperature: 0.5,
            max_tokens: 1000,
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) throw new Error('No response from Groq');

        console.log('✅ Real-time examples generated successfully');
        return responseContent.trim();
    } catch (error) {
        console.error('❌ Error generating real-time examples:', error);
        throw error;
    }
};

// Add this to your existing companion.actions.ts file

/**
 * Generate image keywords based on recent transcript lines
 * Focuses on the most recent conversation for precise visual matching
 */
export const generateKeywordsFromRecentTranscript = async (
    recentTranscript: string,
    subject: string,
    topic: string
) => {
    console.log(`🔄 Generating keywords from recent transcript...`);

    const prompt = `
You are an expert prompt engineer for stock photography search.
Based on the MOST RECENT lines from a tutoring session, generate a SINGLE, highly specific image search keyword.

Subject: ${subject}
Topic: ${topic}

Recent conversation (focus on the last line for the current topic):
${recentTranscript}

Requirements:
- Generate EXACTLY ONE keyword phrase (3-5 words max)
- Focus heavily on the LAST LINE of the conversation - this is what's being discussed RIGHT NOW
- Make it highly visual and specific (e.g., "photosynthesis diagram chloroplast", "quantum physics experiment", "roman colosseum architecture")
- Do NOT use generic terms like "person talking" or "teacher"
- Return ONLY the keyword phrase, no JSON, no explanations, no quotes

Example response: "mitochondria cell structure diagram"
`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You generate precise, single-line image search keywords based on recent educational conversation. Output ONLY the keyword phrase."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 30,
        });

        const keyword = completion.choices[0]?.message?.content?.trim();
        if (!keyword) throw new Error('No response from Groq');

        console.log('✅ Generated keyword from transcript:', keyword);
        return keyword;
    } catch (error) {
        console.error('❌ Error generating keyword from transcript:', error);
        // Fallback to subject+topic if generation fails
        return `${subject} ${topic}`.trim();
    }
};

export const generateYouTubeKeywords = async (companionName: string, subject: string, topic: string) => {
    console.log(`🎬 Generating YouTube keywords for ${companionName} (${subject} - ${topic})...`);

    const prompt = `
You are an expert at creating YouTube search queries for educational content.
Based on the following information, generate 5 specific search queries that would yield high-quality educational videos/shorts.

Companion Name: ${companionName}
Subject: ${subject}
Topic: ${topic}

Requirements:
- Generate EXACTLY 5 search queries
- Each query should be 3-6 words long
- Focus on visual/demonstrative content (experiments, animations, real-world examples)
- Include terms like "animation", "explained", "visualization", "demonstration" where appropriate
- Make them specific enough to get relevant results
- Return ONLY a JSON object with a "queries" array

Example format:
{
  "queries": [
    "photosynthesis process animation",
    "how plants make food explained",
    "chloroplast function 3d visualization",
    "photosynthesis experiment demonstration",
    "plant biology educational short"
  ]
}
`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an AI that outputs pure JSON for YouTube search queries."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 200,
            response_format: { type: "json_object" }
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) throw new Error('No response from Groq');

        const parsedContent = JSON.parse(responseContent);
        console.log('✅ YouTube keywords generated:', parsedContent.queries);
        return parsedContent as { queries: string[] };
    } catch (error) {
        console.error('❌ Error generating YouTube keywords:', error);
        // Fallback queries
        return {
            queries: [
                `${subject} ${topic} explained`,
                `${subject} ${topic} animation`,
                `${subject} ${topic} demonstration`,
                `${subject} ${topic} for students`,
                `${subject} ${topic} visualization`
            ]
        };
    }
};

/**
 * Fetch YouTube videos based on search query
 * @param duration 'short' (< 4 min), 'medium' (4-20 min), or 'any'
 */
export const fetchYouTubeVideos = async (
    query: string,
    maxResults: number = 5,
    duration: 'short' | 'medium' | 'any' = 'short'
) => {
    try {
        const response = await youtube.search.list({
            part: ['snippet'],
            q: query,
            type: ['video'],
            maxResults: maxResults,
            videoDuration: duration,
            relevanceLanguage: 'en',
            videoEmbeddable: 'true' as any,
            videoDefinition: duration === 'medium' ? 'high' : undefined, // HD for full videos
        });

        const videos = (response.data.items ?? []).map(item => ({
            id: item.id?.videoId ?? '',
            title: item.snippet?.title ?? '',
            description: item.snippet?.description ?? '',
            thumbnail: item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.default?.url ?? '',
            channelTitle: item.snippet?.channelTitle ?? '',
            publishedAt: item.snippet?.publishedAt ?? '',
        })).filter(v => v.id); // discard items without a valid videoId

        console.log(`📹 Found ${videos.length} ${duration} videos for query: "${query}"`);
        return videos;
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
};

/**
 * Get educational videos for companion.
 * Fetches a mix of short reels AND medium-length high-quality videos.
 */
export const getCompanionVideos = async (companionName: string, subject: string, topic: string) => {
    console.log(`🎥 Getting videos for ${companionName} (${subject} – ${topic})...`);

    try {
        // Step 1: Generate AI-powered search queries
        const { queries } = await generateYouTubeKeywords(companionName, subject, topic);

        // Step 2: Fetch short reels (first 2 queries) + medium quality videos (next 2 queries)
        const shortQueries = queries.slice(0, 2);
        const mediumQueries = queries.slice(2, 4);

        const [shortResults, mediumResults] = await Promise.all([
            Promise.all(shortQueries.map(q => fetchYouTubeVideos(q, 4, 'short'))),
            Promise.all(mediumQueries.map(q => fetchYouTubeVideos(q, 3, 'medium'))),
        ]);

        // Step 3: Merge, deduplicate by video ID
        const allVideos = [...shortResults.flat(), ...mediumResults.flat()];
        const uniqueVideos = Array.from(
            new Map(allVideos.map(video => [video.id, video])).values()
        );

        console.log(`✅ Found ${uniqueVideos.length} unique videos (shorts + HD)`);
        return uniqueVideos.slice(0, 12); // Return up to 12 unique videos

    } catch (error) {
        console.error('❌ Error getting companion videos:', error);
        return [];
    }
};