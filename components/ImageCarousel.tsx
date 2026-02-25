// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import { generateImageKeywords } from '@/lib/actions/companion.actions';
// import { cn } from '@/lib/utils';
// import { motion, AnimatePresence } from 'framer-motion';
// import { createClient, Photo } from 'pexels';
// import { Loader2, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

// interface ImageCarouselProps {
//     companionName: string;
//     subject: string;
//     topic: string;
//     isVideoMode?: boolean;
// }

// export function ImageCarousel({ companionName, subject, topic, isVideoMode = false }: ImageCarouselProps) {
//     const [images, setImages] = useState<Photo[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [error, setError] = useState<string | null>(null);
//     const [isPaused, setIsPaused] = useState(false);
//     const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

//     const [page, setPage] = useState(1);
//     const [keywordsData, setKeywordsData] = useState<{ keywords: string[] } | null>(null);
//     const [isTransitioning, setIsTransitioning] = useState(false);

//     const hasGeneratedKeywords = useRef(false);
//     const hasFetchedPhotos = useRef(false);
//     const hasFetchedVideos = useRef(false);

//     const intervalRef = useRef<NodeJS.Timeout | null>(null);
//     const imageRefs = useRef<Map<string, HTMLImageElement>>(new Map());

//     // Video states
//     const [videos, setVideos] = useState<any[]>([]);
//     const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//     const videoRef = useRef<HTMLVideoElement>(null);

//     // Preload next images
//     const preloadNextImages = (startIndex: number, count: number = 3) => {
//         const nextIndices = [];
//         for (let i = 1; i <= count; i++) {
//             const nextIndex = (startIndex + i) % images.length;
//             nextIndices.push(nextIndex);
//         }

//         nextIndices.forEach(index => {
//             const image = images[index];
//             if (image && !preloadedImages.has(image.src.landscape)) {
//                 const img = new window.Image();
//                 img.src = image.src.landscape;
//                 img.onload = () => {
//                     setPreloadedImages(prev => new Set(prev).add(image.src.landscape));
//                 };
//                 imageRefs.current.set(image.src.landscape, img);
//             }
//         });
//     };

//     // Fetch keywords initially
//     useEffect(() => {
//         const fetchKeywords = async () => {
//             if (hasGeneratedKeywords.current) return;
//             hasGeneratedKeywords.current = true;
//             try {
//                 const data = await generateImageKeywords(companionName, subject, topic);
//                 if (data && data.keywords.length > 0) {
//                     setKeywordsData(data);
//                 } else {
//                     setError("Could not generate keywords");
//                 }
//             } catch (err) {
//                 console.error("Error generating keywords:", err);
//                 setError("Failed to load keywords.");
//             }
//         };

//         fetchKeywords();
//     }, [companionName, subject, topic]);

//     // Initial fetch to get first page of format-specific media
//     useEffect(() => {
//         const fetchInitialMedia = async () => {
//             if (!keywordsData) return;
//             if (isVideoMode ? hasFetchedVideos.current : hasFetchedPhotos.current) return;

//             setIsLoading(true);
//             setError(null);

//             try {
//                 const mainQuery = keywordsData.keywords[0] || `${subject} ${topic}`;
//                 const pexelsClientId = process.env.NEXT_PUBLIC_PEXELS_CLIENT_ID;
//                 if (!pexelsClientId) throw new Error("Pexels Client ID is missing");

//                 const client = createClient(pexelsClientId);

//                 if (isVideoMode) {
//                     hasFetchedVideos.current = true;
//                     // Fetch videos
//                     const res = await client.videos.search({
//                         query: mainQuery,
//                         per_page: 10,
//                         orientation: 'landscape',
//                         size: 'medium'
//                     });

//                     if ('videos' in res && res.videos.length > 0) {
//                         setVideos(res.videos);
//                         // Preload first video
//                         setTimeout(() => {
//                             if (videoRef.current) {
//                                 videoRef.current.load();
//                             }
//                         }, 100);
//                     } else {
//                         setError("No videos found for this topic.");
//                     }
//                 } else {
//                     hasFetchedPhotos.current = true;
//                     // Fetch photos
//                     const res = await client.photos.search({
//                         query: mainQuery,
//                         per_page: 10,
//                         orientation: 'landscape',
//                         size: 'small'
//                     });

