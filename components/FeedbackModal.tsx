"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { submitFeedback } from "@/lib/actions/feedback.actions";

const moods = [
    { emoji: "😢", label: "Very Bad" },
    { emoji: "😔", label: "Bad" },
    { emoji: "😐", label: "Medium" },
    { emoji: "🙂", label: "Good" },
    { emoji: "🥰", label: "Excellent" },
];

export default function FeedbackModal({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (v: boolean) => void;
}) {
    const [selected, setSelected] = useState(2);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open) return null;

    const handleClose = () => {
        setOpen(false);
        // reset state for next open
        setTimeout(() => {
            setSelected(2);
            setComment("");
            setSubmitted(false);
            setError(null);
        }, 300);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            await submitFeedback({
                mood: selected,
                moodLabel: moods[selected].label,
                comment,
            });
            setSubmitted(true);
        } catch (e: any) {
            setError(e.message ?? "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Feedback</h3>
                    <button onClick={handleClose}>
                        <X className="text-gray-400 hover:text-gray-700" />
                    </button>
                </div>

                <hr className="mb-6" />

                {submitted ? (
                    /* Success state */
                    <div className="text-center py-8">
                        <p className="text-5xl mb-4">🎉</p>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank you!</h2>
                        <p className="text-gray-500 text-sm mb-8">
                            Your feedback helps us improve AskClassroom.
                        </p>
                        <button
                            onClick={handleClose}
                            className="w-full bg-gradient-to-r from-[#02AAA0] to-[#019189] text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                            How are you feeling?
                        </h2>

                        <p className="text-center text-gray-500 text-sm mb-8">
                            Your input helps us improve AskClassroom and deliver a better learning experience.
                        </p>

                        {/* Emoji Selector */}
                        <div className="flex justify-center gap-4 mb-4">
                            {moods.map((mood, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelected(index)}
                                    className={`text-3xl p-4 rounded-full transition ${
                                        selected === index
                                            ? "bg-gradient-to-r from-[#02AAA0] to-[#019189] scale-110 shadow-lg"
                                            : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                >
                                    {mood.emoji}
                                </button>
                            ))}
                        </div>

                        {/* Label */}
                        <p className="text-center text-sm text-gray-600 mb-6">
                            {moods[selected].label}
                        </p>

                        {/* Comment */}
                        <textarea
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#02AAA0] mb-4"
                            rows={4}
                        />

                        {/* Error */}
                        {error && (
                            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
                        )}

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#02AAA0] to-[#019189] text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60"
                        >
                            {loading ? "Submitting…" : "Submit Now"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}