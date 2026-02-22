'use client';

import { useState } from 'react';
import { cn, getSubjectColor } from '@/lib/utils';
import { submitQuizAnswers } from '@/lib/actions/quiz.actions';
import Image from 'next/image';
import { QuizQuestion } from '@/types/quiz';

interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    quizId: string;
    questions: QuizQuestion[];
    companionName: string;
    subject: string;
}

export const QuizModal = ({
    isOpen,
    onClose,
    quizId,
    questions,
    companionName,
    subject
}: QuizModalProps) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [showExplanations, setShowExplanations] = useState(false);

    if (!isOpen) return null;

    const handleSelectOption = (questionIndex: number, optionIndex: number) => {
        if (submitted) return;
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const handleSubmit = async () => {
        // Check if all questions are answered
        if (Object.keys(answers).length < 5) {
            alert('Please answer all questions before submitting.');
            return;
        }

        setLoading(true);
        try {
            const formattedAnswers = Object.entries(answers).map(([qIndex, option]) => ({
                questionIndex: parseInt(qIndex),
                selectedOption: option
            }));

            const result = await submitQuizAnswers(quizId, formattedAnswers);
            setResults(result);
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Failed to submit quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setSubmitted(false);
        setResults(null);
        setShowExplanations(false);
        onClose();
    };

    const getOptionLetter = (index: number) => String.fromCharCode(65 + index);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-4xl border border-black w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="border-b border-black p-6 flex justify-between items-center sticky top-0 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="size-12 flex items-center justify-center rounded-lg"
                            style={{ backgroundColor: getSubjectColor(subject) }}>
                            <Image src={`/icons/${subject}.svg`} alt={subject} width={30} height={30} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">
                                {submitted ? 'Quiz Results' : 'Quick Quiz'}
                            </h2>
                            <p className="text-sm text-gray-600">with {companionName}</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-2xl hover:text-gray-600">&times;</button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!submitted ? (
                        <>
                            {/* Progress bar */}
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Question {currentQuestion + 1} of 5</span>
                                    <span className="text-gray-600">{Object.keys(answers).length}/5 answered</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{ width: `${((currentQuestion + 1) / 5) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Question */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-6">
                                    {questions[currentQuestion].question}
                                </h3>
                                <div className="space-y-3">
                                    {questions[currentQuestion].options.map((option: string, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelectOption(currentQuestion, idx)}
                                            className={cn(
                                                'w-full text-left p-4 rounded-lg border-2 transition-all',
                                                answers[currentQuestion] === idx
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            )}
                                        >
                                            <span className="font-bold mr-3">
                                                {getOptionLetter(idx)}.
                                            </span>
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestion === 0}
                                    className={cn(
                                        'px-6 py-2 rounded-lg border-2 font-medium',
                                        currentQuestion === 0
                                            ? 'opacity-50 cursor-not-allowed border-gray-200'
                                            : 'border-gray-300 hover:bg-gray-50'
                                    )}
                                >
                                    ← Previous
                                </button>

                                {currentQuestion < 4 ? (
                                    <button
                                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                                        className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90"
                                    >
                                        Next →
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || Object.keys(answers).length < 5}
                                        className={cn(
                                            'px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:opacity-90',
                                            (loading || Object.keys(answers).length < 5) && 'opacity-50 cursor-not-allowed'
                                        )}
                                    >
                                        {loading ? 'Submitting...' : 'Submit Quiz'}
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        // Results
                        <div className="text-center">
                            {/* Score Circle */}
                            <div className="mb-8">
                                <div className="relative inline-block">
                                    <svg className="w-32 h-32">
                                        <circle
                                            className="text-gray-200"
                                            strokeWidth="8"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="56"
                                            cx="64"
                                            cy="64"
                                        />
                                        <circle
                                            className={results.passed ? 'text-green-500' : 'text-yellow-500'}
                                            strokeWidth="8"
                                            strokeDasharray={2 * Math.PI * 56}
                                            strokeDashoffset={2 * Math.PI * 56 * (1 - results.score / 5)}
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="56"
                                            cx="64"
                                            cy="64"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-bold">{results.score}/5</span>
                                    </div>
                                </div>
                                <p className="text-xl font-bold mt-4">
                                    {results.passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}
                                </p>
                                <p className="text-gray-600">
                                    {results.passed
                                        ? 'You passed the quiz! Great job!'
                                        : 'You need 3 correct answers to pass. Try again!'}
                                </p>
                            </div>

                            {/* Toggle Explanations */}
                            <button
                                onClick={() => setShowExplanations(!showExplanations)}
                                className="mb-6 text-primary font-medium hover:underline"
                            >
                                {showExplanations ? 'Hide' : 'Show'} Explanations
                            </button>

                            {/* Explanations */}
                            {showExplanations && (
                                <div className="space-y-6 text-left">
                                    {questions.map((q, idx) => {
                                        const userAnswer = results.answers.find((a: any) => a.question_index === idx);
                                        const isCorrect = userAnswer?.is_correct;

                                        return (
                                            <div key={idx} className="border rounded-lg p-4">
                                                <div className="flex items-start gap-3 mb-2">
                                                    <span className={cn(
                                                        'font-bold text-lg',
                                                        isCorrect ? 'text-green-600' : 'text-red-600'
                                                    )}>
                                                        {isCorrect ? '✓' : '✗'}
                                                    </span>
                                                    <div>
                                                        <p className="font-bold">{q.question}</p>
                                                        <p className="text-sm mt-2">
                                                            <span className="font-medium">Your answer: </span>
                                                            {getOptionLetter(userAnswer?.selected_option)}. {q.options[userAnswer?.selected_option]}
                                                        </p>
                                                        <p className="text-sm mt-1">
                                                            <span className="font-medium">Correct answer: </span>
                                                            {getOptionLetter(q.correctAnswer)}. {q.options[q.correctAnswer]}
                                                        </p>
                                                        <p className="text-sm mt-2 text-gray-600 bg-gray-50 p-2 rounded">
                                                            <span className="font-medium">Explanation: </span>
                                                            {q.explanation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="mt-8 px-8 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};