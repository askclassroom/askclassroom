"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/lib/useScrollReveal";

const GetStarted = () => {
    const sectionRef = useScrollReveal(0.1) as React.RefObject<HTMLElement>;
    const [email, setEmail] = useState("");
    const [focused, setFocused] = useState(false);

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-20 overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #02AAA0 0%, #0284c7 100%)",
            }}
        >
            {/* Background circles */}
            <div
                className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-20"
                style={{ background: "white", filter: "blur(60px)" }}
            />
            <div
                className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15"
                style={{ background: "white", filter: "blur(80px)" }}
            />

            {/* Grid dots */}
            <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            <div className="relative text-center px-6 lg:px-20 space-y-6 max-w-3xl mx-auto">

                <span
                    className="lp-reveal inline-block text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full"
                    style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
                >
                    Get Started
                </span>

                <h2
                    className="lp-reveal lp-delay-1 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight"
                    style={{ letterSpacing: "-0.02em" }}
                >
                    Ready to Start Learning?
                    <br />
                    <span style={{ opacity: 0.85 }}>Join Thousands Today.</span>
                </h2>

                <p className="lp-reveal lp-delay-2 text-white/80 text-lg">
                    Transform the way you learn with AI-powered education tailored just for you.
                </p>

                {/* Email form */}
                <div
                    className="lp-reveal lp-delay-3 flex flex-col sm:flex-row justify-center items-center gap-3 pt-4 max-w-lg mx-auto"
                >
                    <div
                        className="flex-1 w-full flex items-center gap-2 px-5 py-3 rounded-2xl"
                        style={{
                            background: focused ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.92)",
                            boxShadow: focused ? "0 0 0 3px rgba(255,255,255,0.4)" : "none",
                            transition: "background 0.2s ease, box-shadow 0.25s ease",
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                            <path d="M2 4l6 5 6-5M2 4v8h12V4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            placeholder="Enter your email"
                            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                        />
                    </div>

                    <Link href="/sign-in">
                        <button
                            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-semibold text-sm"
                            style={{
                                background: "#1a1a2e",
                                color: "white",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                                transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                const b = e.currentTarget as HTMLButtonElement;
                                b.style.transform = "translateY(-3px) scale(1.04)";
                                b.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
                            }}
                            onMouseLeave={(e) => {
                                const b = e.currentTarget as HTMLButtonElement;
                                b.style.transform = "translateY(0) scale(1)";
                                b.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
                            }}
                        >
                            Sign Up Free →
                        </button>
                    </Link>
                </div>

                <p className="lp-reveal lp-delay-4 text-white/60 text-sm">
                    No credit card required · Cancel anytime
                </p>
            </div>
        </section>
    );
};

export default GetStarted;