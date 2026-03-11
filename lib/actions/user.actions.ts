"use server";

import { createSupabaseAdmin, createSupabaseClient } from "../supabase";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function saveOnboardingData(data: {
  name: string;
  classStr: string;
  subjects: string[];
  board: string;
  goals: string;
  school_name: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createSupabaseAdmin();

  const { error } = await supabase.from("users").upsert({
    id: userId,
    name: data.name,
    class: data.classStr,
    subjects: data.subjects,
    board: data.board,
    goals: data.goals,
    school_name: data.school_name,
  });

  if (error) {
    console.error("Error saving onboarding data:", error);
    throw new Error("Failed to save onboarding data");
  }

  // Update Clerk metadata to mark onboarding as complete
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      onboardingComplete: true,
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function getUserProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    return null;
  }
  return data;
}