//                     if ('photos' in res && res.photos.length > 0) {
//                         setImages(res.photos);
//                         // Preload next images
//                         preloadNextImages(0, 3);
//                     } else {
//                         setError("No images found for this topic.");
//                     }
//                 }
//             } catch (err: any) {
//                 console.error("Error loading initial media:", err);
//                 setError("Failed to load media.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchInitialMedia();
//     }, [keywordsData, isVideoMode, subject, topic]);

//     // Fetch more images/videos when needed
//     useEffect(() => {
//         const fetchMoreMedia = async () => {
//             if (!keywordsData || isLoading) return;

//             const threshold = isVideoMode ? 3 : 3;
//             const currentList = isVideoMode ? videos : images;

//             if (currentList.length === 0 ||
//                 (isVideoMode ? currentVideoIndex < currentList.length - threshold : currentIndex < currentList.length - threshold)) {
//                 return;
//             }

//             setIsLoading(true);
//             try {
//                 const keywordIndex = (page) % keywordsData.keywords.length;
//                 const query = keywordsData.keywords[keywordIndex];
//                 const nextPage = page + 1;

//                 const pexelsClientId = process.env.NEXT_PUBLIC_PEXELS_CLIENT_ID;
//                 if (!pexelsClientId) return;

//                 const client = createClient(pexelsClientId);

//                 if (isVideoMode) {
//                     const res = await client.videos.search({
//                         query,
//                         per_page: 10,
//                         page: nextPage,
//                         orientation: 'landscape'
//                     });

//                     if ('videos' in res && res.videos.length > 0) {
//                         setVideos(prev => {
//                             const existingIds = new Set(prev.map(v => v.id));
//                             const newVideos = res.videos.filter(v => !existingIds.has(v.id));
//                             return [...prev, ...newVideos];
//                         });
//                         setPage(nextPage);
//                     }
//                 } else {
//                     const res = await client.photos.search({
//                         query,
//                         per_page: 10,
//                         page: nextPage,
//                         orientation: 'landscape'
//                     });

//                     if ('photos' in res && res.photos.length > 0) {
//                         setImages(prev => {
//                             const existingIds = new Set(prev.map(img => img.id));
//                             const newImages = res.photos.filter(img => !existingIds.has(img.id));
//                             return [...prev, ...newImages];
//                         });
//                         setPage(nextPage);
//                     }
//                 }
//             } catch (err) {
//                 console.error("Error fetching more media:", err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchMoreMedia();
//     }, [isVideoMode ? currentVideoIndex : currentIndex, isVideoMode ? videos.length : images.length, keywordsData, page, isLoading]);

//     // Auto-advance carousel
//     useEffect(() => {
//         if (isVideoMode) {
//             // Video mode - handle video end
//             const video = videoRef.current;
//             if (video) {
//                 const handleVideoEnd = () => {
//                     if (!isPaused) {
//                         setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
//                     }
//                 };
//                 video.addEventListener('ended', handleVideoEnd);
//                 return () => video.removeEventListener('ended', handleVideoEnd);
//             }
//         } else {
//             // Image mode - auto advance
//             if (images.length <= 1 || isPaused) return;

//             intervalRef.current = setInterval(() => {
//                 if (!isTransitioning) {
//                     setIsTransitioning(true);
//                     setCurrentIndex((prev) => {
//                         const nextIndex = (prev + 1) % images.length;
//                         preloadNextImages(nextIndex, 2);
//                         return nextIndex;
//                     });
//                     setTimeout(() => setIsTransitioning(false), 800);
//                 }
//             }, 5000);

//             return () => {
//                 if (intervalRef.current) {
//                     clearInterval(intervalRef.current);
//                 }
//             };
//         }
//     }, [images.length, isPaused, isTransitioning, isVideoMode, videos.length]);

