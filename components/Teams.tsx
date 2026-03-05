"use client";

import Image from "next/image";
import { Facebook, Twitter, Linkedin } from "lucide-react";

const teamMembers = [
    {
        name: "Aryan Gupta",
        role: "Founder • Software Developer",
        image: "/images/founder-1.png",
        linkedin: "https://www.linkedin.com/in/aryan-gupta-jiit3165",
        facebook: "https://www.facebook.com/profile.php?id=61553732653176",
        twitter: "https://x.com/TutorTalkAI",
    },
    {
        name: "Flavia Etukulapati",
        role: "Co-Founder • Software Developer",
        image: "/images/founder-2.jpeg",
        linkedin: "https://www.linkedin.com/in/flavia-etukulapati-92387b233/",
        facebook: "",
        twitter: "https://x.com/TutorTalkAI",
    },
];

export default function TeamSection() {
    return (
        <section className="w-full py-24 px-6 lg:px-20 bg-[#F9FBFB]">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 gap-6">
                    <div>
                        <span className="text-sm font-semibold text-[#02AAA0] uppercase tracking-wider">
                            Our Team
                        </span>

                        <h2 className="text-4xl md:text-5xl font-bold text-[#2c2c2c] mt-3 max-w-xl leading-tight">
                            The Experts Supporting Your Journey
                        </h2>
                    </div>

                    <p className="text-gray-600 max-w-md">
                        TutorTalkAI is built by passionate engineers focused on creating
                        AI-powered learning experiences that help students grow faster.
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid md:grid-cols-2 gap-16 justify-items-center">

                    {teamMembers.map((member, index) => (
                        <div key={index} className="text-center group">

                            {/* Image */}
                            <div className="relative w-[340px] h-[360px] bg-white rounded-3xl overflow-hidden shadow-lg flex items-center justify-center">

                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-end justify-center pb-6 gap-5">

                                    <a href={member.facebook} target="_blank">
                                        <Facebook className="text-white hover:text-[#02AAA0]" />
                                    </a>

                                    <a href={member.twitter} target="_blank">
                                        <Twitter className="text-white hover:text-[#02AAA0]" />
                                    </a>

                                    <a href={member.linkedin} target="_blank">
                                        <Linkedin className="text-white hover:text-[#02AAA0]" />
                                    </a>

                                </div>
                            </div>

                            {/* Name */}
                            <h3 className="text-xl font-semibold text-[#2c2c2c] mt-5">
                                {member.name}
                            </h3>

                            {/* Role */}
                            <p className="text-sm text-[#02AAA0] font-medium tracking-wide uppercase mt-1">
                                {member.role}
                            </p>

                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}