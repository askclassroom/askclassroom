import React from "react";

const FractionMasteryCard = () => {
    return (
        <div className="bg-white/40 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl px-5 py-4 w-[200px]">
            <p className="text-sm text-gray-600 mb-2">Fractions</p>

            <p className="text-lg font-semibold text-gray-800">
                Mastery: <span className="text-[#4A3AFF]">85%</span>
            </p>

            <div className="mt-3 h-2 w-full bg-white/40 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-[#02AAA0] rounded-full"></div>
            </div>
        </div>
    );
};

export default FractionMasteryCard;