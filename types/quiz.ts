export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // Index of correct option (0-3)
    explanation: string;
}

export interface Quiz {
    id?: string;
    session_id: string;
    questions: QuizQuestion[];
    status: 'pending' | 'completed';
    score?: number;
    passed?: boolean;
    created_at?: string;
    completed_at?: string;
}

export interface QuizAnswer {
    id?: string;
    quiz_id: string;
    question_index: number;
    selected_option: number;
    is_correct: boolean;
    created_at?: string;
}

export interface QuizResult {
    quiz: Quiz;
    answers: QuizAnswer[];
    score: number;
    passed: boolean;
}