import { getChapterById, getTopicsWithCompanionInfoByChapter } from '@/lib/actions/curriculum.actions';
import { getUserProfile } from '@/lib/actions/curriculum.actions';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import QuizButton from '@/components/QuizButton';

export default async function ChapterDetailsPage({
    params
}: {
    params: Promise<{ subjectId: string; chapterId: string }>
}) {
    const { subjectId, chapterId } = await params;

    const user = await currentUser();
    if (!user) redirect('/sign-in');

    const [chapter, topics, userProfile] = await Promise.all([
        getChapterById(chapterId),
        getTopicsWithCompanionInfoByChapter(chapterId),
        getUserProfile(),
    ]);

    if (!chapter) {
        return (
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="text-gray-600">Chapter not found</p>
                    <Link href={`/subjects/${subjectId}`} className="text-blue-600 hover:underline mt-4 inline-block">
                        ← Back to Subject
                    </Link>
                </div>
            </main>
        );
    }

    const subjectName = (chapter as any).subjects?.name ?? '';
    const className = (userProfile as any)?.classes?.display_name ?? '';
    const boardName = (userProfile as any)?.boards?.name ?? '';

    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-6 text-sm text-gray-500">
                <Link href="/subjects" className="hover:text-gray-900">Subjects</Link>
                <span className="mx-2">/</span>
                <Link href={`/subjects/${subjectId}`} className="hover:text-gray-900">
                    {subjectName}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">{(chapter as any).name}</span>
            </div>

            {/* Chapter Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 mb-8 border border-gray-200">
                <span className="text-sm font-medium text-gray-500">Chapter {(chapter as any).chapter_number}</span>
                <h1 className="text-3xl font-bold mt-1 mb-3">{(chapter as any).name}</h1>
                {(chapter as any).description && (
                    <p className="text-gray-600 max-w-2xl">{(chapter as any).description}</p>
                )}
                <div className="mt-4 text-sm text-gray-500">
                    {topics.length} topics
                </div>
            </div>

            {/* Topics List */}
            {topics.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <p className="text-4xl mb-4">📝</p>
                    <p className="text-gray-600">No topics found in this chapter</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topics.map((topic: any) => (
                        <div key={topic.id} className="flex flex-col gap-2">
                            {/* Topic card (clickable) */}
                            <Link
                                href={`/subjects/${subjectId}/${chapterId}/${topic.id}`}
                                className="group"
                            >
                                <div className="p-6 rounded-xl border-2 border-gray-100 hover:border-gray-300 transition-all hover:shadow-lg bg-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            Topic {topic.topic_number}
                                        </span>
                                        {topic.companionCount > 0 && (
                                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                                {topic.companionCount} companion{topic.companionCount !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                                        {topic.name}
                                    </h3>
                                    {topic.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2">{topic.description}</p>
                                    )}
                                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span className="text-xs text-gray-500">
                                            {topic.estimated_minutes ? `${topic.estimated_minutes} min` : ''}
                                        </span>
                                        <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            Start Learning →
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            {/* Quiz Buttons — always show AI button; also show revision button if transcripts exist */}
                            {/* {topic.hasTranscript && (
                                <QuizButton
                                    mode="topic-transcript"
                                    topicId={topic.id}
                                    topicName={topic.name}
                                    topicDescription={topic.description}
                                    subjectName={subjectName}
                                    className={className}
                                    boardName={boardName}
                                />
                            )} */}
                            <QuizButton
                                mode="topic-ai"
                                topicId={topic.id}
                                topicName={topic.name}
                                topicDescription={topic.description}
                                subjectName={subjectName}
                                className={className}
                                boardName={boardName}
                            />
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
