// // Hero.tsx - A hero component for Next.js with Tailwind CSS
// // inspired by the provided Elementor (CourseOn) design.
// // Uses your font imports (Bricolage Grotesque, Outfit) and custom colors (cta, cta-gold, etc.)

// import React from 'react';
// import Image from 'next/image';
// import HeroCardSection from './HeroCardSection';

// const Hero = () => {
//     // Theme colors from your globals.css (mapped to Tailwind classes)
//     // primary (oklch(0.205 0 0)) ≈ #343434, we'll use zinc-800
//     // cta: #2c2c2c, cta-gold: #fccc41

//     return (
//         <>
//             {/* FIRST SECTION: Hero with image and text (matches .elementor-element-499faa5e) */}
//             <section className="relative w-full bg-[#E0F0F0] font-bricolage">
//                 {/* Background overlay with pattern (like .elementor-element-499faa5e::before) */}
//                 <div
//                     className="absolute inset-0 bg-[#E0F0F0]"
//                     style={{
//                         backgroundImage: `url('https://shop.creativemox.com/courseon/wp-content/uploads/sites/7/2024/09/bg_img_3b.png')`,
//                         backgroundPosition: 'bottom left',
//                         backgroundRepeat: 'no-repeat',
//                         backgroundSize: 'contain',
//                         opacity: 0.5, // matches --overlay-opacity: 0.5 from .elementor-398 .elementor-element.elementor-element-499faa5e
//                     }}
//                 />
//                 <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
//                     {/* Left column: text content */}
//                     <div className="flex-1 space-y-6 text-center lg:text-left">
//                         {/* Free trial badge */}
//                         <span className="inline-block font-outfit font-semibold text-sm uppercase tracking-wider text-[#02AAA0] bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
//                             Free Trial 30 Days
//                         </span>

//                         {/* Headline */}
//                         <h1 className="font-bricolage font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-[#2c2c2c] max-w-3xl">
//                             Upgrade your skills and knowledge with our online course.
//                         </h1>

//                         {/* Description */}
//                         <p className="font-outfit text-lg text-gray-700 max-w-2xl">
//                             Ligula porta non finibus class eleifend mollis aliquam. Natoque maecenas ut arcu scelerisque si rhoncus est tortor ultrices. Posuere euismod felis proin interdum justo risus.
//                         </p>

//                         {/* Buttons */}
//                         <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//                             <button className="bg-[#2c2c2c] hover:bg-black text-white font-outfit font-medium px-8 py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
//                                 Explore Course
//                             </button>
//                             <button className="border-2 border-[#2c2c2c] text-[#2c2c2c] hover:bg-[#2c2c2c] hover:text-white font-outfit font-medium px-8 py-4 rounded-xl transition-all duration-300">
//                                 Discover more
//                             </button>
//                         </div>
//                     </div>

//                     {/* Right column: image */}
//                     <div className="flex-1 flex justify-center lg:justify-end">
//                         <div className="relative w-72 h-96 md:w-80 md:h-[480px] lg:w-96 lg:h-[560px]">
//                             <Image
//                                 src='/images/robot-with-clipboard.png'
//                                 alt="Online course illustration"
//                                 fill
//                                 sizes="(max-width: 768px) 100vw, 50vw"
//                                 className="object-contain drop-shadow-2xl"
//                                 priority
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* SECOND SECTION: Feature cards (matches .elementor-element-7a40e166) */}
//             <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 lg:-mt-24 pb-12 font-bricolage">
//                 <HeroCardSection />
//             </section>

//             {/* <HeroCardSection /> */}
//             {/* Add Material Icons link in your _document.tsx or layout.tsx if not already present */}
//             {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css" /> */}
//         </>
//     );
// };

// export default Hero;

import React from "react";
import Image from "next/image";
import HeroCardSection from "./HeroCardSection";
import Link from "next/link";

const Hero = () => {
    return (
        <>
            {/* HERO SECTION */}
            <section className="relative w-full min-h-[90vh] bg-[#E6F4F3] overflow-hidden">

                {/* Soft Background Circles */}
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#02AAA0]/10 rounded-full blur-3xl" />
                <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-[#02AAA0]/10 rounded-full blur-3xl" />

                {/* Content Wrapper */}
                <div className="relative w-full px-6 lg:px-20 py-20 flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* LEFT CONTENT */}
                    <div className="flex-1 space-y-6">
                        <span className="inline-block text-sm font-semibold text-[#02AAA0] bg-white px-4 py-2 rounded-full shadow">
                            FREE TRIAL 30 DAYS
                        </span>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2c2c2c] leading-tight max-w-2xl">
                            The Future of Learning Starts with AI Tutors
                        </h1>

                        <p className="text-gray-600 text-lg max-w-xl">
                            Experience real-time voice tutoring, interactive whiteboards, and
                            AI-powered quizzes designed to make learning clearer, faster, and
                            more engaging than ever before.
                        </p>

                        <div className="flex gap-4">
                            <Link href="/companions">
                                <button className="bg-[#02AAA0] text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:scale-105 transition cursor-pointer">
                                    Explore Companions
                                </button>
                            </Link>
                            {/* <button className="border-2 border-[#02AAA0] text-[#02AAA0] px-8 py-4 rounded-xl font-medium hover:bg-[#02AAA0] hover:text-white transition cursor-pointer">
                                Discover More
                            </button> */}
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="flex-1 relative flex justify-center">

                        {/* Dotted Pattern */}
                        <div className="absolute right-10 top-24 grid grid-cols-6 gap-2 opacity-40">
                            {Array.from({ length: 36 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-2 h-2 bg-[#02AAA0] rounded-full"
                                />
                            ))}
                        </div>

                        <div className="relative w-[400px] h-[520px] lg:w-[500px] lg:h-[650px]">
                            <Image
                                src="/images/robot-with-clipboard.png"
                                alt="Hero Image"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CARD SECTION OVERLAP */}
            <section className="relative -mt-28 px-6 lg:px-20 pb-20">
                <HeroCardSection />
            </section>
        </>
    );
};

export default Hero;