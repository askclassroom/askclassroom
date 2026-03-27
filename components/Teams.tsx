"use client";

import Image from "next/image";
import { useState } from "react";
import { Twitter, Linkedin } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const teamMembers = [
    {
        name: "Aryan Gupta",
        role: "Founder · Software Developer",
        image: "/images/founder-1.png",
        linkedin: "https://www.linkedin.com/in/aryan-gupta-jiit3165",
        twitter: "https://x.com/TutorTalkAI",
        gradient: "from-[#02AAA0] to-[#0284c7]",
    },
    {
        name: "Flavia Etukulapati",
        role: "Founder · Software Developer",
        image: "/images/founder-2.jpeg",
        linkedin: "https://www.linkedin.com/in/flavia-etukulapati-92387b233/",
        twitter: "https://x.com/TutorTalkAI",
        gradient: "from-[#7c3aed] to-[#0284c7]",
    },
];

function MemberCard({ member, index }: { member: typeof teamMembers[0]; index: number }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`lp-reveal lp-delay-${index + 2} text-center`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Image container */}
            <div
                className="relative w-[300px] mx-auto rounded-3xl overflow-hidden"
                style={{
                    height: "350px",
                    boxShadow: hovered
                        ? "0 30px 80px rgba(2,170,160,0.25), 0 10px 30px rgba(0,0,0,0.12)"
                        : "0 8px 30px rgba(0,0,0,0.1)",
                    transform: hovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                    transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease",
                }}
            >
                <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    style={{
                        transform: hovered ? "scale(1.06)" : "scale(1)",
                        transition: "transform 0.6s ease",
                    }}
                />

                {/* Gradient overlay on hover */}
                <div
                    className={`absolute inset-0 bg-gradient-to-t ${member.gradient}`}
                    style={{
                        opacity: hovered ? 0.75 : 0,
                        transition: "opacity 0.4s ease",
                    }}
                />

                {/* Social icons on hover */}
                <div
                    className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 pb-6"
                    style={{
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? "translateY(0)" : "translateY(12px)",
                        transition: "opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                >
                    <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition"
                    >
                        <Twitter size={16} className="text-white" />
                    </a>
                    <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition"
                    >
                        <Linkedin size={16} className="text-white" />
                    </a>
                </div>
            </div>

            {/* Info below card */}
            <div className="mt-5 space-y-1">
                <h3
                    className="text-xl font-bold text-[#1a1a2e]"
                    style={{ transition: "color 0.3s ease", color: hovered ? "#02AAA0" : "#1a1a2e" }}
                >
                    {member.name}
                </h3>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    {member.role}
                </p>
            </div>
        </div>
    );
}

export default function TeamSection() {
    const sectionRef = useScrollReveal(0.08) as React.RefObject<HTMLElement>;

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-28 px-6 lg:px-20 overflow-hidden"
            style={{ background: "#F9FBFB" }}
        >
            {/* Ambient decoration */}
            <div
                className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px]"
                style={{ background: "radial-gradient(ellipse, rgba(2,170,160,0.07), transparent 70%)" }}
            />

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="lp-reveal inline-block text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full" style={{ background: "#02AAA015", color: "#02AAA0", border: "1px solid #02AAA030" }}>
                        Our Team
                    </span>

                    <h2
                        className="lp-reveal lp-delay-1 text-4xl md:text-5xl font-extrabold text-[#1a1a2e] leading-tight"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        The Experts Supporting{" "}
                        <span style={{ background: "linear-gradient(135deg, #02AAA0, #0284c7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                            Your Journey
                        </span>
                    </h2>

                    <p className="lp-reveal lp-delay-2 text-gray-500 max-w-xl mx-auto text-lg">
                        TutorTalkAI is built by passionate engineers focused on creating
                        AI-powered learning experiences that help students grow faster.
                    </p>
                </div>

                {/* Team Grid */}
                <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
                    {teamMembers.map((member, index) => (
                        <MemberCard key={index} member={member} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}