"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";

const AboutUs = () => {
    return (
        <section className="relative w-full bg-white py-24 px-6 lg:px-20 overflow-hidden">

            {/* Soft background decoration */}
            <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#02AAA0] opacity-5 rounded-full blur-3xl" />

            {/* Main Content */}
            <div className="relative flex flex-col lg:flex-row items-center gap-16">

                {/* LEFT IMAGE */}
                <div className="flex-1">
                    <div className="relative w-full max-w-[600px] h-[400px] lg:h-[450px] rounded-3xl overflow-hidden shadow-xl">
                        <Image
                            src="/images/about-us-robot.jpg"  // Put image inside public/images
                            alt="Students learning"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex-1 space-y-6">

                    <span className="mt-12 text-sm font-semibold text-[#02AAA0] uppercase tracking-wider">
                        About Us
                    </span>

                    <h2 className="text-3xl lg:text-4xl font-bold text-[#2c2c2c] leading-tight">
                        Your Personal AI Classroom — Beyond Just Chat
                    </h2>

                    <p className="text-gray-600 text-lg max-w-xl">
                        TutorTalkAI combines real-time voice tutoring, live visual whiteboards,
                        contextual media, and AI-powered assessments to create a fully immersive
                        one-on-one learning experience — available anytime you need it.
                    </p>

                    {/* Features */}
                    <div className="space-y-4">

                        {[
                            "Live AI Voice Companions that teach, explain, and respond instantly",
                            "Interactive Smart Whiteboard with real-time word-by-word animation",
                            "Auto-curated images & YouTube videos based on your live conversation",
                            "Instant quizzes, AI summaries & progress tracking after every session",
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="bg-[#02AAA0]/10 p-2 rounded-full">
                                    <Check className="text-[#02AAA0] w-5 h-5" />
                                </div>
                                <p className="text-gray-700">{item}</p>
                            </div>
                        ))}

                    </div>

                    <button className="mt-4 bg-[#02AAA0] text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:scale-105 transition">
                        Get Started
                    </button>

                </div>
            </div>

            {/* STATS SECTION */}
            {/* <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t pt-12 text-center">

                {[
                    { number: "700+", label: "Students" },
                    { number: "120+", label: "Courses" },
                    { number: "90+", label: "Teachers" },
                    { number: "30+", label: "Partners" },
                ].map((stat, i) => (
                    <div key={i} className="space-y-2">
                        <h3 className="text-4xl font-bold text-[#2c2c2c]">
                            {stat.number}
                        </h3>
                        <p className="text-gray-600">{stat.label}</p>
                    </div>
                ))}

            </div> */}
        </section>
    );
};

export default AboutUs;