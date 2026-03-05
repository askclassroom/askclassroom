"use client";

import React from "react";
import Image from "next/image";
import {
    User,
    MonitorSmartphone,
    BadgeCheck,
    BookOpen,
    DollarSign,
    Trophy,
} from "lucide-react";
import { WhyUsFeatures } from "@/constants";

const WhyUs = () => {
    return (
        <section className="relative w-full bg-[#F9FBFB] py-24 px-6 lg:px-20 overflow-hidden">

            {/* Soft background decoration */}
            <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-[#02AAA0] opacity-5 rounded-full blur-3xl" />

            <div className="relative flex flex-col lg:flex-row items-center gap-16">

                {/* LEFT CONTENT */}
                <div className="flex-1 space-y-8">

                    <span className="text-sm font-semibold text-[#02AAA0] uppercase tracking-wider">
                        Why Choose Us
                    </span>

                    <h2 className="text-4xl lg:text-5xl font-bold text-[#2c2c2c] leading-tight max-w-2xl">
                        Discover Why TutorTalkAI Is the Right Choice
                    </h2>

                    <p className="text-gray-600 text-lg max-w-xl">
                        We combine innovation, expertise, and AI-driven personalization
                        to create an immersive and effective learning experience.
                    </p>

                    {/* Feature Grid */}
                    <div className="grid sm:grid-cols-2 gap-8 pt-6">

                        {WhyUsFeatures.map((item, i) => {
                            const Icon = item.icon as React.ElementType;
                            return (
                                <div key={i} className="flex items-start gap-4">

                                    <div className="bg-[#02AAA0]/10 p-3 rounded-xl">
                                        <Icon className="text-[#02AAA0] w-6 h-6" />
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-[#2c2c2c]">
                                            {item.title}
                                        </h4>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {item.description}
                                        </p>
                                    </div>

                                </div>
                            );
                        })}

                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="flex-1">
                    <div className="relative w-full max-w-[600px] h-[750px] rounded-3xl overflow-hidden shadow-xl">
                        <Image
                            src="/images/why-us-robots.jpg" // place inside public/images
                            alt="Students Learning"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default WhyUs;