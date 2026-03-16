// "use server";

// import { createSupabaseAdmin, createSupabaseClient } from "../supabase";
// import { auth, clerkClient } from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";

// export async function getUserProfile() {
//     const { userId } = await auth();
//     if (!userId) return null;

//     const supabase = createSupabaseAdmin();
//     const { data, error } = await supabase
//         .from("users")
//         .select("*")
//         .eq("id", userId)
//         .single();

//     if (error) {
//         return null;
//     }
//     return data;
// }

"use server";

import { createSupabaseAdmin } from "../supabase";
import { auth } from "@clerk/nextjs/server";

export async function getUserProfile() {
    const { userId } = await auth();
    if (!userId) return null;

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from("users")
        .select(`
            *,
            boards:board_id (id, name, code),
            classes:class_id (id, class_number, display_name)
        `)
        .eq("id", userId)
        .single();

    if (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
    return data;
}

export async function getSubjectsForUser() {
    const { userId } = await auth();
    if (!userId) return [];

    const supabase = createSupabaseAdmin();

    // First get user's board_id and class_id
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("board_id, class_id")
        .eq("id", userId)
        .single();

    if (userError || !user?.board_id || !user?.class_id) {
        console.error("User missing board or class:", userError);
        return [];
    }

    // Then get subjects for that board and class
    const { data: subjects, error: subjectsError } = await supabase
        .from("subjects")
        .select(`
            *,
            boards:board_id (name, code),
            classes:class_id (class_number, display_name)
        `)
        .eq("board_id", user.board_id)
        .eq("class_id", user.class_id)
        .order("display_order", { ascending: true });

    if (subjectsError) {
        console.error("Error fetching subjects:", subjectsError);
        return [];
    }

    return subjects;
}

export async function getBoardName(boardId: string) {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from("boards")
        .select("name")
        .eq("id", boardId)
        .single();

    if (error) return null;
    return data?.name;
}

export async function getClassDisplayName(classId: string) {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from("classes")
        .select("display_name")
        .eq("id", classId)
        .single();

    if (error) return null;
    return data?.display_name;
}

// Add to your existing curriculum.actions.ts

export async function getSubjectById(subjectId: string) {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from("subjects")
        .select(`
            *,
            boards:board_id (id, name, code),
            classes:class_id (id, class_number, display_name)
        `)
        .eq("id", subjectId)
        .single();

    if (error) {
        console.error("Error fetching subject:", error);
        return null;
    }
    return data;
}

export async function getChaptersBySubject(subjectId: string) {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from("chapters")
        .select(`
            *,
            subjects:subject_id (name, icon_name, color_hex)
        `)
        .eq("subject_id", subjectId)
        .order("chapter_number", { ascending: true })
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching chapters:", error);
        return [];
    }
    return data;
}

export async function getChapterById(chapterId: string) {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from("chapters")
        .select(`
            *,
            subjects:subject_id (*)
        `)
        .eq("id", chapterId)
        .single();

    if (error) {
        console.error("Error fetching chapter:", error);
        return null;
    }
    return data;
}

export async function getTopicById(topicId: string) {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from("topics")
        .select(`
            *,
            chapters:chapter_id (
                id,
                name,
                chapter_number,
                subjects:subject_id (
                    id,
                    name,
                    icon_name,
                    color_hex
                )
            )
        `)
        .eq("id", topicId)
        .single();

    if (error) {
        console.error("Error fetching topic:", error);
        return null;
    }
    return data;
}

export async function getCompanionsByTopic(topicId: string) {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from("companions")
        .select(`
            *,
            topics!inner (
                id,
                name,
                chapters!inner (
                    name,
                    subjects!inner (
                        name,
                        icon_name,
                        color_hex
                    )
                )
            )
        `)
        .eq("topic_id", topicId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching companions:", error);
        return [];
    }
    return data;
}

export async function getTopicsByChapter(chapterId: string) {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
        .from("topics")
        .select(`
            *,
            chapters:chapter_id (
                name,
                subjects:subject_id (
                    name,
                    icon_name,
                    color_hex
                )
            )
        `)
        .eq("chapter_id", chapterId)
        .order("topic_number", { ascending: true })
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching topics:", error);
        return [];
    }
    return data;
}

/**
 * Fetch companions for a topic, each annotated with whether they have
 * at least one non-empty transcript in session_history.
 */
export async function getCompanionsWithTranscriptsByTopic(topicId: string) {
    const supabase = createSupabaseAdmin();

    const { data: companions, error } = await supabase
        .from("companions")
        .select(`
            *,
            session_history (
                id,
                transcript
            )
        `)
        .eq("topic_id", topicId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching companions with transcripts:", error);
        return [];
    }

    return (companions ?? []).map((c: any) => ({
        ...c,
        hasTranscript: (c.session_history ?? []).some(
            (s: any) => Array.isArray(s.transcript) && s.transcript.length > 0
        ),
    }));
}

/**
 * For each topic in a chapter, return the topic plus:
 *  - companionCount: how many companions exist
 *  - hasTranscript: whether any companion has a non-empty transcript
 * Used by the chapter page to decide which quiz button to show.
 */
export async function getTopicsWithCompanionInfoByChapter(chapterId: string) {
    const supabase = createSupabaseAdmin();

    const { data: topics, error } = await supabase
        .from("topics")
        .select(`
            *,
            chapters:chapter_id (
                name,
                subjects:subject_id (
                    name,
                    icon_name,
                    color_hex
                )
            ),
            companions (
                id,
                session_history (
                    id,
                    transcript
                )
            )
        `)
        .eq("chapter_id", chapterId)
        .order("topic_number", { ascending: true })
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching topics with companion info:", error);
        return [];
    }

    return (topics ?? []).map((topic: any) => {
        const companions = topic.companions ?? [];
        const hasTranscript = companions.some((c: any) =>
            (c.session_history ?? []).some(
                (s: any) => Array.isArray(s.transcript) && s.transcript.length > 0
            )
        );
        const { companions: _companions, ...rest } = topic;
        return {
            ...rest,
            companionCount: companions.length,
            hasTranscript,
        };
    });
}