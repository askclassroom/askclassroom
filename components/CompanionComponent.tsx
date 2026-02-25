// 'use client';

// import {useEffect, useRef, useState} from 'react'
// import {cn, configureAssistant, getSubjectColor} from "@/lib/utils";
// import {vapi} from "@/lib/vapi.sdk";
// import Image from "next/image";
// import Lottie, {LottieRefCurrentProps} from "lottie-react";
// import soundwaves from '@/constants/soundwaves.json'
// import {addToSessionHistory} from "@/lib/actions/companion.actions";

// enum CallStatus {
//     INACTIVE = 'INACTIVE',
//     CONNECTING = 'CONNECTING',
//     ACTIVE = 'ACTIVE',
//     FINISHED = 'FINISHED',
// }

// const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice }: CompanionComponentProps) => {
//     const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [isMuted, setIsMuted] = useState(false);
//     const [messages, setMessages] = useState<SavedMessage[]>([]);

//     const lottieRef = useRef<LottieRefCurrentProps>(null);

//     useEffect(() => {
//         if(lottieRef) {
//             if(isSpeaking) {
//                 lottieRef.current?.play()
//             } else {
//                 lottieRef.current?.stop()
//             }
//         }
//     }, [isSpeaking, lottieRef])

//     useEffect(() => {
//         const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

//         const onCallEnd = () => {
//             setCallStatus(CallStatus.FINISHED);
//             addToSessionHistory(companionId)
//         }

//         const onMessage = (message: Message) => {
//             if(message.type === 'transcript' && message.transcriptType === 'final') {
//                 const newMessage= { role: message.role, content: message.transcript}
//                 setMessages((prev) => [newMessage, ...prev])
//             }
//         }

//         const onSpeechStart = () => setIsSpeaking(true);
//         const onSpeechEnd = () => setIsSpeaking(false);

//         const onError = (error: Error) => console.log('Error', error);

//         vapi.on('call-start', onCallStart);
//         vapi.on('call-end', onCallEnd);
//         vapi.on('message', onMessage);
//         vapi.on('error', onError);
//         vapi.on('speech-start', onSpeechStart);
//         vapi.on('speech-end', onSpeechEnd);

//         return () => {
//             vapi.off('call-start', onCallStart);
//             vapi.off('call-end', onCallEnd);
//             vapi.off('message', onMessage);
//             vapi.off('error', onError);
//             vapi.off('speech-start', onSpeechStart);
//             vapi.off('speech-end', onSpeechEnd);
//         }
//     }, []);

//     const toggleMicrophone = () => {
//         const isMuted = vapi.isMuted();
//         vapi.setMuted(!isMuted);
//         setIsMuted(!isMuted)
//     }

//     const handleCall = async () => {
//         setCallStatus(CallStatus.CONNECTING)

//         const assistantOverrides = {
//             variableValues: { subject, topic, style },
//             clientMessages: ["transcript"],
//             serverMessages: [],
//         }

//         // @ts-expect-error
//         vapi.start(configureAssistant(voice, style), assistantOverrides)
//     }

//     const handleDisconnect = () => {
//         setCallStatus(CallStatus.FINISHED)
//         vapi.stop()
//     }

//     return (
//         <section className="flex flex-col h-[70vh]">
//             <section className="flex gap-8 max-sm:flex-col">
//                 <div className="companion-section">
//                     <div className="companion-avatar" style={{ backgroundColor: getSubjectColor(subject)}}>
//                         <div
//                             className={
//                             cn(
//                                 'absolute transition-opacity duration-1000', callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-1001' : 'opacity-0', callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'
//                             )
//                         }>
//                             <Image src={`/icons/${subject}.svg`} alt={subject} width={150} height={150} className="max-sm:w-fit" />
//                         </div>

