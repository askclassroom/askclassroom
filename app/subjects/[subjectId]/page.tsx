import { getSubjectById, getChaptersBySubject } from '@/lib/actions/curriculum.actions';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function SubjectDetailsPage({
    params
}: {
    params: Promise<{ subjectId: string }>
}) {
    const { subjectId } = await params;

    const user = await currentUser();
    if (!user) redirect('/sign-in');

    const subject = await getSubjectById(subjectId);
    const chapters = await getChaptersBySubject(subjectId);

    if (!subject) {
        return (
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <p className="text-4xl mb-4">📚</p>
                    <p className="text-gray-600">Subject not found</p>
                    <Link href="/subjects" className="text-blue-600 hover:underline mt-4 inline-block">
                        ← Back to Subjects
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            {/* Back Button */}
            <Link href="/subjects" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Subjects
            </Link>

            {/* Subject Header */}
            <div className="flex items-center gap-6 mb-8">
                <div
                    className="w-20 h-20 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: subject.color_hex }}
                >
                    <Image
                        src={`/icons/${subject.icon_name || 'default'}.svg`}
                        alt={subject.name}
                        width={50}
                        height={50}
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-2">{subject.name}</h1>
                    <div className="flex items-center gap-4 text-gray-600">
                        <span>{subject.boards?.name}</span>
                        <span>•</span>
                        <span>Class {subject.classes?.class_number}</span>
                        <span>•</span>
                        <span>{chapters.length} Chapters</span>
                    </div>
                </div>
            </div>

            {/* Chapters Grid */}
            {chapters.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <p className="text-4xl mb-4">📖</p>
                    <p className="text-gray-600">No chapters found for this subject</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chapters.map((chapter: any) => (
                        <Link
                            href={`/subjects/${subjectId}/${chapter.id}`}
                            key={chapter.id}
                            className="group"
                        >
                            <div className="p-6 rounded-xl border-2 border-gray-100 hover:border-gray-300 transition-all hover:shadow-lg bg-white">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-500">
                                        Chapter {chapter.chapter_number}
                                    </span>
                                    {chapter.estimated_topics > 0 && (
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                            {chapter.estimated_topics} topics
                                        </span>
                                    )}
                                </div>

                                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                                    {chapter.name}
                                </h3>

                                {chapter.description && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {chapter.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-xs text-gray-500">
                                        {chapter.estimated_topics || 0} topics
                                    </span>
                                    <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Topics →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Quick Stats */}
            {chapters.length > 0 && (
                <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{chapters.length}</p>
                        <p className="text-xs text-gray-600">Total Chapters</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {chapters.reduce((acc, ch: any) => acc + (ch.estimated_topics || 0), 0)}
                        </p>
                        <p className="text-xs text-gray-600">Total Topics</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">
                            {chapters.filter((ch: any) => ch.completed).length || 0}
                        </p>
                        <p className="text-xs text-gray-600">Completed</p>
                    </div>
                </div>
            )}
        </main>
    );
}
