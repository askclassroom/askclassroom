"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { BookOpen, HelpCircle, Brain, MessageCircle } from "lucide-react";

const features = [
    {
        title: "Concept Learning",
        description:
            "Structured learning paths prepared by AI. Short 5–10 minute sessions with curiosity hooks, visual explanations, and understanding checks.",
        icon: BookOpen,
        color: "from-teal-50 to-cyan-50",
        accent: "#02AAA0",
    },
    {
        title: "Homework Help",
        description:
            "Ask any question and get step-by-step explanations. The AI identifies the concept, walks through it, and checks your understanding.",
        icon: HelpCircle,
        color: "from-sky-50 to-blue-50",
        accent: "#0284c7",
    },
    {
        title: "Quiz & Practice",
        description:
            "Reinforce learning with concept quizzes, quick practice questions, and revision sessions while tracking mastery of each topic.",
        icon: Brain,
        color: "from-violet-50 to-purple-50",
        accent: "#7c3aed",
    },
    {
        title: "AI Summary & ChatBot",
        description:
            "Revisit summaries anytime or ask the chatbot about any topic you've previously learned — available 24/7.",
        icon: MessageCircle,
        color: "from-emerald-50 to-green-50",
        accent: "#059669",
        highlight: true,
    },
];

function FeatureCard({
    item,
    index,
}: {
    item: (typeof features)[0];
    index: number;
}) {
    const [hovered, setHovered] = useState(false);
    const Icon = item.icon;

    return (
        <div
            className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm group cursor-default"
            style={{
                transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
                transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
                boxShadow: hovered
                    ? "0 20px 60px rgba(2,170,160,0.18), 0 6px 24px rgba(0,0,0,0.08)"
                    : "0 2px 12px rgba(0,0,0,0.06)",
                animationDelay: `${index * 80}ms`,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Sliding background logo image */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    overflow: "hidden",
                    borderRadius: "inherit",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        bottom: "-10%",
                        right: hovered ? "-5%" : "-60%",
                        width: "60%",
                        aspectRatio: "1",
                        opacity: hovered ? 0.07 : 0,
                        transition: "right 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease",
                        willChange: "right, opacity",
                    }}
                >
                    <Image
                        src="/images/logo-png-cropped.svg"
                        alt=""
                        fill
                        style={{ objectFit: "contain" }}
                        aria-hidden="true"
                    />
                </div>
            </div>

            {/* Top accent bar */}
            <div
                className="absolute top-0 left-0 w-full h-[3px] rounded-t-2xl"
                style={{
                    background: item.accent,
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.4s ease, opacity 0.3s ease",
                }}
            />

            <div className="relative z-10 p-8">
                {/* Icon container */}
                <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5"
                    style={{
                        background: hovered ? item.accent : `${item.accent}18`,
                        transition: "background 0.35s ease",
                    }}
                >
                    <Icon
                        size={26}
                        style={{
                            color: hovered ? "#ffffff" : item.accent,
                            transition: "color 0.35s ease",
                        }}
                    />
                </div>

                <h3
                    className="text-lg font-bold mb-3 text-gray-900"
                    style={{
                        letterSpacing: "-0.01em",
                        transition: "color 0.3s ease",
                    }}
                >
                    {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-gray-500">
                    {item.description}
                </p>

                {/* Bottom learn more */}
                <div
                    className="flex items-center gap-2 mt-6 text-sm font-semibold"
                    style={{
                        color: item.accent,
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? "translateY(0)" : "translateY(6px)",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                    }}
                >
                    <span>Explore feature</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                            d="M1 7h12M8 2l5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default function FourWaysToLearn() {
    return (
        <section className="w-full py-28 px-6 lg:px-20 bg-[#F9FBFB] relative overflow-hidden">

            {/* Subtle background blobs */}
            <div
                className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-30"
                style={{
                    background: "radial-gradient(circle, #02AAA030 0%, transparent 70%)",
                }}
            />
            <div
                className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20"
                style={{
                    background: "radial-gradient(circle, #0284c730 0%, transparent 70%)",
                }}
            />

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <span
                        className="inline-block text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-5"
                        style={{
                            background: "#02AAA015",
                            color: "#02AAA0",
                            border: "1px solid #02AAA030",
                        }}
                    >
                        Learning Features
                    </span>

                    <h2
                        className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        Four Ways to{" "}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #02AAA0 0%, #0284c7 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Learn
                        </span>
                    </h2>

                    <p className="mt-5 text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        Everything you need to master any concept. Structured daily lessons,
                        instant homework help, and fun quizzes — all powered by a
                        conversational AI that adapts to you.
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((item, index) => (
                        <FeatureCard key={index} item={item} index={index} />
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-14">
                    <a
                        href="/companions"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white text-sm"
                        style={{
                            background: "linear-gradient(135deg, #02AAA0 0%, #0284c7 100%)",
                            boxShadow: "0 8px 32px rgba(2,170,160,0.35)",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 40px rgba(2,170,160,0.45)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(2,170,160,0.35)";
                        }}
                    >
                        Start Learning Today
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M3 8h10M9 3l5 5-5 5"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}