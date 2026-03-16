"use server";

import { createSupabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Process voice (speech to text) - Using Groq free tier
export async function transcribeAudio(formData: FormData) {
    try {
        const audioFile = formData.get("audio") as File;
        if (!audioFile) throw new Error("No audio file provided");

        const transcription = await groq.audio.transcriptions.create({
            file: audioFile,
            model: "whisper-large-v3-turbo",
            language: "en",
            response_format: "text",
        });

        return { success: true, text: transcription };
    } catch (error) {
        console.error("Error transcribing audio:", error);
        return { success: false, error: "Failed to transcribe audio" };
    }
}

// Generate tutor response using Groq's free LLM (they have free tier with Llama models)
async function generateTutorResponse(
    query: string,
    subject: string,
    topic: string,
    grade: string,
    previousMessages: any[]
) {
    try {
        // Build conversation history
        let conversationHistory = "";
        if (previousMessages.length > 0) {
            conversationHistory = previousMessages
                .slice(-4) // Last 4 messages for context
                .map(m => `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`)
                .join("\n");
        }

        const systemPrompt = `You are a helpful tutor for a student in grade ${grade}. 
    Subject: ${subject || "General"}
    ${topic ? `Topic: ${topic}` : ""}
    
    Important rules:
    1. First give a clear, direct answer to their specific doubt
    2. Then explain the concept in simple terms (keep it grade-appropriate)
    3. Finally provide ONE practice question for them to try
    4. If they're stuck, give hints instead of full answers
    5. Use simple language appropriate for their grade
    6. Format math equations using LaTeX (e.g., $x^2 + 5$)
    
    Structure your response like this:
    
    Answer: [Direct answer to their question]
    
    Concept: [Explanation of the underlying concept]
    
    Practice: [One practice question with a hint if needed]
    
    Keep the tone encouraging and supportive.`;

        const userPrompt = `Student's question: ${query}
    
    ${conversationHistory ? `Previous conversation:\n${conversationHistory}` : ""}
    
    Please help the student with their doubt.`;

        // Using Groq's free Llama model
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            model: "llama-3.1-8b-instant", // Free model on Groq
            temperature: 0.7,
            max_tokens: 800,
        });

        return completion.choices[0]?.message?.content || "I'm here to help! Could you please rephrase your question?";
    } catch (error) {
        console.error("Error generating response:", error);
        // Fallback response
        return `I understand you're asking about "${query}". 

Answer: Let me help you understand this better.

Concept: This is about breaking down the problem into smaller steps. The key is to identify what's being asked and work through it systematically.

Practice: Can you try explaining what you understand so far? That will help me guide you better.`;
    }
}

// Main ask doubt function
export async function askDoubt(input: {
    text: string;
    subject?: string;
    topic?: string;
    previousMessages?: { role: string; content: string }[];
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Create Supabase client with service role for admin operations
    const supabase = createSupabaseAdmin();

    try {
        // Get user's profile for personalization
        const { data: userProfile } = await supabase
            .from("users")
            .select("class, name")
            .eq("id", userId)
            .single();

        // Generate response using free model
        const aiResponse = await generateTutorResponse(
            input.text,
            input.subject || "General",
            input.topic || "",
            userProfile?.class || "10",
            input.previousMessages || []
        );

        // Save to database with RLS (using the user's session)
        const { error: saveError } = await supabase
            .from("doubt_history")
            .insert({
                user_id: userId,
                query: input.text,
                response: aiResponse,
                subject: input.subject,
                topic: input.topic,
            });

        if (saveError) {
            console.error("Error saving doubt history:", saveError);
        }

        // Revalidate the page to show new history
        revalidatePath("/ask-doubt");
        revalidatePath("/ask-doubt/history");

        return {
            success: true,
            response: aiResponse,
        };
    } catch (error) {
        console.error("Error processing doubt:", error);
        return {
            success: false,
            error: "Failed to process your question. Please try again.",
        };
    }
}

// Get user's doubt history
export async function getDoubtHistory() {
    const { userId } = await auth();
    if (!userId) return [];

    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
        .from("doubt_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

    if (error) {
        console.error("Error fetching doubt history:", error);
        return [];
    }

    return data;
}

// Delete a doubt from history
export async function deleteDoubt(doubtId: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const supabase = createSupabaseAdmin();

    const { error } = await supabase
        .from("doubt_history")
        .delete()
        .eq("id", doubtId)
        .eq("user_id", userId); // Extra safety: ensure user owns this record

    if (error) {
        console.error("Error deleting doubt:", error);
        throw new Error("Failed to delete doubt");
    }

    revalidatePath("/ask-doubt/history");
    return { success: true };
}