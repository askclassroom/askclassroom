'use client';

import { useEffect, useState } from 'react';
import { getSessionTranscript } from '@/lib/actions/companion.actions';
import { cn, getSubjectColor } from '@/lib/utils';
import Image from 'next/image';

interface SessionTranscriptProps {
    sessionId: string;
}

export const SessionTranscript = ({ sessionId }: SessionTranscriptProps) => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTranscript = async () => {
            try {
                const data = await getSessionTranscript(sessionId);
                setSession(data);
            } catch (error) {
                console.error('Error loading transcript:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTranscript();
    }, [sessionId]);

    if (loading) {
        return <div className="p-4 text-center">Loading transcript...</div>;
    }

    if (!session) {
        return <div className="p-4 text-center">Transcript not found</div>;
    }

    const { transcript, companions } = session;
    const companionName = companions?.name || 'AI Tutor';

    return (
        <div className="rounded-4xl border border-black p-6 bg-white">
            <div className="flex items-center gap-3 mb-6">
                <div className="size-12 flex items-center justify-center rounded-lg"
                    style={{ backgroundColor: companions?.subject ? getSubjectColor(companions.subject) : '#ccc' }}>
                    {companions?.subject && (
                        <Image src={`/icons/${companions.subject}.svg`} alt={companions.subject} width={25} height={25} />
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-xl">{companionName}</h3>
                    <p className="text-sm text-gray-500">
                        {new Date(session.created_at).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {transcript && transcript.length > 0 ? (
                    transcript.map((message: any, index: number) => (
                        <div
                            key={index}
                            className={cn(
                                'p-3 rounded-lg',
                                message.role === 'assistant'
                                    ? 'bg-gray-100 ml-4'
                                    : 'bg-primary/10 mr-4'
                            )}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">
                                    {message.role === 'assistant' ? companionName : 'You'}
                                </span>
                                {message.timestamp && (
                                    <span className="text-xs text-gray-500">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-800">{message.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No messages in this session</p>
                )}
            </div>
        </div>
    );
};