//     // Preload when index changes
//     useEffect(() => {
//         if (!isVideoMode && images.length > 0) {
//             preloadNextImages(currentIndex, 2);
//         }
//     }, [currentIndex, images]);

//     const handlePrevious = () => {
//         if (isTransitioning) return;

//         setIsTransitioning(true);
//         if (isVideoMode) {
//             setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
//         } else {
//             setCurrentIndex((prev) => {
//                 const newIndex = (prev - 1 + images.length) % images.length;
//                 preloadNextImages(newIndex, 2);
//                 return newIndex;
//             });
//         }
//         setTimeout(() => setIsTransitioning(false), 800);
//     };

//     const handleNext = () => {
//         if (isTransitioning) return;

//         setIsTransitioning(true);
//         if (isVideoMode) {
//             setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
//         } else {
//             setCurrentIndex((prev) => {
//                 const newIndex = (prev + 1) % images.length;
//                 preloadNextImages(newIndex, 2);
//                 return newIndex;
//             });
//         }
//         setTimeout(() => setIsTransitioning(false), 800);
//     };

//     const togglePause = () => {
//         setIsPaused(!isPaused);
//         if (isVideoMode && videoRef.current) {
//             if (isPaused) {
//                 videoRef.current.play();
//             } else {
//                 videoRef.current.pause();
//             }
//         }
//     };

//     if (isLoading && (isVideoMode ? videos.length === 0 : images.length === 0)) {
//         return (
//             <div className="w-full h-full min-h-[300px] flex-1 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center shadow-sm overflow-hidden">
//                 <div className="flex flex-col items-center gap-3">
//                     <Loader2 className="w-8 h-8 animate-spin text-primary" />
//                     <p className="text-gray-500 text-sm">Loading {isVideoMode ? 'videos' : 'images'}...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error || (isVideoMode ? videos.length === 0 : images.length === 0)) {
//         return (
//             <div className="w-full h-full min-h-[300px] flex-1 rounded-xl bg-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
//                 <p className="text-gray-400 text-sm">No media available</p>
//             </div>
//         );
//     }

//     return (
//         <div className="w-full h-full min-h-[300px] flex-1 relative rounded-xl overflow-hidden shadow-xl group bg-black/5">
//             {/* Main Media Display */}
//             <AnimatePresence mode="wait">
//                 <motion.div
//                     key={isVideoMode ? videos[currentVideoIndex]?.id : images[currentIndex]?.id}
//                     initial={{ opacity: 0, scale: 1.1 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{
//                         duration: 0.7,
//                         ease: [0.4, 0, 0.2, 1]
//                     }}
//                     className="absolute inset-0"
//                 >
//                     {isVideoMode ? (
//                         <video
//                             ref={videoRef}
//                             key={videos[currentVideoIndex]?.id}
//                             src={videos[currentVideoIndex]?.video_files.find(
//                                 (f: any) => f.quality === 'hd' || f.quality === 'sd'
//                             )?.link}
//                             autoPlay
//                             muted={true}
//                             loop={false}
//                             playsInline
//                             className="w-full h-full object-cover"
//                             poster={videos[currentVideoIndex]?.image}
//                         />
//                     ) : (
//                         <Image
//                             src={images[currentIndex].src.landscape}
//                             alt={images[currentIndex].alt || `${subject} visualization`}
//                             fill
//                             className="object-cover transition-transform duration-700 hover:scale-105"
//                             sizes="(max-width: 768px) 100vw, 50vw"
//                             priority={currentIndex === 0}
//                             loading={currentIndex === 0 ? 'eager' : 'lazy'}
//                         />
//                     )}

//                     {/* Gradient Overlay */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                     {/* Attribution */}
//                     <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
//                         <p className="text-white text-xs opacity-90 backdrop-blur-sm truncate">
//                             {isVideoMode ? (
//                                 <>Video by {videos[currentVideoIndex]?.user?.name} on Pexels</>
//                             ) : (
//                                 <>Photo by {images[currentIndex].photographer} on Pexels</>
//                             )}
//                         </p>
//                     </div>
//                 </motion.div>
//             </AnimatePresence>

