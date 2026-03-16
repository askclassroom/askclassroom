"use client";

import { useState } from "react";
import { Star, ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";
import { PublicFeedback } from "@/lib/actions/feedback.actions";

/* ─── Fallback data shown when no DB rows exist yet ─── */


/* ─── Helpers ─── */
/** Map mood 0-4 to star count 1-5 */
const moodToStars = (mood: number) => Math.max(1, Math.min(5, mood + 1));

/** First letter of each word → initials avatar */
const initials = (name: string) =>
    name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

/** Soft colour per initials letter */
const avatarColor = (name: string) => {
    const colors = [
        "bg-violet-100 text-violet-700",
        "bg-blue-100 text-blue-700",
        "bg-teal-100 text-teal-700",
        "bg-pink-100 text-pink-700",
        "bg-amber-100 text-amber-700",
        "bg-green-100 text-green-700",
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
};

/* ─── Component ─── */
interface TestimonialsProps {
    feedbacks?: PublicFeedback[];
}

const CARDS_PER_PAGE = 3;

export default function Testimonials({ feedbacks }: TestimonialsProps) {
    const items = (feedbacks && feedbacks.length > 0) ? feedbacks : [];
    const [page, setPage] = useState(0);

    const totalPages = Math.ceil(items.length / CARDS_PER_PAGE);
    const visible = items.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

    const prev = () => setPage((p) => Math.max(0, p - 1));
    const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

    return (
        <section className="w-full py-20 px-6 lg:px-20 bg-[#F9FBFB]">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            Happy Students
                        </h2>
                        <p className="text-gray-500 mt-2 max-w-xl">
                            Genuine reviews from learners using AskClassroom every day.
                        </p>
                    </div>

                    {/* Pagination arrows — only shown when there are multiple pages */}
                    {totalPages > 1 && (
                        <div className="flex gap-3 items-center">
                            <button
                                onClick={prev}
                                disabled={page === 0}
                                className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <span className="text-sm text-gray-400">
                                {page + 1} / {totalPages}
                            </span>
                            <button
                                onClick={next}
                                disabled={page === totalPages - 1}
                                className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {visible.map((item: any) => {
                        const stars = moodToStars(item.mood);
                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-sm p-6 border hover:shadow-md transition flex flex-col"
                            >
                                {/* Heading */}
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {item.heading ?? item.mood_label}
                                </h3>

                                {/* Stars */}
                                <div className="flex gap-1 text-yellow-400 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            fill={i < stars ? "currentColor" : "none"}
                                            className={i < stars ? "text-yellow-400" : "text-gray-300"}
                                        />
                                    ))}
                                </div>

                                {/* Comment */}
                                <p className="text-gray-500 text-sm mb-6 flex-1 leading-relaxed">
                                    {item.comment ?? (
                                        <span className="italic text-gray-400 flex items-center gap-1">
                                            <MessageSquare size={14} /> No comment
                                        </span>
                                    )}
                                </p>

                                {/* User */}
                                {/* <div className="flex items-center gap-3 border-t pt-4">
                                    <span
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(item.user_name)}`}
                                    >
                                        {initials(item.user_name)}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700">
                                        {item.user_name}
                                    </span>
                                </div> */}
                                {/* User */}
                                <div className="flex items-center gap-3 border-t pt-4">
                                    {item.user_image ? (
                                        // Show actual image if available
                                        <img
                                            src={item.user_image}
                                            alt={item.user_name}
                                            className="w-9 h-9 rounded-full object-cover shrink-0"
                                        />
                                    ) : (
                                        // Fallback to initials avatar
                                        <span
                                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(item.user_name)}`}
                                        >
                                            {initials(item.user_name)}
                                        </span>
                                    )}
                                    <span className="text-sm font-medium text-gray-700">
                                        {item.user_name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Dot indicators */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === page ? "bg-[#02AAA0] w-5" : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}