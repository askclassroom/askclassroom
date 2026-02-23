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

    const { transcript, transcript_summary, companions } = session;
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
                {transcript_summary ? (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <h4 className="font-bold text-lg mb-2 text-primary">Session AI Summary</h4>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{transcript_summary}</p>
                    </div>
                ) : transcript && transcript.length > 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        <p className="mb-2">Summary is currently being generated...</p>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No messages in this session</p>
                )}
            </div>
        </div>
    );
};