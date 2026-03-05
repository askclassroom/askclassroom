"use client";

import { motion, type Variants } from "framer-motion";
import { Icon } from "@mdi/react";
import React from "react";

interface HeroCardProps {
    title: string;
    description: string;
    icon: string;
    color: string;
    animation: Variants;
}

const HeroCard: React.FC<HeroCardProps> = ({
    title,
    description,
    icon,
    color,
    animation,
}) => {
    return (
        <motion.div
            variants={animation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
        >
            {/* Icon Circle */}
            <div className="flex justify-center mb-6">
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: color }}
                >
                    <img src={icon} alt="ai-generated-sound" />
                </div>
            </div>

            <h4 className="text-xl font-semibold text-gray-800 mb-4">
                {title}
            </h4>

            <p className="text-gray-500 text-sm leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
};

export default HeroCard;