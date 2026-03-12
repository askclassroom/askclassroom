'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/types/quiz';
import {
    generateQuizFromCompanionTranscripts,
    generateQuizFromTopicTranscripts,
    generateQuizFromAIForTopic,
} from '@/lib/actions/quiz.actions';

interface QuizButtonProps {
    /** Which quiz generation strategy to use */
    mode: 'companion-transcript' | 'topic-transcript' | 'topic-ai';
    /** Required for mode='companion-transcript' */
    companionId?: string;
    /** Required for modes 'topic-transcript' and 'topic-ai' */
    topicId?: string;
    topicName: string;
    topicDescription?: string;
    subjectName?: string;
    className?: string;
    boardName?: string;
    /** Button label override */
    label?: string;
}

export default function QuizButton({
    mode,
    companionId,
    topicId,
    topicName,
    topicDescription,
    subjectName,
    className,
    boardName,
    label,
}: QuizButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answers, setAnswers] = useState<{ selected: number; correct: boolean }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);

    const buttonLabel =
        label ??
        (mode === 'companion-transcript' || mode === 'topic-transcript'
            ? '📝 Quiz for Revision'
            : '🤖 Generate Quiz from AI');

    const buttonClass =
        mode === 'companion-transcript' || mode === 'topic-transcript'
            ? 'w-full mt-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90 transition flex items-center justify-center gap-2'
            : 'w-full px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition flex items-center justify-center gap-2';

    const handleOpen = async () => {
        setOpen(true);
        setLoading(true);
        setError(null);
        setQuestions([]);
        setCurrent(0);
        setSelected(null);
        setAnswers([]);
        setShowResult(false);

        try {
            let qs: QuizQuestion[] = [];
            if (mode === 'companion-transcript' && companionId) {
                qs = await generateQuizFromCompanionTranscripts(companionId);
            } else if (mode === 'topic-transcript' && topicId) {
                qs = await generateQuizFromTopicTranscripts(topicId, topicName);
            } else if (mode === 'topic-ai') {
                qs = await generateQuizFromAIForTopic({
                    topicName,
                    topicDescription,
                    subjectName: subjectName ?? '',
                    className: className ?? '',
                    boardName: boardName ?? '',
                });
            }
            setQuestions(qs);
        } catch (e: any) {
            setError(e.message ?? 'Failed to generate quiz.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (idx: number) => {
        if (selected !== null) return; // already answered
        setSelected(idx);
    };

    const handleNext = () => {
        if (selected === null) return;
        const q = questions[current];
        setAnswers((prev) => [...prev, { selected, correct: selected === q.correctAnswer }]);
        if (current + 1 < questions.length) {
            setCurrent((c) => c + 1);
            setSelected(null);
        } else {
            setShowResult(true);
        }
    };

    const score = answers.filter((a) => a.correct).length;

    return (
        <>
            <button onClick={handleOpen} className={buttonClass}>
                {buttonLabel}
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-xl font-bold">Quiz</h2>
                                <p className="text-sm text-gray-500 mt-0.5 truncate max-w-[280px]">{topicName}</p>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Loading */}
                            {loading && (
                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                    <div className="w-12 h-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
                                    <p className="text-gray-500 text-sm">Generating your quiz…</p>
                                </div>
                            )}

                            {/* Error */}
                            {!loading && error && (
                                <div className="text-center py-8">
                                    <p className="text-4xl mb-3">😕</p>
                                    <p className="text-red-500 text-sm">{error}</p>
                                    <button
                                        onClick={handleOpen}
                                        className="mt-4 px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:opacity-90"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}

                            {/* Results */}
                            {!loading && !error && showResult && (
                                <div className="text-center py-8">
                                    <div className="text-6xl mb-4">
                                        {score >= 4 ? '🏆' : score >= 3 ? '🎉' : score >= 2 ? '💪' : '📚'}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-1">
                                        {score} / {questions.length}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-6">
                                        {score === questions.length
                                            ? 'Perfect score!'
                                            : score >= 3
                                            ? 'Great job!'
                                            : 'Keep practising!'}
                                    </p>

                                    {/* Answer review */}
                                    <div className="text-left space-y-4">
                                        {questions.map((q, i) => (
                                            <div key={i} className={`p-4 rounded-xl border-2 ${answers[i]?.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                                <p className="text-sm font-semibold mb-2">{i + 1}. {q.question}</p>
                                                <p className="text-xs text-gray-600">
                                                    Your answer: <span className={answers[i]?.correct ? 'text-green-700 font-medium' : 'text-red-600 font-medium'}>
                                                        {q.options[answers[i]?.selected]}
                                                    </span>
                                                </p>
                                                {!answers[i]?.correct && (
                                                    <p className="text-xs text-green-700 mt-1">
                                                        Correct: <span className="font-medium">{q.options[q.correctAnswer]}</span>
                                                    </p>
                                                )}
                                                {q.explanation && (
                                                    <p className="text-xs text-gray-500 mt-2 italic">{q.explanation}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setOpen(false)}
                                        className="mt-6 px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:opacity-90"
                                    >
                                        Done
                                    </button>
                                </div>
                            )}

                            {/* Active question */}
                            {!loading && !error && !showResult && questions.length > 0 && (
                                <div>
                                    {/* Progress */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
                                                style={{ width: `${((current) / questions.length) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {current + 1} / {questions.length}
                                        </span>
                                    </div>

                                    <p className="text-lg font-semibold mb-5 leading-snug">
                                        {questions[current].question}
                                    </p>

                                    <div className="space-y-3">
                                        {questions[current].options.map((opt, i) => {
                                            let cls =
                                                'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ';
                                            if (selected === null) {
                                                cls += 'border-gray-200 hover:border-violet-400 hover:bg-violet-50';
                                            } else if (i === questions[current].correctAnswer) {
                                                cls += 'border-green-400 bg-green-50 text-green-800';
                                            } else if (i === selected) {
                                                cls += 'border-red-400 bg-red-50 text-red-700';
                                            } else {
                                                cls += 'border-gray-200 opacity-60';
                                            }
                                            return (
                                                <button key={i} className={cls} onClick={() => handleSelect(i)}>
                                                    <span className="font-bold mr-2">{['A', 'B', 'C', 'D'][i]}.</span>
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {selected !== null && (
                                        <div className="mt-4">
                                            {questions[current].explanation && (
                                                <p className="text-xs text-gray-500 italic mb-4 bg-gray-50 rounded-xl p-3">
                                                    💡 {questions[current].explanation}
                                                </p>
                                            )}
                                            <button
                                                onClick={handleNext}
                                                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:opacity-90 transition"
                                            >
                                                {current + 1 < questions.length ? 'Next Question →' : 'See Results'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
