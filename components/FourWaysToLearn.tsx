// "use client";

// import { BookOpen, HelpCircle, Brain, MessageCircle } from "lucide-react";

// const features = [
//     {
//         title: "Daily Learning",
//         description:
//             "Structured learning paths prepared by AI. Short 5–10 minute sessions with curiosity hooks, visual explanations, and understanding checks.",
//         icon: BookOpen,
//     },
//     {
//         title: "Homework Help",
//         description:
//             "Ask any question and get step-by-step explanations. The AI identifies the concept, walks through it, and checks your understanding.",
//         icon: HelpCircle,
//     },
//     {
//         title: "Quiz & Practice",
//         description:
//             "Reinforce learning with concept quizzes, quick practice questions, and revision sessions while tracking mastery of each topic.",
//         icon: Brain,
//     },
//     {
//         title: "AI Summary & ChatBot Support",
//         description:
//             "Revisit summaries anytime or ask the chatbot about any topic you've previously learned.",
//         icon: MessageCircle,
//         highlight: true,
//     },
// ];

// export default function ThreeWaysToLearn() {
//     return (
//         <section className="w-full py-24 px-6 lg:px-20 bg-[#F9FBFB]">
//             <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

//                 {/* LEFT CONTENT */}
//                 <div>
//                     <span className="text-sm font-semibold text-[#02AAA0] uppercase tracking-wider">
//                         Learning Features
//                     </span>

//                     <h2 className="text-4xl md:text-5xl font-bold text-[#2c2c2c] mt-4 leading-tight">
//                         Four Ways to Learn
//                     </h2>

//                     <div className="w-16 h-[3px] bg-[#02AAA0] mt-4 mb-6 rounded-full"></div>

//                     <p className="text-gray-600 text-lg leading-relaxed">
//                         Everything you need to master any concept. Structured daily lessons,
//                         instant homework help, and fun quizzes — all powered by a
//                         conversational AI that adapts to you.
//                     </p>

//                     <button className="mt-8 bg-[#02AAA0] hover:bg-[#019189] text-white px-8 py-4 rounded-full font-medium transition">
//                         Learn More
//                     </button>
//                 </div>

//                 {/* RIGHT CARDS */}
//                 <div className="grid sm:grid-cols-2 gap-8">

//                     {features.map((item, index) => {
//                         const Icon = item.icon;

//                         return (
//                             <div
//                                 key={index}
//                                 className={`p-8 rounded-2xl shadow-md transition hover:-translate-y-1 hover:shadow-lg
//                 ${item.highlight
//                                         ? "bg-gradient-to-br from-[#02AAA0] to-[#026a66] text-white"
//                                         : "bg-white"
//                                     }`}
//                             >
//                                 <Icon
//                                     className={`mb-4 ${item.highlight ? "text-white" : "text-[#02AAA0]"
//                                         }`}
//                                     size={34}
//                                 />

//                                 <h3 className="text-xl font-semibold mb-3">
//                                     {item.title}
//                                 </h3>

//                                 <p
//                                     className={`text-sm leading-relaxed ${item.highlight ? "text-white/90" : "text-gray-600"
//                                         }`}
//                                 >
//                                     {item.description}
//                                 </p>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </section>
//     );
// }

"use client";

import Tilt from "react-parallax-tilt";
import { BookOpen, HelpCircle, Brain, MessageCircle } from "lucide-react";

const features = [
    {
        title: "Daily Learning",
        description:
            "Structured learning paths prepared by AI. Short 5–10 minute sessions with curiosity hooks, visual explanations, and understanding checks.",
        icon: BookOpen,
    },
    {
        title: "Homework Help",
        description:
            "Ask any question and get step-by-step explanations. The AI identifies the concept, walks through it, and checks your understanding.",
        icon: HelpCircle,
    },
    {
        title: "Quiz & Practice",
        description:
            "Reinforce learning with concept quizzes, quick practice questions, and revision sessions while tracking mastery of each topic.",
        icon: Brain,
    },
    {
        title: "AI Summary & ChatBot Support",
        description:
            "Revisit summaries anytime or ask the chatbot about any topic you've previously learned.",
        icon: MessageCircle,
        highlight: true,
    },
];

export default function ThreeWaysToLearn() {
    return (
        <section className="w-full py-24 px-6 lg:px-20 bg-[#F9FBFB]">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                {/* LEFT CONTENT */}
                <div>
                    <span className="text-sm font-semibold text-[#02AAA0] uppercase tracking-wider">
                        Learning Features
                    </span>

                    <h2 className="text-4xl md:text-5xl font-bold text-[#2c2c2c] mt-4 leading-tight">
                        Four Ways to Learn
                    </h2>

                    <div className="w-16 h-[3px] bg-[#02AAA0] mt-4 mb-6 rounded-full"></div>

                    <p className="text-gray-600 text-lg leading-relaxed">
                        Everything you need to master any concept. Structured daily lessons,
                        instant homework help, and fun quizzes — all powered by a
                        conversational AI that adapts to you.
                    </p>

                    <button className="mt-8 bg-[#02AAA0] hover:bg-[#019189] text-white px-8 py-4 rounded-full font-medium transition">
                        Learn More
                    </button>
                </div>

                {/* RIGHT CARDS */}
                <div className="grid sm:grid-cols-2 gap-8">
                    {features.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <Tilt
                                key={index}
                                glareEnable={true}
                                glareMaxOpacity={0.25}
                                glareColor="#ffffff"
                                glarePosition="all"
                                tiltMaxAngleX={20}
                                tiltMaxAngleY={20}
                                scale={1.02}
                                transitionSpeed={1200}
                                className="rounded-2xl"
                            >
                                <div
                                    className={`p-8 rounded-2xl shadow-md transition-all duration-300
                  hover:shadow-xl
                                        }`}
                                >
                                    <Icon
                                        size={34}
                                        className={`mb-4 text-[#02AAA0]
                                            }`}
                                    />

                                    <h3 className="text-xl font-semibold mb-3">
                                        {item.title}
                                    </h3>

                                    <p
                                        className={`text-sm leading-relaxed text-gray-600
                                            }`}
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            </Tilt>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}