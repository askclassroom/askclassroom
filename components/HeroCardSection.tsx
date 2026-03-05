"use client";

import React from "react";
import HeroCard from "./HeroCardComponent";
import { FeatureCards } from "@/constants/index";

const animations = [
    {
        hidden: { opacity: 0, x: -80 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6 },
        },
    },
    {
        hidden: { opacity: 0, y: -80 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    },
    {
        hidden: { opacity: 0, y: 80 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    },
    {
        hidden: { opacity: 0, x: 80 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6 },
        },
    },
];

const HeroCardSection = () => {
    return (
        // <section className="py-20 px-6">
        //     <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <section className="w-full">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {FeatureCards.map((card, index) => (
                    <HeroCard
                        key={card.id}
                        title={card.title}
                        description={card.description}
                        icon={card.icon}
                        color={card.color}
                        animation={animations[index]}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroCardSection;