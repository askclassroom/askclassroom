// components/MessageWithMath.tsx
import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MessageWithMathProps {
    content: string;
}

export function MessageWithMath({ content }: MessageWithMathProps) {
    // Handle both inline $...$ and display $$...$$ math
    const renderContent = () => {
        // First handle display math ($$...$$)
        const displayMathParts = content.split(/(\$\$.+?\$\$)/g);

        return displayMathParts.map((part, index) => {
            // Check if it's display math
            if (part.startsWith('$$') && part.endsWith('$$')) {
                const latex = part.slice(2, -2);
                return <BlockMath key={index} math={latex} />;
            }

            // Handle inline math ($...$)
            const inlineMathParts = part.split(/(\$.+?\$)/g);
            return inlineMathParts.map((subPart, subIndex) => {
                if (subPart.startsWith('$') && subPart.endsWith('$')) {
                    const latex = subPart.slice(1, -1);
                    return <InlineMath key={`${index}-${subIndex}`} math={latex} />;
                }
                return <span key={`${index}-${subIndex}`}>{subPart}</span>;
            });
        });
    };

    return <div className="whitespace-pre-wrap">{renderContent()}</div>;
}