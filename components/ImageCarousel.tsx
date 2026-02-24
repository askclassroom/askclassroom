'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { generateImageKeywords } from '@/lib/actions/companion.actions';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCarouselProps {
    companionName: string;
    subject: string;
    topic: string;
}

interface UnsplashPhoto {
    id: string;
    urls: {
        regular: string;
        small: string;
    };
    alt_description: string;
    user: {
        name: string;
    };
}

export function ImageCarousel({ companionName, subject, topic }: ImageCarouselProps) {
    const [images, setImages] = useState<UnsplashPhoto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const hasFetched = useRef(false);

    useEffect(() => {
        const fetchImages = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;

            setIsLoading(true);
            setError(null);

            try {
                // 1. Generate keywords
                const keywordsData = await generateImageKeywords(companionName, subject, topic);
                if (!keywordsData || keywordsData.keywords.length === 0) {
                    throw new Error("Could not generate keywords");
                }

                // We'll just construct a generic query based on the companion details to guarantee more cohesive results 
                // Alternatively, we use the first AI generated keyword as the main query, and fetch multiple images
                const mainQuery = keywordsData.keywords[0] || `${subject} ${topic}`;

                // 2. Fetch from Unsplash
                const unsplashClientId = process.env.NEXT_PUBLIC_UNSPLASH_CLIENT_ID;
                console.log("Unsplash Client ID:", unsplashClientId);

                // Fetch up to 5 distinct photos for the query to create the carousel
                const res = await fetch(`https://api.unsplash.com/search/photos?client_id=${unsplashClientId}&query=${encodeURIComponent(mainQuery)}&per_page=5&orientation=landscape`);

                if (!res.ok) {
                    throw new Error(`Unsplash API error: ${res.status}`);
                }

                const data = await res.json();

                if (data.results && data.results.length > 0) {
                    setImages(data.results);
                } else {
                    setError("No images found for this topic.");
                }
            } catch (err: any) {
                console.error("Error loading images:", err);
                setError("Failed to load images.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, [companionName, subject, topic]);

    // Auto-advance carousel
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [images]);

    if (isLoading && images.length === 0) {
        return (
            <div className="w-full h-full min-h-[300px] flex-1 rounded-xl bg-gray-100 animate-pulse flex items-center justify-center shadow-sm overflow-hidden">
                <p className="text-gray-400 text-sm">Visualizing {subject}...</p>
            </div>
        );
    }

    if (error || images.length === 0) {
        return null; // Silently fail UI without taking up space
    }

    return (
        <div className="w-full h-full min-h-[300px] flex-1 relative rounded-xl overflow-hidden shadow-lg group bg-black/5">
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={images[currentIndex]?.id || currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={images[currentIndex].urls.regular}
                        alt={images[currentIndex].alt_description || `${subject} visualization`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={currentIndex === 0}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
                        <p className="text-white text-xs opacity-80 backdrop-blur-sm truncate">
                            Photo by {images[currentIndex].user.name} on Unsplash
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Carousel indicators */}
            {images.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                idx === currentIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
                            )}
                            aria-label={`Go to image ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
