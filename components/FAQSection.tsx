"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/constants";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative w-full py-24 px-6 lg:px-20 bg-[#F9FBFB] overflow-hidden">

      {/* Soft Decorative Blur */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#02AAA0] opacity-5 rounded-full blur-3xl" />

      <div className="relative flex flex-col lg:flex-row gap-16 items-center">

        {/* LEFT CONTENT */}
        <div className="flex-1 space-y-8">

          <span className="text-sm font-semibold text-[#02AAA0] uppercase tracking-wider">
            FAQs
          </span>

          <h2 className="text-4xl lg:text-5xl font-bold text-[#2c2c2c] leading-tight max-w-2xl">
            Helping You Understand Virtura Better
          </h2>

          {/* Accordion */}
          <div className="space-y-4 pt-6">

            {faqs.map((faq, index) => {
              const isActive = activeIndex === index;

              return (
                <div
                  key={index}
                  className={`rounded-2xl transition-all duration-300 ${isActive
                    ? "bg-[#02AAA0] text-white shadow-lg"
                    : "bg-white border border-gray-200"
                    }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center px-6 py-4 text-left"
                  >
                    <span className="font-medium text-lg">
                      {faq.question}
                    </span>

                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${isActive ? "rotate-180 text-white" : "text-[#02AAA0]"
                        }`}
                    />
                  </button>

                  {isActive && (
                    <div className="px-6 pb-5 text-sm text-white/90">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex-1">
          <div className="relative w-full max-w-[550px] h-[420px] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/images/customer-care.jpg" // Put inside public/images
              alt="FAQ Illustration"
              fill
              className="object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;