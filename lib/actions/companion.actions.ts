'use server'

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { revalidatePath } from "next/cache";
import { GetAllCompanions, CreateCompanion, SavedMessage } from "@/types";

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
        limit = 4;
    } else if (has({ feature: "3_companion_limit" })) {
        limit = 3;
    } else if (has({ feature: "10_companion_limit" })) {
        limit = 10;
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
        .select('transcript, companions(*)')
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