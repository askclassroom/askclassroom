import React from "react";

const LearningStreakCard = () => {
    return (
        <div className="bg-white/40 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl px-5 py-4 w-[200px]">
            <p className="text-sm text-gray-600 mb-1">Learning Streak</p>

            <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-[#02AAA0]">12</span>
                <span className="text-sm text-gray-600">days 🔥</span>
            </div>

            <p className="text-xs text-gray-500 mt-2">
                Keep practicing daily to maintain your streak
            </p>
        </div>
    );
};

export default LearningStreakCard;