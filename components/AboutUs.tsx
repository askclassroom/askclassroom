"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const features = [
    "Live AI Voice Companions that teach, explain, and respond instantly",
    "Interactive Smart Whiteboard with real-time word-by-word animation",
    "Auto-curated images & YouTube videos based on your live conversation",
    "Instant quizzes, AI summaries & progress tracking after every session",
];

const AboutUs = () => {
    const sectionRef = useScrollReveal(0.1) as React.RefObject<HTMLElement>;

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-white py-28 px-6 lg:px-20 overflow-hidden"
        >
            {/* Decorative blobs */}
            <div
                className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] opacity-25"
                style={{
                    background: "radial-gradient(circle, #02AAA040 0%, transparent 70%)",
                    animation: "lp-blob 16s ease-in-out infinite",
                    borderRadius: "60% 40% 70% 30% / 50% 60% 40% 60%",
                }}
            />
            <div
                className="pointer-events-none absolute -bottom-40 -right-40 w-[400px] h-[400px] opacity-20"
                style={{
                    background: "radial-gradient(circle, #0284c730 0%, transparent 70%)",
                    animation: "lp-blob 20s ease-in-out infinite reverse",
                    borderRadius: "30% 70% 40% 60% / 60% 30% 70% 40%",
                }}
            />

            <div className="relative flex flex-col lg:flex-row items-center gap-16 max-w-7xl mx-auto">

                {/* LEFT IMAGE */}
                <div className="flex-1 lp-reveal-left">
                    <div
                        className="relative w-full max-w-[560px] h-[400px] lg:h-[460px] rounded-3xl overflow-hidden"
                        style={{
                            boxShadow: "0 30px 80px rgba(2,170,160,0.15), 0 8px 30px rgba(0,0,0,0.1)",
                        }}
                    >
                        <Image
                            src="/images/about-us-robot.jpg"
                            alt="Students learning with AI"
                            fill
                            className="object-cover"
                            style={{ transition: "transform 0.6s ease" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                        />

                        {/* Image overlay badge */}
                        <div
                            className="absolute bottom-6 left-6 px-4 py-3 rounded-2xl flex items-center gap-3"
                            style={{
                                background: "rgba(255,255,255,0.95)",
                                backdropFilter: "blur(12px)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                            }}
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg"
                                style={{ background: "linear-gradient(135deg, #02AAA0, #0284c7)" }}
                            >
                                🎓
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-800">AI-Powered</p>
                                <p className="text-xs text-gray-500">Personalized Learning</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex-1 space-y-7">

                    <div className="lp-reveal lp-delay-1">
                        <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full" style={{ background: "#02AAA015", color: "#02AAA0", border: "1px solid #02AAA030" }}>
                            About Us
                        </span>
                    </div>

                    <h2
                        className="lp-reveal lp-delay-2 text-3xl lg:text-4xl font-extrabold text-[#1a1a2e] leading-tight"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        Your Personal AI Classroom —{" "}
                        <span style={{ background: "linear-gradient(135deg, #02AAA0, #0284c7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                            Beyond Just Chat
                        </span>
                    </h2>

                    <p className="lp-reveal lp-delay-3 text-gray-500 text-lg leading-relaxed">
                        TutorTalkAI combines real-time voice tutoring, live visual whiteboards,
                        contextual media, and AI-powered assessments to create a fully immersive
                        one-on-one learning experience — available anytime you need it.
                    </p>

                    {/* Features list */}
                    <div className="space-y-4 pt-2">
                        {features.map((item, i) => (
                            <div
                                key={i}
                                className={`lp-reveal lp-delay-${i + 3} flex items-start gap-4`}
                            >
                                <div
                                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                                    style={{
                                        background: "linear-gradient(135deg, #02AAA015, #02AAA025)",
                                        border: "1px solid #02AAA030",
                                    }}
                                >
                                    <Check className="w-4 h-4 text-[#02AAA0]" strokeWidth={2.5} />
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed pt-1.5">{item}</p>
                            </div>
                        ))}
                    </div>

                    <div className="lp-reveal pt-2">
                        <Link href="/companions">
                            <button
                                className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-2xl font-semibold text-sm"
                                style={{
                                    background: "linear-gradient(135deg, #02AAA0, #0284c7)",
                                    boxShadow: "0 8px 32px rgba(2,170,160,0.35)",
                                    transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    const b = e.currentTarget as HTMLButtonElement;
                                    b.style.transform = "translateY(-3px) scale(1.02)";
                                    b.style.boxShadow = "0 14px 48px rgba(2,170,160,0.45)";
                                }}
                                onMouseLeave={(e) => {
                                    const b = e.currentTarget as HTMLButtonElement;
                                    b.style.transform = "translateY(0) scale(1)";
                                    b.style.boxShadow = "0 8px 32px rgba(2,170,160,0.35)";
                                }}
                            >
                                Get Started Free
                                <span>→</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;