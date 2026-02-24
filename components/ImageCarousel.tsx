'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { generateImageKeywords } from '@/lib/actions/companion.actions';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient, Photo } from 'pexels';

interface ImageCarouselProps {
    companionName: string;
    subject: string;
    topic: string;
}

// We can just use the Photo type from 'pexels', but we'll adapt the component to accept it.

export function ImageCarousel({ companionName, subject, topic }: ImageCarouselProps) {
    const [images, setImages] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [keywordsData, setKeywordsData] = useState<{ keywords: string[] } | null>(null);

    const hasFetchedInitial = useRef(false);

    // Initial fetch to get keywords and first page of images
    useEffect(() => {
        const fetchInitialImages = async () => {
            if (hasFetchedInitial.current) return;
            hasFetchedInitial.current = true;

            setIsLoading(true);
            setError(null);

            try {
                const data = await generateImageKeywords(companionName, subject, topic);
                if (!data || data.keywords.length === 0) {
                    throw new Error("Could not generate keywords");
                }
                setKeywordsData(data);

                const mainQuery = data.keywords[0] || `${subject} ${topic}`;
                const pexelsClientId = process.env.NEXT_PUBLIC_PEXELS_CLIENT_ID;
                if (!pexelsClientId) throw new Error("Pexels Client ID is missing");

                const client = createClient(pexelsClientId);
                const res = await client.photos.search({ query: mainQuery, per_page: 10, orientation: 'landscape' });

                if ('photos' in res && res.photos.length > 0) {
                    setImages(res.photos);
                } else {
                    setError("No images found for this topic.");
                }
            } catch (err: any) {
                console.error("Error loading initial images:", err);
                setError("Failed to load images.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialImages();
    }, [companionName, subject, topic]);

    // Fetch more images when we get close to the end of the current list
    useEffect(() => {
        const fetchMoreImages = async () => {
            // Fetch more if we have keywords data, are not loading, and are within 3 images of the end
            if (!keywordsData || isLoading || images.length === 0 || currentIndex < images.length - 3) return;

            setIsLoading(true);
            try {
                // Determine which keyword to use based on the page to get variety
                const keywordIndex = (page) % keywordsData.keywords.length;
                const query = keywordsData.keywords[keywordIndex];

                const nextPage = page + 1;
                const pexelsClientId = process.env.NEXT_PUBLIC_PEXELS_CLIENT_ID;
                if (!pexelsClientId) return;

                const client = createClient(pexelsClientId);
                const res = await client.photos.search({ query, per_page: 10, page: nextPage, orientation: 'landscape' });

                if ('photos' in res && res.photos.length > 0) {
                    setImages(prev => {
                        // Filter out duplicates by ID before adding
                        const existingIds = new Set(prev.map(img => img.id));
                        const newImages = res.photos.filter(img => !existingIds.has(img.id));
                        return [...prev, ...newImages];
                    });
                    setPage(nextPage);
                }
            } catch (err) {
                console.error("Error fetching more images:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMoreImages();
    }, [currentIndex, images.length, keywordsData, page, isLoading]);

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
                        src={images[currentIndex].src.landscape}
                        alt={images[currentIndex].alt || `${subject} visualization`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={currentIndex === 0}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
                        <p className="text-white text-xs opacity-80 backdrop-blur-sm truncate">
                            Photo by {images[currentIndex].photographer} on Pexels
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
