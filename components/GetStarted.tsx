"use client";

import React from "react";
import Link from "next/link";

const GetStarted = () => {
    return (
        <section className="relative w-full py-6 overflow-hidden">

            {/* Soft Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#E8F6F5] via-[#F1FBFA] to-[#E8F6F5]" />

            {/* Light Decorative Blur */}
            <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-[#02AAA0] opacity-5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-[#02AAA0] opacity-5 rounded-full blur-3xl" />

            <div className="relative text-center px-4 lg:px-12 space-y-6">

                <span className="text-sm font-semibold text-[#02AAA0] uppercase tracking-wider">
                    Get Started
                </span>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2c2c2c] leading-tight">
                    Ready to Start Learning? Join Now!
                </h2>

                <p className="text-gray-600 text-base max-w-xl mx-auto">
                    Join thousands of learners transforming their careers with AI-powered education.
                </p>

                {/* Compact Email Form */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">

                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full sm:w-[350px] px-5 py-3 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#02AAA0]"
                    />
                    <Link href="/sign-in">
                        <button className="bg-[#02AAA0] text-white px-6 py-3 rounded-full font-medium shadow-md hover:scale-105 transition cursor-pointer">
                            Sign Up
                        </button>
                    </Link>

                </div>
            </div>
        </section>
    );
};

export default GetStarted;