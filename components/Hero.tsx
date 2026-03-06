// import React from "react";
// import Image from "next/image";
// import HeroCardSection from "./HeroCardSection";
// import Link from "next/link";
// import ConceptMasteryCard from "./ConceptMasteryCard";
// import LearningStreakCard from "./LearningStreakCard";
// import FractionMasteryCard from "./FractionMasteryCard";

// const Hero = () => {
//     return (
//         <>
//             {/* HERO SECTION */}
//             <section className="relative w-full min-h-[90vh] bg-[#E6F4F3] overflow-hidden">

//                 {/* Soft Background Circles */}
//                 <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#02AAA0]/10 rounded-full blur-3xl" />
//                 <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-[#02AAA0]/10 rounded-full blur-3xl" />

//                 {/* Content Wrapper */}
//                 <div className="relative w-full px-6 lg:px-20 py-5 flex flex-col lg:flex-row items-center justify-between gap-12">

//                     {/* LEFT CONTENT */}
//                     <div className="flex-1 space-y-6">
//                         <span className="inline-block text-sm font-semibold text-[#02AAA0] bg-white px-4 py-2 rounded-full shadow">
//                             FREE TRIAL 30 DAYS
//                         </span>

//                         <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2c2c2c] leading-tight max-w-2xl">
//                             The Future of Learning Starts with AI Tutors
//                         </h1>

//                         <p className="text-gray-600 text-lg max-w-xl">
//                             Experience real-time voice tutoring, interactive whiteboards, and
//                             AI-powered quizzes designed to make learning clearer, faster, and
//                             more engaging than ever before.
//                         </p>

//                         <div className="flex gap-4">
//                             <Link href="/companions">
//                                 <button className="bg-[#02AAA0] text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:scale-105 transition cursor-pointer">
//                                     Explore Companions
//                                 </button>
//                             </Link>
//                             {/* <button className="border-2 border-[#02AAA0] text-[#02AAA0] px-8 py-4 rounded-xl font-medium hover:bg-[#02AAA0] hover:text-white transition cursor-pointer">
//                                 Discover More
//                             </button> */}
//                         </div>
//                     </div>

//                     {/* RIGHT IMAGE */}
//                     <div className="flex-1 flex">
//                         <div className="relative w-[450px] h-[580px] lg:w-[550px] lg:h-[700px]">

//                             <Image
//                                 src="/images/hero-image-2.png"
//                                 alt="Hero Image"
//                                 fill
//                                 className="object-contain drop-shadow-2xl"
//                                 priority
//                             />

//                             {/* Concept card positioned beside the AI */}
//                             <div className="absolute left-100 ml-10 -top-18">
//                                 <ConceptMasteryCard />
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* CARD SECTION OVERLAP */}
//             <section className="relative -mt-28 px-6 lg:px-20 pb-20">
//                 <HeroCardSection />
//             </section>
//         </>
//     );
// };

// export default Hero;

import React from "react";
import Image from "next/image";
import HeroCardSection from "./HeroCardSection";
import Link from "next/link";
import ConceptMasteryCard from "./ConceptMasteryCard";
import LearningStreakCard from "./LearningStreakCard";
import FractionMasteryCard from "./FractionMasteryCard";

const Hero = () => {
    return (
        <>
            {/* HERO SECTION */}
            <section className="relative w-full min-h-[90vh] bg-[#E6F4F3] overflow-hidden">

                {/* Soft Background Circles */}
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#02AAA0]/10 rounded-full blur-3xl" />
                <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-[#02AAA0]/10 rounded-full blur-3xl" />

                {/* Content Wrapper */}
                <div className="relative w-full px-6 lg:px-20 py-5 flex flex-col lg:flex-row items-center justify-between gap-12">

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
                    <div className="flex-1 flex">
                        <div className="relative w-[450px] h-[580px] lg:w-[550px] lg:h-[700px]">

                            <Image
                                src="/images/hero-image-2.png"
                                alt="Hero Image"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                            />

                            {/* Top Middle Card */}
                            <div className="absolute left-25 -translate-x-1/2 top-20">
                                <FractionMasteryCard />
                            </div>

                            {/* Concept card positioned beside the AI */}
                            <div className="absolute left-100 ml-10 -top-23">
                                <ConceptMasteryCard />
                            </div>

                            {/* Bottom Left Card */}
                            <div className="absolute left-100 bottom-30">
                                <LearningStreakCard />
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* CARD SECTION OVERLAP */}
            {/* <section className="relative -mt-28 px-6 lg:px-20 pb-20">
                <HeroCardSection />
            </section> */}
        </>
    );
};

export default Hero;