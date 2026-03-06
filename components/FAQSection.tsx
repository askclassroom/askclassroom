"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/constants";
import { useScrollReveal } from "@/lib/useScrollReveal";

const FAQSection = () => {
  const sectionRef = useScrollReveal(0.08) as React.RefObject<HTMLElement>;
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 px-6 lg:px-20 bg-white overflow-hidden"
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] opacity-20"
        style={{
          background: "radial-gradient(circle, #02AAA040, transparent 70%)",
          animation: "lp-blob 18s ease-in-out infinite",
          borderRadius: "60% 40% 70% 30% / 50% 60% 40% 60%",
        }}
      />

      <div className="relative flex flex-col lg:flex-row gap-16 items-start max-w-7xl mx-auto">

        {/* LEFT CONTENT */}
        <div className="flex-1 space-y-8">

          <div className="lp-reveal">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full" style={{ background: "#02AAA015", color: "#02AAA0", border: "1px solid #02AAA030" }}>
              FAQs
            </span>
          </div>

          <h2
            className="lp-reveal lp-delay-1 text-4xl lg:text-5xl font-extrabold text-[#1a1a2e] leading-tight max-w-xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Helping You Understand{" "}
            <span style={{ background: "linear-gradient(135deg, #02AAA0, #0284c7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              TutorTalkAI
            </span>{" "}
            Better
          </h2>

          {/* Accordion */}
          <div className="space-y-3 pt-4">
            {faqs.map((faq, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={index}
                  className={`lp-reveal lp-delay-${Math.min(index + 2, 6)} rounded-2xl overflow-hidden`}
                  style={{
                    border: isActive ? "1px solid transparent" : "1px solid #e5e7eb",
                    background: isActive
                      ? "linear-gradient(135deg, #02AAA0, #0284c7)"
                      : "white",
                    boxShadow: isActive ? "0 8px 32px rgba(2,170,160,0.25)" : "0 1px 4px rgba(0,0,0,0.04)",
                    transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center px-6 py-4 text-left"
                  >
                    <span
                      className="font-semibold text-base"
                      style={{ color: isActive ? "white" : "#1a1a2e" }}
                    >
                      {faq.question}
                    </span>
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ml-4"
                      style={{
                        background: isActive ? "rgba(255,255,255,0.2)" : "#02AAA015",
                        transition: "background 0.3s ease",
                      }}
                    >
                      <ChevronDown
                        className="w-4 h-4"
                        style={{
                          color: isActive ? "white" : "#02AAA0",
                          transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), color 0.3s ease",
                        }}
                      />
                    </div>
                  </button>

                  <div
                    style={{
                      maxHeight: isActive ? "200px" : "0",
                      opacity: isActive ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
                    }}
                  >
                    <div className="px-6 pb-5 text-sm text-white/90 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex-1 flex justify-center lp-reveal-right">
          <div
            className="relative w-full max-w-[500px] h-[440px] rounded-3xl overflow-hidden"
            style={{
              boxShadow: "0 30px 80px rgba(2,170,160,0.12), 0 8px 30px rgba(0,0,0,0.08)",
            }}
          >
            <Image
              src="/images/customer-care.jpg"
              alt="Support team"
              fill
              className="object-cover"
              style={{ transition: "transform 0.6s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
            />
            {/* Image tint overlay */}
            <div
              className="absolute inset-0 opacity-20"
              style={{ background: "linear-gradient(135deg, #02AAA0, #0284c7)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;