// ConceptMasteryCard.tsx
import React from "react";

const ConceptMasteryCard = () => {
    return (
        <div className="absolute left-0 top-20 bg-white/40 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl px-6 py-5 w-[220px]">

            {/* Title */}
            <p className="text-sm text-gray-700 mb-3 font-medium">
                Concept mastery
            </p>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-3 bg-white/40 rounded-full overflow-hidden">
                    <div className="h-full w-[80%] bg-black rounded-full"></div>
                </div>
                <span className="text-[#4A3AFF] font-semibold text-sm">80%</span>
            </div>

            {/* Topics */}
            <div className="text-sm text-gray-800 space-y-1">
                <p>Topics learned</p>
                <p>Fractions ✓</p>
                <p>Ratios ✓</p>
                <p>
                    Percentages <span className="text-gray-500">→ in progress</span>
                </p>
            </div>
        </div>
    );
};

export default ConceptMasteryCard;