// 'use client';

// import { useState } from 'react';
// import { cn, getSubjectColor } from '@/lib/utils';
// import Image from 'next/image';
// import { QuizModal } from './QuizModal';

// export const QuizzesList = ({ quizzes }: { quizzes: any[] }) => {
//     const [selectedQuiz, setSelectedQuiz] = useState<any>(null);

//     if (quizzes.length === 0) {
//         return (
//             <div className="text-center py-8 text-gray-500">
//                 No quizzes taken yet. Complete a session to test your knowledge!
//             </div>
//         );
//     }

//     return (
//         <>
//             <div className="space-y-3">
//                 {quizzes.map((quiz) => (
//                     <button
//                         key={quiz.id}
//                         onClick={() => setSelectedQuiz(quiz)}
//                         className="w-full border border-black rounded-lg p-4 hover:bg-gray-50 transition-colors text-left"
//                     >
//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-3">
//                                 <div
//                                     className="size-12 flex items-center justify-center rounded-lg"
//                                     style={{ backgroundColor: getSubjectColor(quiz.session?.companions?.subject) }}
//                                 >
//                                     <Image
//                                         src={`/icons/${quiz.session?.companions?.subject}.svg`}
//                                         alt={quiz.session?.companions?.subject}
//                                         width={25}
//                                         height={25}
//                                     />
//                                 </div>
//                                 <div>
//                                     <p className="font-bold text-lg">{quiz.session?.companions?.name}</p>
//                                     <p className="text-sm text-gray-500">
//                                         {new Date(quiz.created_at).toLocaleDateString()}
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-4">
//                                 <div className={cn(
//                                     'px-3 py-1 rounded-full text-sm font-medium',
//                                     quiz.passed
//                                         ? 'bg-green-100 text-green-700'
//                                         : 'bg-yellow-100 text-yellow-700'
//                                 )}>
//                                     {quiz.passed ? 'Passed' : 'Failed'} • {quiz.score}/5
//                                 </div>
//                                 <span className="text-gray-400">→</span>
//                             </div>
//                         </div>
//                     </button>
//                 ))}
//             </div>

//             {selectedQuiz && (
//                 <QuizModal
//                     isOpen={true}
//                     onClose={() => setSelectedQuiz(null)}
//                     quizId={selectedQuiz.id}
//                     questions={selectedQuiz.questions}
//                     companionName={selectedQuiz.session?.companions?.name}
//                     subject={selectedQuiz.session?.companions?.subject}
//                 />
//             )}
//         </>
//     );
// };

'use client';

import { useState } from 'react';
import { cn, getSubjectColor } from '@/lib/utils';
import Image from 'next/image';
import { QuizModal } from './QuizModal';
import { getQuizResults } from '@/lib/actions/quiz.actions';

export const QuizzesList = ({ quizzes }: { quizzes: any[] }) => {
    const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState<any>(null);

    const handleQuizClick = async (quiz: any) => {
        setLoading(true);
        try {
            // Fetch full quiz results including answers
            const results = await getQuizResults(quiz.id);
            setQuizData(results);
            setSelectedQuiz(quiz);
        } catch (error) {
            console.error('Error fetching quiz results:', error);
        } finally {
            setLoading(false);
        }
    };

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
                        onClick={() => handleQuizClick(quiz)}
                        disabled={loading}
                        className="w-full border border-black rounded-lg p-4 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
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
                                    <p className="text-xs text-gray-400 mt-1">
                                        Topic: {quiz.session?.companions?.topic}
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

                        {/* Preview of performance */}
                        {quiz.score !== null && (
                            <div className="mt-3 flex gap-1">
                                {[0, 1, 2, 3, 4].map((idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            'h-1 flex-1 rounded-full',
                                            idx < quiz.score ? 'bg-green-500' : 'bg-gray-200'
                                        )}
                                    />
                                ))}
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Loading indicator */}
            {loading && (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading quiz results...</p>
                </div>
            )}

            {/* Quiz Review Modal */}
            {selectedQuiz && quizData && (
                <QuizModal
                    isOpen={true}
                    onClose={() => {
                        setSelectedQuiz(null);
                        setQuizData(null);
                    }}
                    quizId={selectedQuiz.id}
                    questions={selectedQuiz.questions}
                    companionName={selectedQuiz.session?.companions?.name}
                    subject={selectedQuiz.session?.companions?.subject}
                    mode="review"
                    existingAnswers={quizData.answers}
                    score={quizData.score}
                    passed={quizData.passed}
                />
            )}
        </>
    );
};