//                         <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100': 'opacity-0')}>
//                             <Lottie
//                                 lottieRef={lottieRef}
//                                 animationData={soundwaves}
//                                 autoplay={false}
//                                 className="companion-lottie"
//                             />
//                         </div>
//                     </div>
//                     <p className="font-bold text-2xl">{name}</p>
//                 </div>

//                 <div className="user-section">
//                     <div className="user-avatar">
//                         <Image src={userImage} alt={userName} width={130} height={130} className="rounded-lg" />
//                         <p className="font-bold text-2xl">
//                             {userName}
//                         </p>
//                     </div>
//                     <button className="btn-mic" onClick={toggleMicrophone} disabled={callStatus !== CallStatus.ACTIVE}>
//                         <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} alt="mic" width={36} height={36} />
//                         <p className="max-sm:hidden">
//                             {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
//                         </p>
//                     </button>
//                     <button className={cn('rounded-lg py-2 cursor-pointer transition-colors w-full text-white', callStatus ===CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary', callStatus === CallStatus.CONNECTING && 'animate-pulse')} onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}>
//                         {callStatus === CallStatus.ACTIVE
//                         ? "End Session"
//                         : callStatus === CallStatus.CONNECTING
//                             ? 'Connecting'
//                         : 'Start Session'
//                         }
//                     </button>
//                 </div>
//             </section>

//             <section className="transcript">
//                 <div className="transcript-message no-scrollbar">
//                     {messages.map((message, index) => {
//                         if(message.role === 'assistant') {
//                             return (
//                                 <p key={index} className="max-sm:text-sm">
//                                     {
//                                         name
//                                             .split(' ')[0]
//                                             .replace('/[.,]/g, ','')
//                                     }: {message.content}
//                                 </p>
//                             )
//                         } else {
//                            return <p key={index} className="text-primary max-sm:text-sm">
//                                 {userName}: {message.content}
//                             </p>
//                         }
//                     })}
//                 </div>

//                 <div className="transcript-fade" />
//             </section>
//         </section>
//     )
// }

// export default CompanionComponent

'use client';

import { useEffect, useRef, useState } from 'react'
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import soundwaves from '@/constants/soundwaves.json'
import { addToSessionHistory, saveSessionTranscript, generateAndSaveTranscriptSummary } from "@/lib/actions/companion.actions";
import { CompanionComponentProps } from '@/types';
// Add these imports
import { QuizModal } from './QuizModal';
import { generateQuizFromTranscript, saveQuiz, getQuizBySessionId } from '@/lib/actions/quiz.actions';
import { completeLearningSession } from '@/lib/actions/dashboard.actions';
import { generateRealTimeExamples } from '@/lib/actions/companion.actions';
import { ImageCarousel } from './ImageCarousel';
import { Film, Image as ImageIcon, Lightbulb } from 'lucide-react';
import { RealTimeExamplesModal } from './RealTimeExamplesModal';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface DisplayWord {
    text: string;
    id: string;
    isActive: boolean;
}

type MediaMode = 'photo' | 'video';