//             {/* Navigation Controls */}
//             <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                 <button
//                     onClick={handlePrevious}
//                     className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all transform hover:scale-110"
//                     disabled={isTransitioning}
//                 >
//                     <ChevronLeft className="w-6 h-6" />
//                 </button>
//                 <button
//                     onClick={handleNext}
//                     className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all transform hover:scale-110"
//                     disabled={isTransitioning}
//                 >
//                     <ChevronRight className="w-6 h-6" />
//                 </button>
//             </div>

//             {/* Top Controls */}
//             <div className="absolute top-4 right-4 flex gap-2 z-10">
//                 <button
//                     onClick={togglePause}
//                     className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
//                 >
//                     {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
//                 </button>
//             </div>

//             {/* Loading Indicator for Next Media */}
//             {isLoading && (
//                 <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
//                     <Loader2 className="w-4 h-4 animate-spin text-white" />
//                     <span className="text-white text-xs">Loading next...</span>
//                 </div>
//             )}

//             {/* Progress Indicators */}
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
//                 {(isVideoMode ? videos : images).map((_, idx) => (
//                     <button
//                         key={idx}
//                         onClick={() => {
//                             if (isVideoMode) {
//                                 setCurrentVideoIndex(idx);
//                             } else {
//                                 setCurrentIndex(idx);
//                                 preloadNextImages(idx, 2);
//                             }
//                         }}
//                         className={cn(
//                             "h-1.5 rounded-full transition-all duration-300",
//                             idx === (isVideoMode ? currentVideoIndex : currentIndex)
//                                 ? "w-8 bg-white"
//                                 : "w-2 bg-white/50 hover:bg-white/80"
//                         )}
//                         aria-label={`Go to ${isVideoMode ? 'video' : 'image'} ${idx + 1}`}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// }

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { generateImageKeywords } from '@/lib/actions/companion.actions';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient, Photo } from 'pexels';
import { Loader2, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface ImageCarouselProps {
    companionName: string;
    subject: string;
    topic: string;
    isVideoMode?: boolean;
}

export function ImageCarousel({ companionName, subject, topic, isVideoMode = false }: ImageCarouselProps) {
    const [images, setImages] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

    const [page, setPage] = useState(1);
    const [keywordsData, setKeywordsData] = useState<{ keywords: string[] } | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const hasGeneratedKeywords = useRef(false);
    const hasFetchedPhotos = useRef(false);
    const hasFetchedVideos = useRef(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const imageRefs = useRef<Map<string, HTMLImageElement>>(new Map());

    // Video states
    const [videos, setVideos] = useState<any[]>([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Add state for transcript-based keyword
    const [transcriptKeyword, setTranscriptKeyword] = useState<string>("");
    const [useTranscriptMode, setUseTranscriptMode] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Preload next images
    const preloadNextImages = useCallback((startIndex: number, count: number = 3) => {
        const nextIndices = [];
        for (let i = 1; i <= count; i++) {
            const nextIndex = (startIndex + i) % images.length;
            nextIndices.push(nextIndex);
        }

        nextIndices.forEach(index => {
            const image = images[index];
            if (image && !preloadedImages.has(image.src.landscape)) {
                const img = new window.Image();
                img.src = image.src.landscape;
                img.onload = () => {
                    setPreloadedImages(prev => new Set(prev).add(image.src.landscape));
                };
                imageRefs.current.set(image.src.landscape, img);
            }
        });
    }, [images, preloadedImages]);

    const fetchMediaWithKeyword = useCallback(async (keyword: string) => {
        // Cancel any ongoing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        setError(null);

        try {
            const pexelsClientId = process.env.NEXT_PUBLIC_PEXELS_CLIENT_ID;
            if (!pexelsClientId) throw new Error("Pexels Client ID is missing");

            const client = createClient(pexelsClientId);

            if (isVideoMode) {
                const res = await client.videos.search({
                    query: keyword,
                    per_page: 5,
                    orientation: 'landscape',
                    size: 'medium'
                });

                if ('videos' in res && res.videos.length > 0) {
                    setVideos(prev => {
                        // Keep some old videos but prioritize new ones
                        const newVideos = res.videos.filter(v => !prev.some(p => p.id === v.id));
                        return [...newVideos, ...prev.slice(0, 3)];
                    });
                    setCurrentVideoIndex(0); // Start with first new video
                }
            } else {
                const res = await client.photos.search({
                    query: keyword,
                    per_page: 5,
                    orientation: 'landscape',
                    size: 'small'
                });

                if ('photos' in res && res.photos.length > 0) {
                    setImages(prev => {
                        // Keep some old images but prioritize new ones
                        const newImages = res.photos.filter(img => !prev.some(p => p.id === img.id));
                        return [...newImages, ...prev.slice(0, 3)];
                    });
                    setCurrentIndex(0); // Start with first new image
                    setTimeout(() => preloadNextImages(0, 2), 100);
                }
            }
        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('Request was cancelled');
            } else {
                console.error("Error fetching media with keyword:", err);
                setError("Failed to load media.");
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [isVideoMode, preloadNextImages]);

    // Listen for transcript keyword updates
    useEffect(() => {
        const handleTranscriptKeyword = async (e: Event) => {
            const event = e as CustomEvent;
            const { keyword, isVideoMode: eventIsVideoMode } = event.detail;

            // Only respond if the media mode matches
            if (eventIsVideoMode === isVideoMode) {
                console.log('📸 Received transcript keyword:', keyword);
                setTranscriptKeyword(keyword);
                setUseTranscriptMode(true);

                // Reset the transcript mode timer
                const timer = setTimeout(() => {
                    setUseTranscriptMode(false);
                    // Optionally refresh with original keywords
                    if (keywordsData) {
                        fetchMediaWithKeyword(keywordsData.keywords[0]);
                    }
                }, 30000); // 30 seconds

                // Fetch media with this new keyword
                await fetchMediaWithKeyword(keyword);

                return () => clearTimeout(timer);
            }
        };

        window.addEventListener('transcriptKeywordUpdate', handleTranscriptKeyword);

        return () => {
            window.removeEventListener('transcriptKeywordUpdate', handleTranscriptKeyword);
        };
    }, [isVideoMode, fetchMediaWithKeyword, keywordsData]);

    // Fetch keywords initially
    useEffect(() => {
        const fetchKeywords = async () => {
            if (hasGeneratedKeywords.current) return;
            hasGeneratedKeywords.current = true;
            try {
                const data = await generateImageKeywords(companionName, subject, topic);
                if (data && data.keywords.length > 0) {
                    setKeywordsData(data);
                    // Set the first keyword as initial
                    setTranscriptKeyword(data.keywords[0]);
                } else {
                    setError("Could not generate keywords");
                }
            } catch (err) {
                console.error("Error generating keywords:", err);
                setError("Failed to load keywords.");
            }
        };

        fetchKeywords();
    }, [companionName, subject, topic]);

    // Initial fetch to get first page of format-specific media
    useEffect(() => {
        const fetchInitialMedia = async () => {
            if (!keywordsData) return;
            if (isVideoMode ? hasFetchedVideos.current : hasFetchedPhotos.current) return;
            if (useTranscriptMode) return; // Don't fetch initial if in transcript mode

            setIsLoading(true);
            setError(null);

            try {
                const mainQuery = keywordsData.keywords[0] || `${subject} ${topic}`;
                const pexelsClientId = process.env.NEXT_PUBLIC_PEXELS_CLIENT_ID;
                if (!pexelsClientId) throw new Error("Pexels Client ID is missing");

                const client = createClient(pexelsClientId);

                if (isVideoMode) {
                    hasFetchedVideos.current = true;
                    // Fetch videos
                    const res = await client.videos.search({
                        query: mainQuery,
                        per_page: 10,
                        orientation: 'landscape',
                        size: 'medium'
                    });

                    if ('videos' in res && res.videos.length > 0) {
                        setVideos(res.videos);
                        // Preload first video
                        setTimeout(() => {
                            if (videoRef.current) {
                                videoRef.current.load();
                            }
                        }, 100);
                    } else {
                        setError("No videos found for this topic.");
                    }
                } else {
                    hasFetchedPhotos.current = true;
                    // Fetch photos
                    const res = await client.photos.search({
                        query: mainQuery,
                        per_page: 10,
                        orientation: 'landscape',
                        size: 'small'
                    });

                    if ('photos' in res && res.photos.length > 0) {
                        setImages(res.photos);
                        // Preload next images
                        setTimeout(() => preloadNextImages(0, 3), 100);
                    } else {
                        setError("No images found for this topic.");
                    }
                }
            } catch (err: any) {
                console.error("Error loading initial media:", err);
                setError("Failed to load media.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialMedia();
    }, [keywordsData, isVideoMode, subject, topic, preloadNextImages, useTranscriptMode]);

    // Fetch more images/videos when needed (only if not in transcript mode)
    useEffect(() => {
        const fetchMoreMedia = async () => {
            if (useTranscriptMode) return; // Don't fetch more in transcript mode
            if (!keywordsData || isLoading) return;

            const threshold = 3;
            const currentList = isVideoMode ? videos : images;

            if (currentList.length === 0) return;

            const currentPos = isVideoMode ? currentVideoIndex : currentIndex;
            if (currentPos < currentList.length - threshold) return;

            setIsLoading(true);
            try {
                const keywordIndex = (page) % keywordsData.keywords.length;
                const query = keywordsData.keywords[keywordIndex];
                const nextPage = page + 1;

                const pexelsClientId = process.env.NEXT_PUBLIC_PEXELS_CLIENT_ID;
                if (!pexelsClientId) return;

                const client = createClient(pexelsClientId);

                if (isVideoMode) {
                    const res = await client.videos.search({
                        query,
                        per_page: 10,
                        page: nextPage,
                        orientation: 'landscape'
                    });

                    if ('videos' in res && res.videos.length > 0) {
                        setVideos(prev => {
                            const existingIds = new Set(prev.map(v => v.id));
                            const newVideos = res.videos.filter(v => !existingIds.has(v.id));
                            return [...prev, ...newVideos];
                        });
                        setPage(nextPage);
                    }
                } else {
                    const res = await client.photos.search({
                        query,
                        per_page: 10,
                        page: nextPage,
                        orientation: 'landscape'
                    });

                    if ('photos' in res && res.photos.length > 0) {
                        setImages(prev => {
                            const existingIds = new Set(prev.map(img => img.id));
                            const newImages = res.photos.filter(img => !existingIds.has(img.id));
                            return [...prev, ...newImages];
                        });
                        setPage(nextPage);
                    }
                }
            } catch (err) {
                console.error("Error fetching more media:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMoreMedia();
    }, [isVideoMode ? currentVideoIndex : currentIndex, isVideoMode ? videos.length : images.length, keywordsData, page, isLoading, useTranscriptMode]);

    // Auto-advance carousel
    useEffect(() => {
        if (isVideoMode) {
            // Video mode - handle video end
            const video = videoRef.current;
            if (video) {
                const handleVideoEnd = () => {
                    if (!isPaused) {
                        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
                    }
                };
                video.addEventListener('ended', handleVideoEnd);
                return () => video.removeEventListener('ended', handleVideoEnd);
            }
        } else {
            // Image mode - auto advance
            if (images.length <= 1 || isPaused) return;

            intervalRef.current = setInterval(() => {
                if (!isTransitioning) {
                    setIsTransitioning(true);
                    setCurrentIndex((prev) => {
                        const nextIndex = (prev + 1) % images.length;
                        preloadNextImages(nextIndex, 2);
                        return nextIndex;
                    });
                    setTimeout(() => setIsTransitioning(false), 800);
                }
            }, 5000);

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [images.length, isPaused, isTransitioning, isVideoMode, videos.length, preloadNextImages]);

    // Preload when index changes
    useEffect(() => {
        if (!isVideoMode && images.length > 0) {
            preloadNextImages(currentIndex, 2);
        }
    }, [currentIndex, images, preloadNextImages, isVideoMode]);

    const handlePrevious = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        if (isVideoMode) {
            setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
        } else {
            setCurrentIndex((prev) => {
                const newIndex = (prev - 1 + images.length) % images.length;
                preloadNextImages(newIndex, 2);
                return newIndex;
            });
        }
        setTimeout(() => setIsTransitioning(false), 800);
    }, [isTransitioning, isVideoMode, videos.length, images.length, preloadNextImages]);

    const handleNext = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        if (isVideoMode) {
            setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
        } else {
            setCurrentIndex((prev) => {
                const newIndex = (prev + 1) % images.length;
                preloadNextImages(newIndex, 2);
                return newIndex;
            });
        }
        setTimeout(() => setIsTransitioning(false), 800);
    }, [isTransitioning, isVideoMode, videos.length, images.length, preloadNextImages]);

    const togglePause = useCallback(() => {
        setIsPaused(!isPaused);
        if (isVideoMode && videoRef.current) {
            if (isPaused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPaused, isVideoMode]);

    if (isLoading && (isVideoMode ? videos.length === 0 : images.length === 0)) {
        return (
            <div className="w-full h-full min-h-[300px] flex-1 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center shadow-sm overflow-hidden">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-gray-500 text-sm">Loading {isVideoMode ? 'videos' : 'images'}...</p>
                </div>
            </div>
        );
    }

    if (error || (isVideoMode ? videos.length === 0 : images.length === 0)) {
        return (
            <div className="w-full h-full min-h-[300px] flex-1 rounded-xl bg-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                <p className="text-gray-400 text-sm">No media available</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[300px] flex-1 relative rounded-xl overflow-hidden shadow-xl group bg-black/5">
            {/* AI-synced visuals badge */}
            {useTranscriptMode && (
                <div className="absolute top-4 left-4 bg-blue-500/80 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 z-20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <span className="text-white text-xs">AI-synced visuals</span>
                </div>
            )}

            {/* Main Media Display */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={isVideoMode ? videos[currentVideoIndex]?.id : images[currentIndex]?.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                        duration: 0.7,
                        ease: [0.4, 0, 0.2, 1]
                    }}
                    className="absolute inset-0"
                >
                    {isVideoMode ? (
                        <video
                            ref={videoRef}
                            key={videos[currentVideoIndex]?.id}
                            src={videos[currentVideoIndex]?.video_files.find(
                                (f: any) => f.quality === 'hd' || f.quality === 'sd'
                            )?.link}
                            autoPlay
                            muted={true}
                            loop={false}
                            playsInline
                            className="w-full h-full object-cover"
                            poster={videos[currentVideoIndex]?.image}
                        />
                    ) : (
                        <Image
                            src={images[currentIndex].src.landscape}
                            alt={images[currentIndex].alt || `${subject} visualization`}
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={currentIndex === 0}
                            loading={currentIndex === 0 ? 'eager' : 'lazy'}
                        />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Attribution */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-xs opacity-90 backdrop-blur-sm truncate">
                            {isVideoMode ? (
                                <>Video by {videos[currentVideoIndex]?.user?.name} on Pexels</>
                            ) : (
                                <>Photo by {images[currentIndex].photographer} on Pexels</>
                            )}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={handlePrevious}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all transform hover:scale-110"
                    disabled={isTransitioning}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all transform hover:scale-110"
                    disabled={isTransitioning}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Top Controls */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                    onClick={togglePause}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
                >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </button>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 z-20">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span className="text-white text-xs">Loading next...</span>
                </div>
            )}

            {/* Progress Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {(isVideoMode ? videos : images).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            if (isVideoMode) {
                                setCurrentVideoIndex(idx);
                            } else {
                                setCurrentIndex(idx);
                                preloadNextImages(idx, 2);
                            }
                        }}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            idx === (isVideoMode ? currentVideoIndex : currentIndex)
                                ? "w-8 bg-white"
                                : "w-2 bg-white/50 hover:bg-white/80"
                        )}
                        aria-label={`Go to ${isVideoMode ? 'video' : 'image'} ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}