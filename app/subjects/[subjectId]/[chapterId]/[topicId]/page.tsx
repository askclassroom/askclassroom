import { getTopicById, getCompanionsByTopic } from '@/lib/actions/curriculum.actions';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import CompanionCard from '@/components/CompanionCard';

export default async function TopicDetailsPage({
    params
}: {
    params: Promise<{ subjectId: string; chapterId: string; topicId: string }>
}) {
    const { subjectId, chapterId, topicId } = await params;

    const user = await currentUser();
    if (!user) redirect('/sign-in');

    const topic = await getTopicById(topicId);
    const companions = await getCompanionsByTopic(topicId);

    if (!topic) {
        return (
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="text-gray-600">Topic not found</p>
                    <Link href={`/subjects/${subjectId}/${chapterId}`} className="text-blue-600 hover:underline mt-4 inline-block">
                        ← Back to Chapter
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumb Navigation */}
            <div className="mb-6 text-sm text-gray-500">
                <Link href="/subjects" className="hover:text-gray-900">Subjects</Link>
                <span className="mx-2">/</span>
                <Link href={`/subjects/${subjectId}`} className="hover:text-gray-900">
                    {topic.chapters?.subjects?.name}
                </Link>
                <span className="mx-2">/</span>
                <Link href={`/subjects/${subjectId}/${chapterId}`} className="hover:text-gray-900">
                    {topic.chapters?.name}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">{topic.name}</span>
            </div>

            {/* Topic Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 mb-8 border border-gray-200">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                                Topic {topic.topic_number}
                            </span>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                {companions.length} companions
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold mb-3">{topic.name}</h1>
                        {topic.description && (
                            <p className="text-gray-600 max-w-2xl">{topic.description}</p>
                        )}
                    </div>

                    {/* Create Companion Button */}
                    <Link
                        href={`/companions/new?topicId=${topicId}`}
                        className="px-6 py-3 bg-primary text-white rounded-xl hover:opacity-90 font-medium flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Companion
                    </Link>
                </div>

                {/* Topic Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                    <div>
                        <p className="text-2xl font-bold">{companions.length}</p>
                        <p className="text-xs text-gray-500">Total Companions</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">
                            {companions.filter((c: any) => c.author === user.id).length}
                        </p>
                        <p className="text-xs text-gray-500">Created by You</p>
                    </div>
                </div>
            </div>

            {/* Companions Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">AI Companions for this Topic</h2>
                    {companions.length > 0 && (
                        <span className="text-sm text-gray-500">{companions.length} companions</span>
                    )}
                </div>

                {companions.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <p className="text-4xl mb-4">🤖</p>
                        <p className="text-gray-600 mb-4">No companions yet for this topic</p>
                        <Link
                            href={`/companions/new?topicId=${topicId}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:opacity-90"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Your First Companion
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companions.map((companion: any) => (
                            <CompanionCard
                                key={companion.id}
                                {...companion}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