const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [mediaMode, setMediaMode] = useState<MediaMode>('photo');
    const currentSessionIdRef = useRef<string | null>(null);
    // Add these states
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

    // Real Time Examples states
    const [showExamplesModal, setShowExamplesModal] = useState(false);
    const [generatedExamples, setGeneratedExamples] = useState<string | null>(null);
    const [isGeneratingExamples, setIsGeneratingExamples] = useState(false);

    // Whiteboard animation states
    const [liveWords, setLiveWords] = useState<DisplayWord[]>([]);
    const [completedSentences, setCompletedSentences] = useState<string[]>([]);

    // Refs
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const wordsContainerRef = useRef<HTMLDivElement>(null);
    const lastProcessedRef = useRef<string>('');
    const messagesRef = useRef<SavedMessage[]>([]);

    // Add state for session timing
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

    // Update ref when messages change
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    // Lottie animation effect
    useEffect(() => {
        if (lottieRef.current) {
            if (isSpeaking) {
                lottieRef.current.play();
            } else {
                lottieRef.current.stop();
            }
        }
    }, [isSpeaking]);

    // Auto-scroll to bottom when new words arrive
    useEffect(() => {
        if (wordsContainerRef.current && liveWords.length > 0) {
            const container = wordsContainerRef.current;
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 50);
        }
    }, [liveWords]);

    // Process partial transcript (real-time animation)
    // const processPartialTranscript = (transcript: string) => {
    //     if (!transcript || transcript === lastProcessedRef.current) return;

    //     const words = transcript.split(' ');

    //     // Create display words with unique IDs
    //     const newLiveWords: DisplayWord[] = words.map((word, index) => ({
    //         text: word,
    //         id: `live-${Date.now()}-${index}`,
    //         isActive: index === words.length - 1 // Last word is active
    //     }));

    //     setLiveWords(newLiveWords);
    //     lastProcessedRef.current = transcript;
    // };

    // Process partial transcript (real-time animation)
    const processPartialTranscript = (transcript: string) => {
        if (!transcript || transcript === lastProcessedRef.current) return;

        const words = transcript.split(' ');

        // Create display words with better active word detection
        const newLiveWords: DisplayWord[] = words.map((word, index) => ({
            text: word,
            id: `live-${Date.now()}-${index}-${Math.random()}`,
            isActive: index === words.length - 1 // Last word is active
        }));

        setLiveWords(newLiveWords);
        lastProcessedRef.current = transcript;
    };

    // Process final transcript (sentence complete)
    const processFinalTranscript = (transcript: string) => {
        // Add to completed sentences
        setCompletedSentences(prev => {
            // Avoid duplicates
            if (prev[prev.length - 1] === transcript) return prev;
            return [...prev, transcript];
        });

        // Clear live words
        setLiveWords([]);

        // Add to message history
        const newMessage = { role: 'assistant' as const, content: transcript };
        setMessages((prev) => [newMessage, ...prev]);
    };

    const saveTranscript = async () => {
        const sessionId = currentSessionIdRef.current;
        console.log('Saving transcript...', sessionId, messagesRef.current.length);
        if (sessionId && messagesRef.current.length > 0) {
            currentSessionIdRef.current = null; // Prevent duplicate saves when unmounting
            try {
                // Reverse messages to get chronological order (oldest first)
                const chronologicalMessages = [...messagesRef.current].reverse();
                await saveSessionTranscript(sessionId, chronologicalMessages);
                console.log('Transcript saved successfully');
            } catch (error) {
                console.error('Failed to save transcript:', error);
                currentSessionIdRef.current = sessionId; // Restore if failed
            }
        }
    };

    useEffect(() => {
        // const onCallStart = () => {
        //     setCallStatus(CallStatus.ACTIVE);
        //     // Reset all states
        //     setLiveWords([]);
        //     setCompletedSentences([]);
        //     setMessages([]);
        //     lastProcessedRef.current = '';
        // };

        const onCallStart = async () => {
            setCallStatus(CallStatus.ACTIVE);
            setSessionStartTime(new Date());
            // Create a new session history entry
            try {
                const sessionId = await addToSessionHistory(companionId);
                currentSessionIdRef.current = sessionId;
                console.log('Session created:', sessionId);
            } catch (error) {
                console.error('Failed to create session:', error);
            }

            // Reset all states
            setLiveWords([]);
            setCompletedSentences([]);
            setMessages([]);
            lastProcessedRef.current = '';
        };

        // const onCallEnd = async () => {
        //     setCallStatus(CallStatus.FINISHED);
        //     // addToSessionHistory(companionId);
        //     await saveTranscript();
        //     // console.log('Transcript saved successfully');
        // };

        const onCallEnd = async () => {
            console.log('🔴 Call ended - saving transcript...');
            setCallStatus(CallStatus.FINISHED);

            const sessionId = currentSessionIdRef.current;
            // Record session with duration
            if (sessionStartTime) {
                const endedAt = new Date();
                const durationSeconds = Math.round((endedAt.getTime() - sessionStartTime.getTime()) / 1000);

                // Save the session with duration
                completeLearningSession(companionId, subject, topic, durationSeconds);
            }

            // Also add to session history for backward compatibility
            addToSessionHistory(companionId);

            setSessionStartTime(null);
            if (sessionId && messagesRef.current.length > 0) {
                await saveTranscript();

                // Generate and save transcript summary silently
                try {
                    await generateAndSaveTranscriptSummary(sessionId, messagesRef.current, name);
                } catch (error) {
                    console.error('Failed to generate summary:', error);
                }

                // Check if quiz already exists for this session
                const existingQuiz = await getQuizBySessionId(sessionId);

                if (!existingQuiz) {
                    // Generate quiz automatically
                    setIsGeneratingQuiz(true);
                    try {
                        const questions = await generateQuizFromTranscript(
                            messagesRef.current,
                            name,
                            subject,
                            topic
                        );

                        const quizId = await saveQuiz(sessionId, questions);
                        setGeneratedQuiz({
                            id: quizId,
                            questions
                        });

                        // Show quiz modal after a short delay
                        setTimeout(() => {
                            setShowQuizModal(true);
                            setIsGeneratingQuiz(false);
                        }, 1000);
                    } catch (error) {
                        console.error('Failed to generate quiz:', error);
                        setIsGeneratingQuiz(false);
                    }
                }
            }
        };

        // const onMessage = (message: Message) => {
        //     console.log('VAPI Message:', JSON.stringify(message, null, 2));

        //     if (message.type === 'transcript') {
        //         // Handle assistant messages
        //         if (message.role === 'assistant') {
        //             if (message.transcriptType === 'partial') {
        //                 // Real-time animation during speech
        //                 processPartialTranscript(message.transcript);
        //                 setIsSpeaking(true);
        //             }
        //             else if (message.transcriptType === 'final') {
        //                 // Sentence complete
        //                 processFinalTranscript(message.transcript);
        //             }
        //         }
        //         // Handle user messages
        //         else if (message.role === 'user' && message.transcriptType === 'final') {
        //             const newMessage = { role: 'user' as const, content: message.transcript };
        //             setMessages((prev) => [newMessage, ...prev]);
        //         }
        //     }
        // };
        const onMessage = (message: Message) => {
            console.log('VAPI Message:', JSON.stringify(message, null, 2));

            if (message.type === 'transcript') {
                // Handle assistant messages
                if (message.role === 'assistant') {
                    if (message.transcriptType === 'partial') {
                        // Real-time animation during speech
                        processPartialTranscript(message.transcript);
                        setIsSpeaking(true);
                    }
                    else if (message.transcriptType === 'final') {
                        // Sentence complete
                        processFinalTranscript(message.transcript);
                    }
                }
                // Handle user messages
                else if (message.role === 'user' && message.transcriptType === 'final') {
                    const newMessage = {
                        role: 'user' as const,
                        content: message.transcript,
                        timestamp: new Date().toISOString()
                    };
                    setMessages((prev) => [newMessage, ...prev]);
                }
            }
        };

        const onSpeechStart = () => {
            setIsSpeaking(true);
        };

        const onSpeechEnd = () => {
            setIsSpeaking(false);
        };

        const onError = (error: Error) => console.log('Error', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        return () => {
            saveTranscript(); // Attempt to save if the user navigates away
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
        };
    }, [companionId]);

    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted);
    };

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        const assistantOverrides = {
            variableValues: { subject, topic, style },
            clientMessages: ["transcript"],
            serverMessages: [],
        };

        // @ts-expect-error
        vapi.start(configureAssistant(voice, style), assistantOverrides);
    };

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    };

    const handleGenerateExamples = async () => {
        if (messagesRef.current.length === 0) return;

        setShowExamplesModal(true);
        setIsGeneratingExamples(true);
        setGeneratedExamples(null);

        try {
            // Get messages chronologically
            const chronologicalMessages = [...messagesRef.current].reverse();

            const examples = await generateRealTimeExamples(
                chronologicalMessages,
                name,
                subject,
                topic
            );

            setGeneratedExamples(examples);
        } catch (error) {
            console.error('Failed to generate examples:', error);
            setGeneratedExamples("Failed to generate examples. Please try talking more about the topic first.");
        } finally {
            setIsGeneratingExamples(false);
        }
    };

    return (
        // <section className="flex flex-col h-[70vh]">
        //     <section className="flex gap-8 max-sm:flex-col">
        //         <div className="companion-section flex flex-col h-full min-h-[300px]">
        //             <div className="w-full flex-1 relative min-h-[300px]">
        //                 <ImageCarousel companionName={name} subject={subject} topic={topic} />

        //                 {/* Lottie Animation overlays the carousel when active */}
        //                 <div className={cn('absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0')}>
        //                     <Lottie
        //                         lottieRef={lottieRef}
        //                         animationData={soundwaves}
        //                         autoplay={false}
        //                         className="companion-lottie w-full max-w-[200px]"
        //                     />
        //                 </div>
        //             </div>
        //             <p className="font-bold text-2xl mt-4">{name}</p>
        //         </div>

        <section className="flex flex-col h-[70vh]">
            <section className="flex gap-8 max-sm:flex-col">
                <div className="companion-section flex flex-col h-full min-h-75 flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-bold text-2xl">{name}</p>

                        {/* Media Mode Toggle */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            {/* Real Time Examples Button */}
                            <button
                                onClick={handleGenerateExamples}
                                disabled={isGeneratingExamples}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all mr-2",
                                    "bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-sm"
                                )}
                                title="Generate real-time examples based on your session so far"
                            >
                                <Lightbulb className="w-4 h-4" />
                                <span className="text-sm font-medium whitespace-nowrap hidden sm:inline">Real Time Examples</span>
                            </button>
                            <button
                                onClick={() => setMediaMode('photo')}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
                                    mediaMode === 'photo'
                                        ? "bg-white shadow-sm text-primary"
                                        : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                <ImageIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">Photos</span>
                            </button>
                            <button
                                onClick={() => setMediaMode('video')}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
                                    mediaMode === 'video'
                                        ? "bg-white shadow-sm text-primary"
                                        : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                <Film className="w-4 h-4" />
                                <span className="text-sm font-medium">Videos</span>
                            </button>
                        </div>
                    </div>

                    <div className="w-full flex-1 relative min-h-75">
                        <ImageCarousel
                            companionName={name}
                            subject={subject}
                            topic={topic}
                            isVideoMode={mediaMode === 'video'}
                        />

                        {/* Lottie Animation overlays the carousel when active */}
                        <div className={cn('absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0')}>
                            <Lottie
                                lottieRef={lottieRef}
                                animationData={soundwaves}
                                autoplay={false}
                                className="companion-lottie w-full max-w-50"
                            />
                        </div>
                    </div>
                </div>

                <div className="user-section">
                    <div className="user-avatar">
                        <Image src={userImage} alt={userName} width={130} height={130} className="rounded-lg" />
                        <p className="font-bold text-2xl">
                            {userName}
                        </p>
                    </div>
                    <button className="btn-mic" onClick={toggleMicrophone} disabled={callStatus !== CallStatus.ACTIVE}>
                        <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} alt="mic" width={36} height={36} />
                        <p className="max-sm:hidden">
                            {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
                        </p>
                    </button>
                    <button
                        className={cn(
                            'rounded-lg py-2 cursor-pointer transition-colors w-full text-white',
                            callStatus === CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary',
                            callStatus === CallStatus.CONNECTING && 'animate-pulse'
                        )}
                        onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                    >
                        {callStatus === CallStatus.ACTIVE
                            ? "End Session"
                            : callStatus === CallStatus.CONNECTING
                                ? 'Connecting'
                                : 'Start Session'}
                    </button>
                </div>
            </section>

            {/* Whiteboard Animation Section */}
            {/* Whiteboard Animation Section */}
            {/* Whiteboard Animation Section - SIMPLIFIED */}
            <section className="mt-8 flex-1 flex flex-col min-h-0">
                <div className="whiteboard-container">
                    <div className="whiteboard-header">
                        <span className="whiteboard-title">{name} is explaining:</span>
                        <span className={cn("whiteboard-status", isSpeaking && "speaking")}>
                            {isSpeaking ? (
                                <>
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                                    </span>
                                    Speaking
                                </>
                            ) : '⚪ Listening'}
                        </span>
                    </div>

                    <div className="whiteboard-content" ref={wordsContainerRef}>
                        {/* Completed sentences */}
                        {completedSentences.length > 0 && (
                            <div className="words-wrapper">
                                {completedSentences.map((sentence, sentenceIndex) => (
                                    <div key={`completed-${sentenceIndex}`} className="completed-sentence">
                                        {sentence.split(' ').map((word, wordIndex) => (
                                            <span key={`${sentenceIndex}-${wordIndex}`} className="word-completed">
                                                {word}{' '}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Live words being spoken */}
                        {liveWords.length > 0 && (
                            <div className="words-wrapper live-sentence">
                                {liveWords.map((word, index) => {
                                    // Determine word state
                                    let wordClass = 'word-live';
                                    if (word.isActive) {
                                        wordClass = 'word-active';
                                    } else if (index < liveWords.length - 1) {
                                        wordClass = 'word-spoken';
                                    } else {
                                        wordClass = 'word-upcoming';
                                    }

                                    return (
                                        <span key={word.id} className={wordClass}>
                                            {word.text}{' '}
                                        </span>
                                    );
                                })}
                                {/* Add blinking cursor when speaking */}
                                {isSpeaking && <span className="speaking-cursor"></span>}
                            </div>
                        )}

                        {/* Placeholder when no content */}
                        {completedSentences.length === 0 && liveWords.length === 0 && (
                            <div className="whiteboard-placeholder">
                                {callStatus === CallStatus.ACTIVE
                                    ? '✨ Waiting for AI response...'
                                    : '🎓 Click "Start Session" to begin'}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Transcript Section */}
            {/* <section className="transcript mt-4">
                <div className="transcript-message no-scrollbar">
                    {messages.map((message, index) => (
                        <p key={index} className={cn(
                            "max-sm:text-sm",
                            message.role === 'assistant' ? 'text-gray-700' : 'text-primary'
                        )}>
                            {message.role === 'assistant'
                                ? `${name.split(' ')[0]}: ${message.content}`
                                : `${userName}: ${message.content}`
                            }
                        </p>
                    ))}
                </div>
                <div className="transcript-fade" />
            </section> */}
            {/* Quiz Modal */}
            {showQuizModal && generatedQuiz && (
                <QuizModal
                    isOpen={showQuizModal}
                    onClose={() => setShowQuizModal(false)}
                    quizId={generatedQuiz.id}
                    questions={generatedQuiz.questions}
                    companionName={name}
                    subject={subject}
                />
            )}

            {/* Real Time Examples Modal */}
            <RealTimeExamplesModal
                isOpen={showExamplesModal}
                onClose={() => setShowExamplesModal(false)}
                examples={generatedExamples}
                isGenerating={isGeneratingExamples}
                companionName={name}
                subject={subject}
            />

            {/* Loading indicator for quiz generation */}
            {isGeneratingQuiz && (
                <div className="fixed bottom-4 right-4 bg-white border border-black rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <p>Generating quiz from your session...</p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CompanionComponent;