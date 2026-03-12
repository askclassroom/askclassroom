'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import Groq from "groq-sdk";
import { Quiz, QuizQuestion, QuizAnswer, QuizResult } from "@/types/quiz";
import { revalidatePath } from "next/cache";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generate quiz questions based on transcript using Groq
 */
export const generateQuizFromTranscript = async (
    transcript: SavedMessage[],
    companionName: string,
    subject: string,
    topic: string
): Promise<QuizQuestion[]> => {
    console.log('📝 Generating quiz from transcript...');

    // Format transcript for the prompt
    const conversationText = transcript
        .map(msg => `${msg.role === 'assistant' ? companionName : 'Student'}: ${msg.content}`)
        .join('\n');

    const prompt = `
You are an expert educator creating a quiz based on a tutoring session.

Session Details:
- Subject: ${subject}
- Topic: ${topic}
- Tutor: ${companionName}

Here is the transcript of the tutoring session:
${conversationText}

Based on this session, create 5 multiple-choice questions that test the key concepts discussed.
Each question should:
1. Test understanding of important points from the session
2. Have 4 options (A, B, C, D)
3. Have exactly one correct answer
4. Include a brief explanation of why the answer is correct

Format your response as a valid JSON array with this structure:
[
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0, // Index of correct option (0-3)
    "explanation": "Explanation of why this answer is correct"
  }
]

Ensure the JSON is valid and properly formatted. Do not include any other text.
`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert quiz generator. Always respond with valid JSON only."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "openai/gpt-oss-120b",
            temperature: 0.3,
            max_tokens: 20480,
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) throw new Error('No response from Groq');

        // Parse the JSON response
        const questions = JSON.parse(response) as QuizQuestion[];

        // Validate quiz structure
        if (!questions || questions.length !== 5) {
            throw new Error('Invalid quiz format generated');
        }

        console.log('✅ Quiz generated successfully');
        return questions;
    } catch (error) {
        console.error('❌ Error generating quiz:', error);
        throw error;
    }
};

/**
 * Save quiz to database
 */
export const saveQuiz = async (
    sessionId: string,
    questions: QuizQuestion[]
): Promise<string> => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('quizzes')
        .insert({
            session_id: sessionId,
            questions: questions,
            status: 'pending'
        })
        .select('id')
        .single();

    if (error) {
        console.error('❌ Error saving quiz:', error);
        throw new Error(error.message);
    }

    console.log('✅ Quiz saved to database with ID:', data.id);
    return data.id;
};

/**
 * Get quiz by session ID
 */
export const getQuizBySessionId = async (sessionId: string): Promise<Quiz | null> => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('session_id', sessionId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('❌ Error fetching quiz:', error);
        throw new Error(error.message);
    }

    return data;
};

/**
 * Submit quiz answers and calculate score
 */
