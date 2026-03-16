// // In any component that needs to show user info
// import { getUserProfile, getBoardName, getClassDisplayName } from '@/lib/actions/user.actions';

// export default async function UserProfileDisplay() {
//     const user = await getUserProfile();

//     // Get display names from the joined data
//     const boardName = user?.boards?.name || user?.board;
//     const className = user?.classes?.display_name || `${user?.class}th`;

//     return (
//         <div>
//             <p>Name: {user?.name}</p>
//             <p>Class: {className}</p>
//             <p>Board: {boardName}</p>
//             <p>School: {user?.school_name}</p>
//         </div>
//     );
// }

import { getUserProfile, getSubjectsForUser } from '@/lib/actions/curriculum.actions';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';

export default async function SubjectsPage() {
    const user = await currentUser();
    if (!user) redirect('/sign-in');

    const profile = await getUserProfile();
    const subjects = await getSubjectsForUser();

    // Get display names
    const boardName = profile?.boards?.name || profile?.board || 'Not selected';
    const className = profile?.classes?.display_name ||
        (profile?.class ? `${profile.class}th` : 'Not selected');

    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            {/* Header with User Info */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Subjects</h1>
                <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">👤 {profile?.name || user.firstName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">📚 {boardName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">🎓 {className}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">🏫 {profile?.school_name || 'Not set'}</span>
                    </div>
                </div>
            </div>

            {/* Subjects Grid */}
            {subjects.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <p className="text-4xl mb-4">📚</p>
                    <p className="text-gray-600 mb-4">No subjects found for your board and class</p>
                    <p className="text-sm text-gray-500">
                        Please complete your profile with board and class information
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {subjects.map((subject) => (
                        <Link
                            href={`/subjects/${subject.id}`}
                            key={subject.id}
                            className="group"
                        >
                            <div
                                className="p-6 rounded-xl border-2 border-gray-100 hover:border-gray-300 transition-all hover:shadow-lg cursor-pointer"
                                style={{ backgroundColor: subject.color_hex + '10' }}
                            >
                                <div className="flex flex-col items-center text-center">
                                    {/* Icon */}
                                    <div
                                        className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                                        style={{ backgroundColor: subject.color_hex }}
                                    >
                                        <Image
                                            src={`/icons/${subject.icon_name || 'default'}.svg`}
                                            alt={subject.name}
                                            width={40}
                                            height={40}
                                        />
                                    </div>

                                    {/* Subject Name */}
                                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                                        {subject.name}
                                    </h3>

                                    {/* Class Info */}
                                    <p className="text-sm text-gray-500">
                                        Class {subject.classes?.class_number}
                                    </p>

                                    {/* Hover Indicator */}
                                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs text-primary font-medium">
                                            View Chapters →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Quick Stats */}
            {subjects.length > 0 && (
                <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{subjects.length}</p>
                        <p className="text-xs text-gray-600">Total Subjects</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {subjects.filter(s => s.progress?.completed).length || 0}
                        </p>
                        <p className="text-xs text-gray-600">Completed</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">
                            {subjects.reduce((acc, s) => acc + (s.chapters_count || 0), 0) || 0}
                        </p>
                        <p className="text-xs text-gray-600">Total Chapters</p>
                    </div>
                </div>
            )}
        </main>
    );
}