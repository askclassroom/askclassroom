'use client';

import { useState } from 'react';
import { cn, getSubjectColor } from '@/lib/utils';
import Image from 'next/image';
import { QuizModal } from './QuizModal';

export const QuizzesList = ({ quizzes }: { quizzes: any[] }) => {
    const [selectedQuiz, setSelectedQuiz] = useState<any>(null);

    if (quizzes.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No quizzes taken yet. Complete a session to test your knowledge!
            </div>
        );
    }

    return (
        <>
            <div className="space-y-3">
                {quizzes.map((quiz) => (
                    <button
                        key={quiz.id}
                        onClick={() => setSelectedQuiz(quiz)}
                        className="w-full border border-black rounded-lg p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="size-12 flex items-center justify-center rounded-lg"
                                    style={{ backgroundColor: getSubjectColor(quiz.session?.companions?.subject) }}
                                >
                                    <Image
                                        src={`/icons/${quiz.session?.companions?.subject}.svg`}
                                        alt={quiz.session?.companions?.subject}
                                        width={25}
                                        height={25}
                                    />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{quiz.session?.companions?.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(quiz.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    'px-3 py-1 rounded-full text-sm font-medium',
                                    quiz.passed
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                )}>
                                    {quiz.passed ? 'Passed' : 'Failed'} • {quiz.score}/5
                                </div>
                                <span className="text-gray-400">→</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {selectedQuiz && (
                <QuizModal
                    isOpen={true}
                    onClose={() => setSelectedQuiz(null)}
                    quizId={selectedQuiz.id}
                    questions={selectedQuiz.questions}
                    companionName={selectedQuiz.session?.companions?.name}
                    subject={selectedQuiz.session?.companions?.subject}
                />
            )}
        </>
    );
};