export const submitQuizAnswers = async (
    quizId: string,
    answers: { questionIndex: number; selectedOption: number }[]
): Promise<QuizResult> => {
    const supabase = createSupabaseClient();

    // First, get the quiz to check answers
    const { data: quiz, error: fetchError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

    if (fetchError || !quiz) {
        throw new Error('Quiz not found');
    }

    const questions = quiz.questions as QuizQuestion[];

    // Calculate score and prepare answers
    let correctCount = 0;
    const quizAnswers: Omit<QuizAnswer, 'id' | 'created_at'>[] = [];

    answers.forEach(answer => {
        const question = questions[answer.questionIndex];
        const isCorrect = question.correctAnswer === answer.selectedOption;
        if (isCorrect) correctCount++;

        quizAnswers.push({
            quiz_id: quizId,
            question_index: answer.questionIndex,
            selected_option: answer.selectedOption,
            is_correct: isCorrect
        });
    });

    const score = correctCount;
    const passed = score >= 3; // Pass if 3 or more correct

    // Insert all answers
    const { error: answersError } = await supabase
        .from('quiz_answers')
        .insert(quizAnswers);

    if (answersError) {
        console.error('❌ Error saving answers:', answersError);
        throw new Error(answersError.message);
    }

    // Update quiz status
    const { error: updateError } = await supabase
        .from('quizzes')
        .update({
            status: 'completed',
            score: score,
            passed: passed,
            completed_at: new Date().toISOString()
        })
        .eq('id', quizId);

    if (updateError) {
        console.error('❌ Error updating quiz:', updateError);
        throw new Error(updateError.message);
    }

    console.log('✅ Quiz answers submitted. Score:', score, 'Passed:', passed);

    return {
        quiz: { ...quiz, status: 'completed', score, passed },
        answers: quizAnswers as QuizAnswer[],
        score,
        passed
    };
};

/**
 * Get quiz results with answers
 */
// export const getQuizResults = async (quizId: string): Promise<QuizResult | null> => {
//     const supabase = createSupabaseClient();

//     // Get quiz
//     const { data: quiz, error: quizError } = await supabase
//         .from('quizzes')
//         .select('*')
//         .eq('id', quizId)
//         .single();

//     if (quizError) {
//         console.error('❌ Error fetching quiz:', quizError);
//         throw new Error(quizError.message);
//     }

//     // Get answers
//     const { data: answers, error: answersError } = await supabase
//         .from('quiz_answers')
//         .select('*')
//         .eq('quiz_id', quizId)
//         .order('question_index', { ascending: true });

//     if (answersError) {
//         console.error('❌ Error fetching answers:', answersError);
//         throw new Error(answersError.message);
//     }

//     return {
//         quiz,
//         answers: answers || [],
//         score: quiz.score || 0,
//         passed: quiz.passed || false
//     };
// };

/**
 * Get quiz results with answers
 */
export const getQuizResults = async (quizId: string): Promise<QuizResult | null> => {
    console.log('🔍 Fetching quiz results for:', quizId);

    const supabase = createSupabaseClient();

    // Get quiz
    const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

    if (quizError) {
        console.error('❌ Error fetching quiz:', quizError);
        throw new Error(quizError.message);
    }

    // Get answers
    const { data: answers, error: answersError } = await supabase
        .from('quiz_answers')
        .select('*')
        .eq('quiz_id', quizId)
        .order('question_index', { ascending: true });

    if (answersError) {
        console.error('❌ Error fetching answers:', answersError);
        throw new Error(answersError.message);
    }

    console.log('✅ Quiz results fetched:', {
        quizId,
        answersCount: answers?.length,
        score: quiz.score
    });

    return {
        quiz,
        answers: answers || [],
        score: quiz.score || 0,
        passed: quiz.passed || false
    };
};
/**
 * Get all quizzes for a user
 */
export const getUserQuizzes = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('quizzes')
        .select(`
      *,
      session:session_id (
        id,
        created_at,
        companions:companion_id (*)
      )
    `)
        .eq('session.user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('\u274c Error fetching user quizzes:', error);
        throw new Error(error.message);
    }

    return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// NEW: On-demand quiz generation  (no database rows — questions returned inline)
// ─────────────────────────────────────────────────────────────────────────────

import { createSupabaseAdmin } from '../supabase';

/** Internal helper: call Groq and parse 5 MCQ questions */
async function _generateQuestionsFromPrompt(userPrompt: string): Promise<QuizQuestion[]> {
    const systemPrompt = `You are an expert educator creating multiple-choice quiz questions.
Always return ONLY a valid JSON object with this exact structure:
{
  "questions": [
    {
      "question": "The question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why Option A is correct."
    }
  ]
}
Rules:
- Generate exactly 5 questions.
- Each question must have exactly 4 options.
- "correctAnswer" is the 0-based index of the correct option (0, 1, 2, or 3).
- Questions should test understanding, not rote recall.
- Return ONLY the JSON object, no extra text or markdown.`;

    const completion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.4,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('No response from AI.');

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.questions)) throw new Error('Invalid quiz format from AI.');

    return parsed.questions as QuizQuestion[];
}

