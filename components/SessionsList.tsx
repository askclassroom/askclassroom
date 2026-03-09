'use client';

import { useState } from 'react';
import { getSubjectColor } from '@/lib/utils';
import Image from 'next/image';
import { SessionTranscript } from './SessionTranscript';

interface SessionsListProps {
    sessions: any[];
}

export const SessionsList = ({ sessions }: SessionsListProps) => {
    const [selectedSession, setSelectedSession] = useState<string | null>(null);

    if (sessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#e0e7ff,#ede9fe)' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                </div>
                <p className="text-gray-500 font-medium text-sm">No sessions with transcripts yet.</p>
                <p className="text-gray-400 text-xs">Start a learning session to see your history here!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {sessions.map((session) => {
                const isOpen = selectedSession === session.id;
                const subjectColor = getSubjectColor(session.companions?.subject);

                return (
                    <div
                        key={session.id}
                        className="overflow-hidden rounded-xl transition-all duration-200"
                        style={{
                            background: 'rgba(255,255,255,0.75)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.9)',
                            boxShadow: isOpen
                                ? '0 8px 32px rgba(99,102,241,0.12)'
                                : '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                    >
                        {/* Row button */}
                        <button
                            onClick={() => setSelectedSession(isOpen ? null : session.id)}
                            className="w-full p-4 flex items-center gap-3 text-left transition-colors hover:bg-white/50"
                        >
                            {/* Subject icon */}
                            <div
                                className="size-11 flex-shrink-0 flex items-center justify-center rounded-xl shadow-sm"
                                style={{ backgroundColor: subjectColor }}
                            >
                                <Image
                                    src={`/icons/${session.companions?.subject}.svg`}
                                    alt={session.companions?.subject ?? 'subject'}
                                    width={22}
                                    height={22}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 text-sm leading-tight truncate">
                                    {session.companions?.name}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {new Date(session.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                    <span className="mx-1.5">·</span>
                                    {session.transcript?.length ?? 0} messages
                                </p>
                            </div>

                            {/* Badge + chevron */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                    style={{
                                        background: 'linear-gradient(135deg,#e0e7ff,#ede9fe)',
                                        color: '#6366f1',
                                    }}
                                >
                                    📝 Transcript
                                </span>
                                <svg
                                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>

                        {/* Collapse transcript */}
                        {isOpen && (
                            <div
                                className="border-t p-4"
                                style={{ borderColor: 'rgba(99,102,241,0.1)', background: 'rgba(248,250,255,0.8)' }}
                            >
                                <SessionTranscript sessionId={session.id} createdAt={session.created_at} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};