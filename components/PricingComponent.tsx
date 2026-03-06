"use client";

import React from "react";
import { PricingTable } from "@clerk/nextjs";
import { useScrollReveal } from "@/lib/useScrollReveal";

const PricingComponent = () => {
    const sectionRef = useScrollReveal(0.05) as React.RefObject<HTMLElement>;

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-28 px-6 lg:px-20 overflow-hidden"
            style={{ background: "#F4FAFA" }}
        >
            {/* Decorative glow */}
            <div
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-30"
                style={{ background: "radial-gradient(ellipse, #02AAA025 0%, transparent 70%)" }}
            />

            {/* Header */}
            <div className="relative text-center max-w-3xl mx-auto mb-16 space-y-5">

                <span className="lp-reveal inline-block text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full" style={{ background: "#02AAA015", color: "#02AAA0", border: "1px solid #02AAA030" }}>
                    Choose Package
                </span>

                <h2
                    className="lp-reveal lp-delay-1 text-4xl md:text-5xl font-extrabold text-[#1a1a2e] leading-tight"
                    style={{ letterSpacing: "-0.02em" }}
                >
                    Simple, Transparent{" "}
                    <span style={{ background: "linear-gradient(135deg, #02AAA0, #0284c7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        Pricing
                    </span>
                </h2>

                <p className="lp-reveal lp-delay-2 text-gray-500 text-lg">
                    Upgrade your skills with flexible learning options and premium
                    resources designed for real-world success.
                </p>
            </div>

            {/* Pricing Table */}
            <div className="lp-reveal-scale lp-delay-3 relative max-w-6xl mx-auto">
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