/**
 * Generate quiz questions from a single companion's transcripts.
 * Called from the [topicId] page companion card quiz button.
 */
export async function generateQuizFromCompanionTranscripts(
    companionId: string
): Promise<QuizQuestion[]> {
    const supabase = createSupabaseAdmin();

    const { data: companion, error: cErr } = await supabase
        .from('companions')
        .select('name, subject, topic')
        .eq('id', companionId)
        .single();
    if (cErr) throw new Error(cErr.message);

    const { data: sessions, error: sErr } = await supabase
        .from('session_history')
        .select('transcript')
        .eq('companion_id', companionId)
        .not('transcript', 'is', null);
    if (sErr) throw new Error(sErr.message);

    const lines = (sessions ?? []).flatMap((s: any) =>
        Array.isArray(s.transcript)
            ? s.transcript
                  .filter((m: any) => m.content?.trim())
                  .map((m: any) => `${m.role === 'assistant' ? (companion?.name ?? 'Tutor') : 'Student'}: ${m.content}`)
            : []
    );

    if (lines.length === 0) throw new Error('No transcript content found for this companion.');

    return _generateQuestionsFromPrompt(
        `Generate 5 multiple-choice quiz questions based on the following tutoring session transcript.
Subject: ${companion?.subject ?? 'N/A'} | Topic: ${companion?.topic ?? 'N/A'}

Transcript:
${lines.join('\n').slice(0, 12000)}`
    );
}

/**
 * Generate quiz from ALL companion transcripts for a topic.
 * Called from the [chapterId] page "Quiz for Revision" button.
 */
export async function generateQuizFromTopicTranscripts(
    topicId: string,
    topicName: string
): Promise<QuizQuestion[]> {
    const supabase = createSupabaseAdmin();

    const { data: companions, error: cErr } = await supabase
        .from('companions')
        .select('id, name, subject')
        .eq('topic_id', topicId);
    if (cErr) throw new Error(cErr.message);
    if (!companions || companions.length === 0) throw new Error('No companions found.');

    const ids = companions.map((c: any) => c.id);
    const { data: sessions, error: sErr } = await supabase
        .from('session_history')
        .select('transcript')
        .in('companion_id', ids)
        .not('transcript', 'is', null);
    if (sErr) throw new Error(sErr.message);

    const lines = (sessions ?? []).flatMap((s: any) =>
        Array.isArray(s.transcript)
            ? s.transcript
                  .filter((m: any) => m.content?.trim())
                  .map((m: any) => `${m.role === 'assistant' ? 'Tutor' : 'Student'}: ${m.content}`)
            : []
    );

    if (lines.length === 0) throw new Error('No transcript content found for this topic.');

    return _generateQuestionsFromPrompt(
        `Generate 5 multiple-choice quiz questions based on the following tutoring session transcripts for the topic "${topicName}".
Subject: ${companions[0]?.subject ?? 'N/A'}

Transcript:
${lines.join('\n').slice(0, 12000)}`
    );
}

/**
 * Generate quiz from AI using topic/board/class for difficulty calibration.
 * Called from the [chapterId] page "Generate Quiz from AI" button.
 */
export async function generateQuizFromAIForTopic(params: {
    topicName: string;
    topicDescription?: string;
    subjectName: string;
    className: string;
    boardName: string;
}): Promise<QuizQuestion[]> {
    const { topicName, topicDescription, subjectName, className, boardName } = params;
    return _generateQuestionsFromPrompt(
        `Generate 5 multiple-choice quiz questions for the following curriculum.

Subject: ${subjectName}
Topic: ${topicName}${topicDescription ? `\nDescription: ${topicDescription}` : ''}
Board: ${boardName}
Class: ${className}

Calibrate difficulty for a ${className} student under the ${boardName} curriculum.
Focus on conceptual understanding and real-world application.`
    );
}