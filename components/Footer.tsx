"use client";

import React from "react";
import Image from "next/image";
import { Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full bg-[#0B1120] text-gray-300 pt-20 pb-10 px-6 lg:px-20">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* LEFT: Logo + Description */}
                <div className="space-y-6">

                    <div className="flex items-center gap-3 cursor-pointer">
                        <Image
                            src="/images/logo-png-dark.svg"
                            alt="Logo"
                            width={60}
                            height={60}
                        />
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-extrabold tracking-tight">
                                <span className="text-white">Tutor</span>
                                <span className="text-[#02AAA0]">TalkAI</span>
                            </h1>
                            <p className="text-sm text-gray-400 font-medium tracking-wide">
                                Support Beyond The Classroom
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                        Empowering learners with AI-driven education tools,
                        expert mentorship, and flexible learning experiences.
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4 pt-4">
                        <div className="bg-white/10 p-2 rounded-full hover:bg-[#02AAA0] transition cursor-pointer">
                            <Facebook size={18} />
                        </div>
                        <div className="bg-white/10 p-2 rounded-full hover:bg-[#02AAA0] transition cursor-pointer">
                            <Twitter size={18} />
                        </div>
                        <div className="bg-white/10 p-2 rounded-full hover:bg-[#02AAA0] transition cursor-pointer">
                            <Linkedin size={18} />
                        </div>
                    </div>

                </div>

                {/* Explore */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-6">
                        Explore
                    </h3>
                    <ul className="space-y-3 text-sm">
                        <li className="hover:text-[#02AAA0] cursor-pointer">Home</li>
                        <li className="hover:text-[#02AAA0] cursor-pointer">About</li>
                        <li className="hover:text-[#02AAA0] cursor-pointer">Courses</li>
                        <li className="hover:text-[#02AAA0] cursor-pointer">Teachers</li>
                        <li className="hover:text-[#02AAA0] cursor-pointer">Pricing</li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-6">
                        Support
                    </h3>
                    <ul className="space-y-3 text-sm">
                        <li className="hover:text-[#02AAA0] cursor-pointer">Help Center</li>
                        <li className="hover:text-[#02AAA0] cursor-pointer">My Account</li>
                        <li className="hover:text-[#02AAA0] cursor-pointer">FAQs</li>
                        <li className="hover:text-[#02AAA0] cursor-pointer">Contact</li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-6">
                        Newsletter
                    </h3>

                    <p className="text-gray-400 text-sm mb-4">
                        Subscribe to get the latest updates and learning tips.
                    </p>

                    <div className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#02AAA0]"
                        />
                        <button className="bg-[#02AAA0] hover:bg-[#02918a] text-white py-3 rounded-full font-medium transition">
                            Sign Up
                        </button>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 mt-16 pt-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} TutorTalkAI. All rights reserved.
            </div>

        </footer>
    );
};

export default Footer;