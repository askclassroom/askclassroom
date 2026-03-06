"use client";

import React from "react";
import dynamic from "next/dynamic";

// PricingTable calls auth() internally — must be loaded client-side only
const PricingTable = dynamic(
    () => import("@clerk/nextjs").then((mod) => mod.PricingTable),
    {
        ssr: false,
        loading: () => (
            <div className="flex justify-center items-center py-20">
                <div
                    className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
                    style={{ borderColor: "#02AAA0 transparent transparent transparent" }}
                />
            </div>
        ),
    }
);

const PricingComponent = () => {
    return (
        <section className="relative w-full py-24 px-6 lg:px-20 bg-[#F9FBFB] overflow-hidden">

            {/* Soft Background Circle */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#02AAA0] opacity-5 rounded-full blur-3xl" />

            {/* Header */}
            <div className="relative text-center max-w-3xl mx-auto mb-16 space-y-6">
                <span className="text-sm font-semibold text-[#02AAA0] uppercase tracking-wider">
                    Choose Package
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-[#2c2c2c] leading-tight">
                    Become an expert in your field with our online course.
                </h2>
                <p className="text-gray-600 text-lg">
                    Upgrade your skills with flexible learning options and premium
                    resources designed for real-world success.
                </p>
            </div>

            {/* Pricing Table — loaded client-side only to avoid auth() SSR error */}
            <div className="relative max-w-6xl mx-auto">
                <PricingTable
                    appearance={{
                        variables: {
                            colorPrimary: "#02AAA0",
                            colorBackground: "#ffffff",
                            colorText: "#2c2c2c",
                            borderRadius: "16px",
                        },
                        elements: {
                            card: "rounded-2xl shadow-lg border border-gray-200",
                            button: "bg-[#02AAA0] hover:bg-[#02918a] text-white rounded-xl",
                            price: "text-3xl font-bold text-[#02AAA0]",
                        },
                    }}
                />
            </div>

        </section>
    );
};

export default PricingComponent;