// "use server";

// import { createSupabaseAdmin, createSupabaseClient } from "../supabase";
// import { auth, clerkClient } from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";

// export async function saveOnboardingData(data: {
//   name: string;
//   classStr: string;
//   subjects: string[];
//   board: string;
//   goals: string;
//   school_name: string;
// }) {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const supabase = createSupabaseAdmin();

//   const { error } = await supabase.from("users").upsert({
//     id: userId,
//     name: data.name,
//     class: data.classStr,
//     subjects: data.subjects,
//     board: data.board,
//     goals: data.goals,
//     school_name: data.school_name,
//   });

//   if (error) {
//     console.error("Error saving onboarding data:", error);
//     throw new Error("Failed to save onboarding data");
//   }

//   // Update Clerk metadata to mark onboarding as complete
//   const client = await clerkClient();
//   await client.users.updateUserMetadata(userId, {
//     publicMetadata: {
//       onboardingComplete: true,
//     },
//   });

//   revalidatePath("/");
//   return { success: true };
// }

// export async function getUserProfile() {
//   const { userId } = await auth();
//   if (!userId) return null;

//   const supabase = createSupabaseAdmin();
//   const { data, error } = await supabase
//     .from("users")
//     .select("*")
//     .eq("id", userId)
//     .single();

//   if (error) {
//     return null;
//   }
//   return data;
// }

"use server";

import { createSupabaseAdmin } from "../supabase";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Fetch boards for dropdown
export async function getBoards() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("boards")
    .select("id, name, code")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching boards:", error);
    return [];
  }
  return data;
}

// Fetch classes for dropdown
export async function getClasses() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("classes")
    .select("id, class_number, display_name")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
  return data;
}

// Map class number to display name
export async function getClassDisplayName(classNumber: number) {
  const classes = await getClasses();
  const found = classes.find(c => c.class_number === classNumber);
  return found?.display_name || `${classNumber}th`;
}

// Map board code to name
export async function getBoardName(boardCode: string) {
  const boards = await getBoards();
  const found = boards.find(b => b.code === boardCode);
  return found?.name || boardCode;
}

// Updated save function with board_id and class_id
export async function saveOnboardingData(data: {
  name: string;
  classNumber: number; // Changed from classStr
  subjects: string[];
  boardCode: string; // Changed from board
  goals: string;
  school_name: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createSupabaseAdmin();

  // First, get board_id and class_id
  const { data: boardData } = await supabase
    .from("boards")
    .select("id")
    .eq("code", data.boardCode)
    .single();

  const { data: classData } = await supabase
    .from("classes")
    .select("id")
    .eq("class_number", data.classNumber)
    .single();

  const { error } = await supabase.from("users").upsert({
    id: userId,
    name: data.name,
    class: data.classNumber.toString(), // Keep old field for backward compatibility
    class_id: classData?.id,
    subjects: data.subjects,
    board: data.boardCode, // Keep old field for backward compatibility
    board_id: boardData?.id,
    goals: data.goals,
    school_name: data.school_name,
  });

  if (error) {
    console.error("Error saving onboarding data:", error);
    throw new Error("Failed to save onboarding data");
  }

  // Update Clerk metadata
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      onboardingComplete: true,
    },
  });

  revalidatePath("/");
  return { success: true };
}

// Updated getUserProfile to return both old and new fields
export async function getUserProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select(`
      *,
      boards:board_id (name, code),
      classes:class_id (class_number, display_name)
    `)
    .eq("id", userId)
    .single();

  if (error) {
    return null;
  }
  return data;
}