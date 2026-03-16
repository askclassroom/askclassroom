"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Twitter, Linkedin, Instagram, ArrowUpRight, Send } from "lucide-react";

// ── Nav links that actually exist in the webapp ──────────────────────────────
const exploreLinks = [
    { label: "Home", href: "/" },
    { label: "Companions", href: "/companions" },
    { label: "My Journey", href: "/my-journey" },
    { label: "Dashboard", href: "/my-dashboard" },
];

const legalLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
];

const socialLinks = [
    {
        icon: Twitter,
        href: "https://twitter.com",
        label: "Twitter",
        color: "#1d9bf0",
    },
    {
        icon: Linkedin,
        href: "https://linkedin.com",
        label: "LinkedIn",
        color: "#0a66c2",
    },
    {
        icon: Instagram,
        href: "https://instagram.com",
        label: "Instagram",
        color: "#e1306c",
    },
];

// ── Animated link component ───────────────────────────────────────────────────
function FooterLink({ href, label }: { href: string; label: string }) {
    const [hovered, setHovered] = useState(false);
    const isExternal = href.startsWith("http");

    return (
        <li>
            <Link
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group inline-flex items-center gap-1.5 text-sm transition-colors duration-200"
                style={{ color: hovered ? "#02AAA0" : "#94a3b8" }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <span
                    style={{
                        display: "inline-block",
                        transform: hovered ? "translateX(3px)" : "translateX(0)",
                        transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                >
                    {label}
                </span>
                {isExternal && (
                    <ArrowUpRight
                        size={13}
                        style={{
                            opacity: hovered ? 1 : 0,
                            transform: hovered ? "translate(1px,-1px)" : "translate(0,0)",
                            transition: "opacity 0.2s ease, transform 0.25s ease",
                        }}
                    />
                )}
            </Link>
        </li>
    );
}

// ── Social icon button ────────────────────────────────────────────────────────
function SocialButton({
    icon: Icon,
    href,
    label,
    color,
}: {
    icon: React.ElementType;
    href: string;
    label: string;
    color: string;
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
                background: hovered ? color : "rgba(255,255,255,0.07)",
                border: `1px solid ${hovered ? color : "rgba(255,255,255,0.1)"}`,
                transform: hovered ? "translateY(-3px) scale(1.08)" : "translateY(0) scale(1)",
                transition: "background 0.25s ease, border-color 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Icon size={16} color={hovered ? "#fff" : "#94a3b8"} style={{ transition: "color 0.2s ease" }} />
        </a>
    );
}

// ── Main Footer ───────────────────────────────────────────────────────────────
const Footer = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubmitted(true);
            setEmail("");
        }
    };

    return (
        <footer className="relative w-full bg-[#070D1A] text-gray-300 overflow-hidden">

            {/* Top gradient separator */}
            <div
                className="absolute top-0 left-0 w-full h-px"
                style={{
                    background: "linear-gradient(90deg, transparent 0%, #02AAA060 30%, #0284c760 70%, transparent 100%)",
                }}
            />

            {/* Ambient glow */}
            <div
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px]"
                style={{
                    background: "radial-gradient(ellipse at top, rgba(2,170,160,0.07) 0%, transparent 65%)",
                }}
            />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-20 pt-20 pb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16">

                    {/* ── Brand column ── */}
                    <div className="lg:col-span-4 space-y-6">

                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div
                                className="rounded-xl overflow-hidden p-1"
                                style={{
                                    background: "rgba(2,170,160,0.08)",
                                    border: "1px solid rgba(2,170,160,0.2)",
                                    transition: "border-color 0.3s ease",
                                }}
                            >
                                <Image
                                    src="/images/logo-png-dark.svg"
                                    alt="TutorTalkAI Logo"
                                    width={48}
                                    height={48}
                                    style={{ display: "block" }}
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold tracking-tight leading-none">
                                    <span className="text-white">Tutor</span>
                                    <span style={{ color: "#02AAA0" }}>TalkAI</span>
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5 font-medium tracking-wide">
                                    Support Beyond The Classroom
                                </p>
                            </div>
                        </Link>

                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Empowering learners of every grade with AI-driven education —
                            personalised sessions, instant homework help, and quizzes that
                            adapt to you.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-3 pt-1">
                            {socialLinks.map((s) => (
                                <SocialButton key={s.label} {...s} />
                            ))}
                        </div>
                    </div>

                    {/* ── Explore column ── */}
                    <div className="lg:col-span-2">
                        <h3 className="text-white text-sm font-semibold uppercase tracking-[0.12em] mb-6">
                            Explore
                        </h3>
                        <ul className="space-y-3">
                            {exploreLinks.map((l) => (
                                <FooterLink key={l.href} {...l} />
                            ))}
                        </ul>
                    </div>

                    {/* ── Legal column ── */}
                    <div className="lg:col-span-2">
                        <h3 className="text-white text-sm font-semibold uppercase tracking-[0.12em] mb-6">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            {legalLinks.map((l) => (
                                <FooterLink key={l.href} {...l} />
                            ))}
                        </ul>
                    </div>

                    {/* ── Newsletter column ── */}
                    <div className="lg:col-span-4">
                        <h3 className="text-white text-sm font-semibold uppercase tracking-[0.12em] mb-4">
                            Stay in the Loop
                        </h3>
                        <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                            Get learning tips, feature updates and new companion alerts — directly to your inbox.
                        </p>

                        {submitted ? (
                            <div
                                className="flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium"
                                style={{
                                    background: "rgba(2,170,160,0.12)",
                                    border: "1px solid rgba(2,170,160,0.35)",
                                    color: "#02AAA0",
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <circle cx="9" cy="9" r="8" stroke="#02AAA0" strokeWidth="1.5" />
                                    <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="#02AAA0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                You&rsquo;re in! Check your inbox soon.
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                                <div
                                    className="flex items-center gap-2 px-4 py-3 rounded-xl"
                                    style={{
                                        background: "rgba(255,255,255,0.05)",
                                        border: `1px solid ${inputFocused ? "#02AAA070" : "rgba(255,255,255,0.1)"}`,
                                        transition: "border-color 0.25s ease",
                                    }}
                                >
                                    <Send size={14} className="text-slate-500 flex-shrink-0" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setInputFocused(true)}
                                        onBlur={() => setInputFocused(false)}
                                        placeholder="your@email.com"
                                        required
                                        className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="py-3 px-6 rounded-xl text-sm font-semibold text-white"
                                    style={{
                                        background: "linear-gradient(135deg, #02AAA0 0%, #0284c7 100%)",
                                        transition: "opacity 0.2s ease, transform 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                                    }}
                                >
                                    Subscribe
                                </button>
                            </form>
                        )}
                    </div>

                </div>

                {/* ── Bottom bar ── */}
                <div
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-xs text-slate-500"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                >
                    <span>
                        © {new Date().getFullYear()}{" "}
                        <span className="text-slate-400 font-medium">TutorTalkAI</span>
                        . All rights reserved.
                    </span>
                    <div className="flex items-center gap-1.5">
                        <span>Made with</span>
                        <span style={{ color: "#02AAA0" }}>♥</span>
                        <span>for curious learners everywhere</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;