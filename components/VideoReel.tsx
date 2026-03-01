'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Volume2, VolumeX, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoReelProps {
    videos: Array<{
        id: string;
        title: string;
        thumbnail: string;
        channelTitle: string;
    }>;
    autoPlay?: boolean;
    onVideoEnd?: () => void;
}

export function VideoReel({ videos, autoPlay = true, onVideoEnd }: VideoReelProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const playerRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const playerReadyRef = useRef(false);

    // Handle video player ready
    useEffect(() => {
        playerReadyRef.current = true;
        setIsLoading(false);
    }, []);

    // Auto advance to next video
    const handleNext = () => {
        if (videos.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % videos.length);
        }
    };

    const handlePrevious = () => {
        if (videos.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
        }
    };

    // Handle fullscreen
    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    if (!videos.length) {
        return (
            <div className="w-full h-full min-h-[300px] flex-1 rounded-xl bg-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                <p className="text-gray-400 text-sm">No videos available</p>
            </div>
        );
    }

    const currentVideo = videos[currentIndex];

    return (
        <div
            ref={containerRef}
            className={cn(
                "w-full h-full min-h-[300px] flex-1 relative rounded-xl overflow-hidden shadow-xl group bg-black",
                isFullscreen && "fixed inset-0 z-50 rounded-none"
            )}
        >
            {/* Video Player */}
            <div className="absolute inset-0">
                <iframe
                    ref={playerRef}
                    src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=${autoPlay ? 1 : 0}&mute=${isMuted ? 1 : 0}&modestbranding=1&rel=0&controls=1&playsinline=1`}
                    title={currentVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    onLoad={() => {
                        setIsLoading(false);
                        playerReadyRef.current = true;
                    }}
                />
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Top Bar - Video Info */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <h3 className="text-white text-sm font-medium line-clamp-1 pr-20">
                    {currentVideo.title}
                </h3>
                <p className="text-white/80 text-xs mt-1">
                    {currentVideo.channelTitle}
                </p>
            </div>

            {/* Controls Overlay */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <button
                    onClick={handlePrevious}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all transform hover:scale-110"
                    disabled={videos.length === 1}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all transform hover:scale-110"
                    disabled={videos.length === 1}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button
                    onClick={toggleFullscreen}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
                >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
            </div>

            {/* Progress Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {videos.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            idx === currentIndex
                                ? "w-8 bg-white"
                                : "w-2 bg-white/50 hover:bg-white/80"
                        )}
                        aria-label={`Go to video ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Video Counter */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 z-20">
                <span className="text-white text-xs">
                    {currentIndex + 1} / {videos.length}
                </span>
            </div>
        </div>
    );
}