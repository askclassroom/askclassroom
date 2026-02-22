'use client';

import { useState } from 'react';
import { cn, getSubjectColor } from "@/lib/utils";
import Image from "next/image";
import { SessionTranscript } from "./SessionTranscript";

interface SessionsListProps {
    sessions: any[];
}

export const SessionsList = ({ sessions }: SessionsListProps) => {
    const [selectedSession, setSelectedSession] = useState<string | null>(null);

    if (sessions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No sessions yet. Start a lesson to see your history!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sessions.map((session) => (
                <div key={session.id} className="border border-black rounded-lg overflow-hidden">
                    <button
                        onClick={() => setSelectedSession(
                            selectedSession === session.id ? null : session.id
                        )}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="size-12 flex items-center justify-center rounded-lg"
                                style={{ backgroundColor: getSubjectColor(session.companions?.subject) }}
                            >
                                <Image
                                    src={`/icons/${session.companions?.subject}.svg`}
                                    alt={session.companions?.subject}
                                    width={25}
                                    height={25}
                                />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-lg">{session.companions?.name}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(session.created_at).toLocaleDateString()} •{' '}
                                    {session.transcript?.length || 0} messages
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                                {session.transcript?.length > 0 ? '📝 Transcript available' : 'No transcript'}
                            </span>
                            <svg
                                className={`w-5 h-5 transition-transform ${selectedSession === session.id ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>

                    {selectedSession === session.id && (
                        <div className="border-t border-black p-4 bg-gray-50">
                            <SessionTranscript sessionId={session.id} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};