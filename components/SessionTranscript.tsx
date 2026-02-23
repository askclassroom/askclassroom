'use client';

import { useEffect, useState, useRef } from 'react';
import { getSessionTranscript } from '@/lib/actions/companion.actions';
import { cn, getSubjectColor } from '@/lib/utils';
import Image from 'next/image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface SessionTranscriptProps {
    sessionId: string;
    createdAt?: string;
}

export const SessionTranscript = ({ sessionId, createdAt }: SessionTranscriptProps) => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const summaryRef = useRef<HTMLDivElement>(null);

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

    const handleDownloadPdf = async () => {
        if (!session || !transcript_summary) return;
        setIsDownloading(true);

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 14;
            const contentWidth = pageWidth - margin * 2;
            let currentY = 22;

            // Add Header
            pdf.setFontSize(20);
            pdf.setTextColor(40, 40, 40);
            pdf.text('Session Summary', margin, currentY);
            currentY += 10;

            pdf.setFontSize(12);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Tutor: ${companionName}`, margin, currentY);
            currentY += 6;

            // Prefer the explicitly passed createdAt
            const effectiveDateStr = createdAt || session.created_at;
            const dateText = effectiveDateStr ? new Date(effectiveDateStr).toLocaleDateString() : 'Unknown Date';
            pdf.text(`Date: ${dateText}`, margin, currentY);
            currentY += 12;

            pdf.setFontSize(14);
            pdf.setTextColor(40, 40, 40);
            pdf.text('AI Summary:', margin, currentY);
            currentY += 8;

            // Add the generated content text
            pdf.setFontSize(11);
            pdf.setTextColor(60, 60, 60);

            // Split the text to fit the page width
            const lines = pdf.splitTextToSize(transcript_summary, contentWidth);

            // Handle pagination if text is too long
            for (let i = 0; i < lines.length; i++) {
                if (currentY > pdf.internal.pageSize.getHeight() - margin) {
                    pdf.addPage();
                    currentY = margin;
                }
                pdf.text(lines[i], margin, currentY);
                // Adjust line height
                currentY += 6;
            }

            const effectiveDateStrForFile = createdAt || session.created_at;
            const dateStr = effectiveDateStrForFile ? new Date(effectiveDateStrForFile).toISOString().split('T')[0] : 'Unknown';
            pdf.save(`Session_Summary_${dateStr}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading transcript...</div>;
    }

    if (!session) {
        return <div className="p-4 text-center">Transcript not found</div>;
    }

    const { transcript, transcript_summary, companions } = session;
    const companionName = companions?.name || 'AI Tutor';

    return (
        <div className="rounded-4xl border border-black p-6 bg-white relative">
            <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <div className="size-12 flex items-center justify-center rounded-lg"
                        style={{ backgroundColor: companions?.subject ? getSubjectColor(companions.subject) : '#ccc' }}>
                        {companions?.subject && (
                            <Image src={`/icons/${companions.subject}.svg`} alt={companions.subject} width={25} height={25} />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-xl">{companionName}</h3>
                        <p className="text-sm text-gray-500">
                            {createdAt || session.created_at ? new Date(createdAt || session.created_at).toLocaleString() : ''}
                        </p>
                    </div>
                </div>

                {transcript_summary && (
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isDownloading ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                <span>Download PDF</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {transcript_summary ? (
                    <div ref={summaryRef} className="p-4 bg-primary/5 rounded-lg border border-primary/20">
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