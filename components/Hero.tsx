"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ConceptMasteryCard from "./ConceptMasteryCard";
import LearningStreakCard from "./LearningStreakCard";
import FractionMasteryCard from "./FractionMasteryCard";

// Animated typing words
const rotatingWords = ["AI Tutors", "Smart Quizzes", "Voice Learning", "Instant Help"];

const Hero = () => {
    const [wordIndex, setWordIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const cycle = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setWordIndex((i) => (i + 1) % rotatingWords.length);
                setVisible(true);
            }, 400);
        }, 2800);
        return () => clearInterval(cycle);
    }, []);

    return (
        <>
            {/* HERO SECTION */}
            <section className="relative w-full min-h-[90vh] overflow-hidden" style={{ background: "linear-gradient(135deg, #E8F8F7 0%, #F0FBFA 40%, #EBF7FF 100%)" }}>

                {/* Animated blob decorations */}
                <div
                    className="pointer-events-none absolute -bottom-40 -left-40 w-[600px] h-[600px] opacity-40"
                    style={{
                        background: "radial-gradient(circle, #02AAA040, transparent 70%)",
                        animation: "lp-blob 14s ease-in-out infinite",
                        borderRadius: "60% 40% 70% 30% / 50% 60% 40% 60%",
                    }}
                />
                <div
                    className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] opacity-30"
                    style={{
                        background: "radial-gradient(circle, #0284c740, transparent 70%)",
                        animation: "lp-blob 18s ease-in-out infinite reverse",
                        borderRadius: "30% 70% 40% 60% / 60% 30% 70% 40%",
                    }}
                />

                {/* Grid dots pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: "radial-gradient(rgba(2,170,160,0.25) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />

                {/* Content Wrapper */}
                <div className="relative w-full px-6 lg:px-20 py-10 pt-16 flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* LEFT CONTENT */}
                    <div className="flex-1 space-y-7">

                        {/* Badge */}
                        <div
                            style={{
                                animation: "lp-badge-pop 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both",
                            }}
                        >
                            <span
                                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full"
                                style={{
                                    background: "white",
                                    color: "#02AAA0",
                                    boxShadow: "0 2px 20px rgba(2,170,160,0.18)",
                                    border: "1px solid rgba(2,170,160,0.2)",
                                }}
                            >
                                <span
                                    className="inline-block w-2 h-2 rounded-full"
                                    style={{
                                        background: "#02AAA0",
                                        animation: "lp-glow-pulse 2s infinite",
                                    }}
                                />
                                FREE TRIAL — 30 DAYS
                            </span>
                        </div>

                        {/* Headline */}
                        <div style={{ animation: "lp-fade-up 0.75s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}>
                            <h1
                                className="text-4xl md:text-5xl lg:text-[62px] font-extrabold text-[#1a1a2e] leading-[1.12] max-w-2xl"
                                style={{ letterSpacing: "-0.025em" }}
                            >
                                The Future of
                                <br />
                                Learning Starts with
                                <br />
                                <span
                                    style={{
                                        display: "inline-block",
                                        background: "linear-gradient(135deg, #02AAA0 0%, #0284c7 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                        opacity: visible ? 1 : 0,
                                        transform: visible ? "translateY(0)" : "translateY(12px)",
                                        transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                                    }}
                                >
                                    {rotatingWords[wordIndex]}
                                </span>
                            </h1>
                        </div>

                        {/* Description */}
                        <p
                            className="text-gray-500 text-lg max-w-lg leading-relaxed"
                            style={{ animation: "lp-fade-up 0.75s cubic-bezier(0.22,1,0.36,1) 0.35s both" }}
                        >
                            Experience real-time voice tutoring, interactive whiteboards, and
                            AI-powered quizzes designed to make learning clearer, faster, and
                            more engaging than ever before.
                        </p>

                        {/* CTA Buttons */}
                        <div
                            className="flex flex-wrap gap-4 pt-2"
                            style={{ animation: "lp-fade-up 0.75s cubic-bezier(0.22,1,0.36,1) 0.45s both" }}
                        >
                            <Link href="/companions">
                                <button
                                    className="group relative overflow-hidden text-white px-8 py-4 rounded-2xl font-semibold text-sm"
                                    style={{
                                        background: "linear-gradient(135deg, #02AAA0, #0284c7)",
                                        boxShadow: "0 8px 32px rgba(2,170,160,0.4)",
                                        transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px) scale(1.03)";
                                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 16px 48px rgba(2,170,160,0.45)";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
                                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(2,170,160,0.4)";
                                    }}
                                >
                                    Explore Companions
                                    <span className="ml-2 inline-block" style={{ transition: "transform 0.2s ease" }}>→</span>
                                </button>
                            </Link>

                            <Link href="/my-journey">
                                <button
                                    className="px-8 py-4 rounded-2xl font-semibold text-sm border-2 text-[#02AAA0]"
                                    style={{
                                        borderColor: "#02AAA0",
                                        background: "transparent",
                                        transition: "background 0.25s ease, color 0.25s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                                    }}
                                    onMouseEnter={(e) => {
                                        const b = e.currentTarget as HTMLButtonElement;
                                        b.style.background = "#02AAA0";
                                        b.style.color = "white";
                                        b.style.transform = "translateY(-3px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        const b = e.currentTarget as HTMLButtonElement;
                                        b.style.background = "transparent";
                                        b.style.color = "#02AAA0";
                                        b.style.transform = "translateY(0)";
                                    }}
                                >
                                    My Journey
                                </button>
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div
                            className="flex items-center gap-6 pt-2"
                            style={{ animation: "lp-fade-up 0.75s cubic-bezier(0.22,1,0.36,1) 0.55s both" }}
                        >
                            <div className="flex -space-x-2">
                                {["#02AAA0", "#0284c7", "#7c3aed", "#e11d48"].map((c, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                        style={{ background: c, zIndex: 4 - i }}
                                    >
                                        {["A", "B", "C", "D"][i]}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold text-gray-800">500+</span> students already learning
                            </p>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div
                        className="flex-1 flex justify-center"
                        style={{ animation: "lp-fade-right 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both" }}
                    >
                        <div className="relative w-[450px] h-[580px] lg:w-[520px] lg:h-[660px]">

                            {/* Main image with float */}
                            <div className="lp-float-slow absolute inset-0">
                                <Image
                                    src="/images/hero-image-2.png"
                                    alt="AI Tutor"
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                    style={{ filter: "drop-shadow(0 20px 60px rgba(2,170,160,0.25))" }}
                                />
                            </div>

                            {/* Floating cards */}
                            <div className="absolute left-6 top-24 lp-float" style={{ animationDelay: "0.5s" }}>
                                <FractionMasteryCard />
                            </div>

                            <div className="absolute left-100 -top-23 lp-float-2">
                                <ConceptMasteryCard />
                            </div>

                            <div className="absolute right-0 bottom-20 lp-float-3">
                                <LearningStreakCard />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
                    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12" fill="white">
                        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
                    </svg>
                </div>
            </section>
        </>
    );
};

export default Hero;