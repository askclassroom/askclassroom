// // components/MessageWithMath.tsx
// import React from 'react';
// import 'katex/dist/katex.min.css';
// import { InlineMath, BlockMath } from 'react-katex';

// interface MessageWithMathProps {
//     content: string;
// }

// export function MessageWithMath({ content }: MessageWithMathProps) {
//     // Handle both inline $...$ and display $$...$$ math
//     const renderContent = () => {
//         // First handle display math ($$...$$)
//         const displayMathParts = content.split(/(\$\$.+?\$\$)/g);

//         return displayMathParts.map((part, index) => {
//             // Check if it's display math
//             if (part.startsWith('$$') && part.endsWith('$$')) {
//                 const latex = part.slice(2, -2);
//                 return <BlockMath key={index} math={latex} />;
//             }

//             // Handle inline math ($...$)
//             const inlineMathParts = part.split(/(\$.+?\$)/g);
//             return inlineMathParts.map((subPart, subIndex) => {
//                 if (subPart.startsWith('$') && subPart.endsWith('$')) {
//                     const latex = subPart.slice(1, -1);
//                     return <InlineMath key={`${index}-${subIndex}`} math={latex} />;
//                 }
//                 return <span key={`${index}-${subIndex}`}>{subPart}</span>;
//             });
//         });
//     };

//     return <div className="whitespace-pre-wrap">{renderContent()}</div>;
// }

// // components/MessageWithMath.tsx
// import React from 'react';
// import 'katex/dist/katex.min.css';
// import { InlineMath, BlockMath } from 'react-katex';

// interface MessageWithMathProps {
//     content: string;
// }

// export function MessageWithMath({ content }: MessageWithMathProps) {
//     // First, try to parse the response structure
//     const parts = content.split(/(Answer:|Concept:|Practice:)/g);

//     const renderContent = () => {
//         // Handle both inline $...$ and display $$...$$ math
//         const displayMathParts = content.split(/(\$\$.+?\$\$)/g);

//         return displayMathParts.map((part, index) => {
//             // Check if it's display math
//             if (part.startsWith('$$') && part.endsWith('$$')) {
//                 const latex = part.slice(2, -2);
//                 return (
//                     <div key={index} className="my-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                         <BlockMath math={latex} />
//                     </div>
//                 );
//             }

//             // Handle inline math ($...$)
//             const inlineMathParts = part.split(/(\$.+?\$)/g);
//             return inlineMathParts.map((subPart, subIndex) => {
//                 if (subPart.startsWith('$') && subPart.endsWith('$')) {
//                     const latex = subPart.slice(1, -1);
//                     return <InlineMath key={`${index}-${subIndex}`} math={latex} />;
//                 }

//                 // Check if this part contains section headers
//                 if (subPart.includes('Answer:')) {
//                     const answerContent = subPart.split('Answer:')[1];
//                     return (
//                         <div key={`${index}-${subIndex}`} className="mt-4 first:mt-0">
//                             <div className="flex items-center gap-2 mb-2">
//                                 <div className="w-1 h-6 bg-green-500 rounded-full"></div>
//                                 <h3 className="font-semibold text-green-700">Step-by-Step Solution</h3>
//                             </div>
//                             <div className="pl-4 border-l-2 border-green-200">
//                                 {answerContent}
//                             </div>
//                         </div>
//                     );
//                 }

//                 if (subPart.includes('Concept:')) {
//                     const conceptContent = subPart.split('Concept:')[1];
//                     return (
//                         <div key={`${index}-${subIndex}`} className="mt-6">
//                             <div className="flex items-center gap-2 mb-2">
//                                 <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
//                                 <h3 className="font-semibold text-blue-700">Explanation</h3>
//                             </div>
//                             <div className="pl-4 border-l-2 border-blue-200 text-gray-700">
//                                 {conceptContent}
//                             </div>
//                         </div>
//                     );
//                 }

//                 if (subPart.includes('Practice:')) {
//                     const practiceContent = subPart.split('Practice:')[1];
//                     return (
//                         <div key={`${index}-${subIndex}`} className="mt-6">
//                             <div className="flex items-center gap-2 mb-2">
//                                 <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
//                                 <h3 className="font-semibold text-purple-700">Practice Question</h3>
//                             </div>
//                             <div className="pl-4 border-l-2 border-purple-200 bg-purple-50/50 p-3 rounded-lg">
//                                 {practiceContent}
//                             </div>
//                         </div>
//                     );
//                 }

//                 return <span key={`${index}-${subIndex}`}>{subPart}</span>;
//             });
//         });
//     };

//     return (
//         <div className="space-y-4">
//             {renderContent()}
//         </div>
//     );
// }

// // components/FormattedMessage.tsx
// import React from 'react';
// import 'katex/dist/katex.min.css';
// import { InlineMath, BlockMath } from 'react-katex';

// interface FormattedMessageProps {
//     content: string;
// }

// // Format math responses with LaTeX
// const MathMessage = ({ content }: { content: string }) => {
//     // Process the content to handle LaTeX and sections
//     const renderMathContent = () => {
//         // Split by common math section headers
//         const parts = content.split(/(📝|\*\*Step-by-Step Solution:\*\*|💡|\*\*Concept Explanation:\*\*|✏️|\*\*Practice Question:\*\*)/g);

//         return (
//             <div className="space-y-6">
//                 {parts.map((part, index) => {
//                     if (part.includes('Step-by-Step Solution') || part === '📝') {
//                         return (
//                             <div key={index} className="mt-4">
//                                 <div className="flex items-center gap-2 mb-3">
//                                     <div className="w-1 h-8 bg-green-500 rounded-full"></div>
//                                     <h3 className="font-semibold text-green-700 text-lg">Step-by-Step Solution</h3>
//                                 </div>
//                                 <div className="pl-4 border-l-2 border-green-200 space-y-3">
//                                     {renderContentWithMath(parts[index + 1])}
//                                 </div>
//                             </div>
//                         );
//                     }

//                     if (part.includes('Concept Explanation') || part === '💡') {
//                         return (
//                             <div key={index} className="mt-6">
//                                 <div className="flex items-center gap-2 mb-3">
//                                     <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
//                                     <h3 className="font-semibold text-blue-700 text-lg">Concept Explanation</h3>
//                                 </div>
//                                 <div className="pl-4 border-l-2 border-blue-200">
//                                     {renderContentWithMath(parts[index + 1])}
//                                 </div>
//                             </div>
//                         );
//                     }

//                     if (part.includes('Practice Question') || part === '✏️') {
//                         return (
//                             <div key={index} className="mt-6">
//                                 <div className="flex items-center gap-2 mb-3">
//                                     <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
//                                     <h3 className="font-semibold text-purple-700 text-lg">Practice Question</h3>
//                                 </div>
//                                 <div className="pl-4 border-l-2 border-purple-200 bg-purple-50/30 p-4 rounded-lg">
//                                     {renderContentWithMath(parts[index + 1])}
//                                 </div>
//                             </div>
//                         );
//                     }

//                     return null;
//                 })}
//             </div>
//         );
//     };

//     // Helper to render content with LaTeX
//     const renderContentWithMath = (text: string = '') => {
//         if (!text) return null;

//         // Split by display math
//         const displayMathParts = text.split(/(\$\$.+?\$\$)/g);

//         return displayMathParts.map((part, idx) => {
//             if (part.startsWith('$$') && part.endsWith('$$')) {
//                 const latex = part.slice(2, -2);
//                 return (
//                     <div key={idx} className="my-3 p-3 bg-blue-50 rounded-lg border border-blue-100 overflow-x-auto">
//                         <BlockMath math={latex} />
//                     </div>
//                 );
//             }

//             // Handle inline math
//             const inlineMathParts = part.split(/(\$.+?\$)/g);
//             return (
//                 <div key={idx} className="inline">
//                     {inlineMathParts.map((subPart, subIdx) => {
//                         if (subPart.startsWith('$') && subPart.endsWith('$')) {
//                             const latex = subPart.slice(1, -1);
//                             return <InlineMath key={`${idx}-${subIdx}`} math={latex} />;
//                         }
//                         return <span key={`${idx}-${subIdx}`}>{subPart}</span>;
//                     })}
//                 </div>
//             );
//         });
//     };

//     return renderMathContent();
// };

// // Format general (non-math) responses
// const GeneralMessage = ({ content }: { content: string }) => {
//     // Clean up the content
//     const cleanContent = content.replace(/\*\*/g, '').trim();

//     // Split by common section headers with emojis
//     const sections = [];
//     let currentSection = { type: 'text', content: '' };

//     const lines = cleanContent.split('\n');

//     for (const line of lines) {
//         const trimmedLine = line.trim();

//         // Check for section headers with emojis
//         if (trimmedLine.includes('📝 **Answer:**') || trimmedLine.match(/^📝/)) {
//             if (currentSection.content) sections.push({ ...currentSection });
//             currentSection = { type: 'answer', content: '' };
//         } else if (trimmedLine.includes('💡 **Explanation:**') || trimmedLine.match(/^💡/)) {
//             if (currentSection.content) sections.push({ ...currentSection });
//             currentSection = { type: 'explanation', content: '' };
//         } else if (trimmedLine.includes('📋 **Summary:**') || trimmedLine.match(/^📋/)) {
//             if (currentSection.content) sections.push({ ...currentSection });
//             currentSection = { type: 'summary', content: '' };
//         } else if (trimmedLine.includes('✏️ **Practice/Follow-up:**') || trimmedLine.match(/^✏️/)) {
//             if (currentSection.content) sections.push({ ...currentSection });
//             currentSection = { type: 'practice', content: '' };
//         } else {
//             // Add to current section
//             if (currentSection.content) {
//                 currentSection.content += '\n' + trimmedLine;
//             } else {
//                 currentSection.content = trimmedLine;
//             }
//         }
//     }

//     // Add last section
//     if (currentSection.content) {
//         sections.push({ ...currentSection });
//     }

//     // If no sections detected, treat as normal text
//     if (sections.length === 0) {
//         return (
//             <div className="prose max-w-none">
//                 {cleanContent.split('\n').map((paragraph, idx) =>
//                     paragraph.trim() && (
//                         <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
//                             {paragraph}
//                         </p>
//                     )
//                 )}
//             </div>
//         );
//     }

//     // Render sections
//     return (
//         <div className="space-y-6">
//             {sections.map((section, idx) => {
//                 const configs = {
//                     answer: { icon: '📝', color: 'green', title: 'Answer', bgColor: 'bg-green-50' },
//                     explanation: { icon: '💡', color: 'blue', title: 'Explanation', bgColor: 'bg-blue-50' },
//                     summary: { icon: '📋', color: 'orange', title: 'Summary', bgColor: 'bg-orange-50' },
//                     practice: { icon: '✏️', color: 'purple', title: 'Practice', bgColor: 'bg-purple-50' }
//                 };

//                 const config = configs[section.type as keyof typeof configs] || {
//                     icon: '•',
//                     color: 'gray',
//                     title: section.type,
//                     bgColor: 'bg-gray-50'
//                 };

//                 return (
//                     <div
//                         key={idx}
//                         className={`${config.bgColor} rounded-lg border border-${config.color}-200 p-5 transition-all hover:shadow-md`}
//                     >
//                         <div className="flex items-center gap-2 mb-3">
//                             <span className="text-xl">{config.icon}</span>
//                             <h3 className="font-semibold text-gray-800 text-lg">{config.title}</h3>
//                         </div>
//                         <div className="text-gray-700 leading-relaxed pl-2">
//                             {section.content.split('\n').map((para, i) =>
//                                 para.trim() && (
//                                     <p key={i} className="mb-3 last:mb-0">
//                                         {para}
//                                     </p>
//                                 )
//                             )}
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// // Main component that uses AI detection (via the response format)
// export function FormattedMessage({ content }: FormattedMessageProps) {
//     // Check if the response contains math indicators
//     const hasMathIndicators = (): boolean => {
//         // Look for LaTeX delimiters
//         if (content.includes('$') || content.includes('$$')) return true;

//         // Look for math section headers
//         if (content.includes('Step-by-Step Solution') &&
//             (content.includes('=') || content.includes('x') || content.includes('y'))) {
//             return true;
//         }

//         return false;
//     };

//     return (
//         <div className="w-full">
//             {hasMathIndicators() ? (
//                 <MathMessage content={content} />
//             ) : (
//                 <GeneralMessage content={content} />
//             )}
//         </div>
//     );
// }

// components/FormattedMessage.tsx
// import React from 'react';
// import 'katex/dist/katex.min.css';
// import { InlineMath, BlockMath } from 'react-katex';

// interface FormattedMessageProps {
//     content: string;
//     isMath?: boolean; // Pass this from parent
// }

// export function FormattedMessage({ content, isMath }: FormattedMessageProps) {
//     // Clean the content - remove any references to previous problems
//     const cleanContent = content
//         .replace(/Note:.*?(?=\n|$)/g, '') // Remove notes
//         .replace(/I'm happy to help.*?(?=\n|$)/g, '') // Remove offers for other help
//         .trim();

//     if (isMath) {
//         return <MathMessage content={cleanContent} />;
//     } else {
//         return <GeneralMessage content={cleanContent} />;
//     }
// }

// // Math Message Component
// const MathMessage = ({ content }: { content: string }) => {
//     // Parse the math solution
//     const steps = content.match(/\d+\.\s[^\n]+/g) || [];
//     const concept = content.match(/Concept:?\s*([^\n]+(?:\n[^\n]+)*)/i)?.[1] || '';
//     const practice = content.match(/Practice:?\s*([^\n]+(?:\n[^\n]+)*)/i)?.[1] || '';

//     return (
//         <div className="space-y-6">
//             {/* Steps */}
//             <div className="bg-green-50 rounded-lg p-5 border border-green-200">
//                 <h3 className="text-green-800 font-semibold mb-3 flex items-center gap-2">
//                     <span>📝</span> Step-by-Step Solution
//                 </h3>
//                 <div className="space-y-2">
//                     {steps.map((step, idx) => (
//                         <div key={idx} className="flex items-start gap-2">
//                             <span className="text-green-600 font-medium min-w-[24px]">{idx + 1}.</span>
//                             <div className="text-gray-700">
//                                 {renderMathInText(step.replace(/^\d+\.\s*/, ''))}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Concept */}
//             {concept && (
//                 <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
//                     <h3 className="text-blue-800 font-semibold mb-2 flex items-center gap-2">
//                         <span>💡</span> Concept
//                     </h3>
//                     <div className="text-gray-700">{renderMathInText(concept)}</div>
//                 </div>
//             )}

//             {/* Practice */}
//             {practice && (
//                 <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
//                     <h3 className="text-purple-800 font-semibold mb-2 flex items-center gap-2">
//                         <span>✏️</span> Practice
//                     </h3>
//                     <div className="text-gray-700">{renderMathInText(practice)}</div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // Helper to render math in text
// const renderMathInText = (text: string) => {
//     const parts = text.split(/(\$[^\$]+\$)/g);
//     return parts.map((part, idx) => {
//         if (part.startsWith('$') && part.endsWith('$')) {
//             const math = part.slice(1, -1);
//             return <InlineMath key={idx} math={math} />;
//         }
//         return <span key={idx}>{part}</span>;
//     });
// };

// // General Message Component
// const GeneralMessage = ({ content }: { content: string }) => {
//     const sections = content.split(/\n(?=📝|💡|📋|✏️)/g);

//     return (
//         <div className="space-y-4">
//             {sections.map((section, idx) => {
//                 if (section.startsWith('📝')) {
//                     return (
//                         <div key={idx} className="bg-white rounded-lg p-5 border border-gray-200">
//                             <h3 className="text-gray-800 font-semibold mb-2">Answer</h3>
//                             <div className="text-gray-700">{section.replace('📝', '').trim()}</div>
//                         </div>
//                     );
//                 }
//                 if (section.startsWith('💡')) {
//                     return (
//                         <div key={idx} className="bg-blue-50 rounded-lg p-5 border border-blue-200">
//                             <h3 className="text-blue-800 font-semibold mb-2">Explanation</h3>
//                             <div className="text-gray-700">{section.replace('💡', '').trim()}</div>
//                         </div>
//                     );
//                 }
//                 if (section.startsWith('📋')) {
//                     return (
//                         <div key={idx} className="bg-orange-50 rounded-lg p-5 border border-orange-200">
//                             <h3 className="text-orange-800 font-semibold mb-2">Summary</h3>
//                             <div className="text-gray-700">{section.replace('📋', '').trim()}</div>
//                         </div>
//                     );
//                 }
//                 if (section.startsWith('✏️')) {
//                     return (
//                         <div key={idx} className="bg-purple-50 rounded-lg p-5 border border-purple-200">
//                             <h3 className="text-purple-800 font-semibold mb-2">Practice</h3>
//                             <div className="text-gray-700">{section.replace('✏️', '').trim()}</div>
//                         </div>
//                     );
//                 }
//                 return <p key={idx} className="text-gray-700">{section}</p>;
//             })}
//         </div>
//     );
// };

// components/FormattedMessage.tsx
import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface FormattedMessageProps {
    content: string;
}

export function FormattedMessage({ content }: FormattedMessageProps) {
    // Clean the content but preserve all text
    const cleanContent = content
        .replace(/\*\*/g, '') // Remove bold markdown but keep text
        // .replace(/\\\[|\\\]/g, '') // Remove LaTeX brackets
        .trim();

    // Detect if this is a math response
    const isMathResponse = (): boolean => {
        const mathIndicators = [
            'step‑by‑step', 'step-by-step',
            'solve', 'equation', 'find',
            '\\\\(', '\\\\[', // LaTeX delimiters escaped
            '$', // $ delimiter
            '\\begin{', // LaTeX environments escaped
        ];

        return mathIndicators.some(indicator =>
            cleanContent.toLowerCase().includes(indicator.toLowerCase())
        );
    };

    // For math responses, preserve the original structure but enhance with cards
    if (isMathResponse()) {
        return <MathMessage content={cleanContent} />;
    } else {
        // For general responses, preserve all content with better formatting
        return <GeneralMessage content={cleanContent} />;
    }
}

// Math Message Component - Preserves all math content
const MathMessage = ({ content }: { content: string }) => {
    // Split content into sections based on headers
    const sections: { title: string; content: string; icon: string; color: string }[] = [];

    // Common math section headers
    const sectionHeaders = [
        { title: 'Step-by-Step Solution', icon: '📝', color: 'green', patterns: ['step-by-step solution', 'step‑by‑step solution', 'steps', 'solution'] },
        { title: 'Concept Explanation', icon: '💡', color: 'blue', patterns: ['concept explanation', 'concept', 'explanation'] },
        { title: 'Practice Question', icon: '✏️', color: 'purple', patterns: ['practice question', 'practice'] },
    ];

    let remainingContent = content;

    // Simple section extraction without complex regex
    sectionHeaders.forEach((section) => {
        for (const pattern of section.patterns) {
            // Look for the pattern as a header
            const headerIndex = remainingContent.toLowerCase().indexOf(pattern.toLowerCase());
            if (headerIndex !== -1) {
                // Find the end of this section (next header or end of content)
                let endIndex = remainingContent.length;
                for (const nextSection of sectionHeaders) {
                    for (const nextPattern of nextSection.patterns) {
                        const nextIndex = remainingContent.toLowerCase().indexOf(nextPattern.toLowerCase(), headerIndex + pattern.length);
                        if (nextIndex !== -1 && nextIndex < endIndex && nextIndex > headerIndex) {
                            endIndex = nextIndex;
                            break;
                        }
                    }
                }

                // Extract section content
                const sectionContent = remainingContent.substring(headerIndex + pattern.length, endIndex).trim();
                if (sectionContent) {
                    sections.push({
                        title: section.title,
                        content: sectionContent,
                        icon: section.icon,
                        color: section.color
                    });

                    // Remove this section from remaining content
                    remainingContent = remainingContent.substring(0, headerIndex) + remainingContent.substring(endIndex);
                }
                break;
            }
        }
    });

    // If no sections found but content exists, treat entire content as step-by-step
    if (sections.length === 0 && content.trim()) {
        sections.push({
            title: 'Step-by-Step Solution',
            content: content,
            icon: '📝',
            color: 'green'
        });
    }

    // Helper to render text with LaTeX
    // const renderWithMath = (text: string) => {
    //     if (!text) return null;

    //     // Split by LaTeX delimiters but preserve all text
    //     const parts = text.split(/(\\\(.*?\\\)|\\\[.*?\\\]|\$.*?\$)/g);

    //     return parts.map((part, idx) => {
    //         if (part.startsWith('\\(') && part.endsWith('\\)')) {
    //             const math = part.slice(2, -2);
    //             return <InlineMath key={idx} math={math} />;
    //         }
    //         if (part.startsWith('\\[') && part.endsWith('\\]')) {
    //             const math = part.slice(2, -2);
    //             return <BlockMath key={idx} math={math} />;
    //         }
    //         if (part.startsWith('$') && part.endsWith('$')) {
    //             const math = part.slice(1, -1);
    //             return <InlineMath key={idx} math={math} />;
    //         }
    //         // Return text with preserved formatting
    //         return <span key={idx} className="whitespace-pre-wrap">{part}</span>;
    //     });
    // };

    // const renderWithMath = (text: string) => {
    //     if (!text) return null;
    //     const cleaned = cleanLatex(text);
    //     const regex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$[^\$]*\$)/g;

    //     const parts = cleaned.split(regex);

    //     return parts.map((part, idx) => {
    //         if (!part) return null;

    //         // Block math ($$ or \[ \])
    //         if (
    //             (part.startsWith('$$') && part.endsWith('$$')) ||
    //             (part.startsWith('\\[') && part.endsWith('\\]'))
    //         ) {
    //             const math = part.replace(/^\$\$|^\[\\|\\\]$|\$\$$/g, '');
    //             return <BlockMath key={idx} math={math} />;
    //         }

    //         // Inline math ($ or \( \))
    //         if (
    //             (part.startsWith('$') && part.endsWith('$')) ||
    //             (part.startsWith('\\(') && part.endsWith('\\)'))
    //         ) {
    //             const math = part.replace(/^\$|^\(|\)$|\$$/g, '');
    //             return <InlineMath key={idx} math={math} />;
    //         }

    //         return <span key={idx}>{part}</span>;
    //     });
    // };

    const renderWithMath = (text: string) => {
        if (!text) return null;

        const cleaned = cleanLatex(text);

        const regex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$[^\$]*\$)/g;

        const parts = cleaned.split(regex);

        return parts.map((part, idx) => {
            if (!part) return null;

            // Block math
            if (
                (part.startsWith('$$') && part.endsWith('$$')) ||
                (part.startsWith('\\[') && part.endsWith('\\]'))
            ) {
                const math = part
                    .replace(/^\$\$|\$\$$/g, '')
                    .replace(/^\\\[|\\\]$/g, '');

                return (
                    <div key={idx} className="my-4 overflow-x-auto">
                        <BlockMath math={math} />
                    </div>
                );
            }

            // Inline math
            if (
                (part.startsWith('$') && part.endsWith('$')) ||
                (part.startsWith('\\(') && part.endsWith('\\)'))
            ) {
                const math = part
                    .replace(/^\$|\$$/g, '')
                    .replace(/^\\\(|\\\)$/g, '');

                return <InlineMath key={idx} math={math} />;
            }

            return <span key={idx}>{part}</span>;
        });
    };

    return (
        <div className="space-y-6">
            {sections.map((section, idx) => (
                <div
                    key={idx}
                    className={`bg-gradient-to-r from-${section.color}-50 to-${section.color}-100/30 rounded-xl p-6 border border-${section.color}-200 shadow-sm`}
                >
                    <h3 className={`text-${section.color}-800 font-semibold text-lg mb-4 flex items-center gap-2 border-b border-${section.color}-200 pb-2`}>
                        <span className="text-2xl">{section.icon}</span>
                        {section.title}
                    </h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {renderWithMath(section.content)}
                    </div>
                </div>
            ))}
        </div>
    );
};

const cleanLatex = (text: string) => {
    return text
        // Fix duplicated \[
        .replace(/\\\[\s*\\\[/g, '\\[')

        // Fix missing closing bracket
        .replace(/\\\[(.*?)$/gs, '\\[$1\\]')

        // Remove weird line breaks inside math
        .replace(/\\\[((?:.|\n)*?)\\\]/g, (match) => {
            return match.replace(/\n/g, ' ');
        })

        // Fix spaced characters like "2 x + 3"
        .replace(/(\d)\s+([a-zA-Z])/g, '$1$2')

        // Remove excessive spaces
        .replace(/\s+/g, ' ');
};

// General Message Component - Preserves ALL content with clean formatting
const GeneralMessage = ({ content }: { content: string }) => {
    // Parse sections based on common headers but preserve all content
    const sections: { title: string; content: string; icon: string; color: string }[] = [];

    const sectionConfigs = [
        { title: 'Answer', icon: '📝', color: 'green', patterns: ['answer', '📝'] },
        { title: 'Explanation', icon: '💡', color: 'blue', patterns: ['explanation', '💡'] },
        { title: 'Summary', icon: '📋', color: 'orange', patterns: ['summary', '📋'] },
        { title: 'Practice', icon: '✏️', color: 'purple', patterns: ['practice', '✏️'] },
    ];

    let remainingContent = content;

    // Simple section extraction without complex regex
    sectionConfigs.forEach((config) => {
        for (const pattern of config.patterns) {
            // Look for the pattern as a header (with possible colon)
            const headerRegex = new RegExp(`(?:^|\\n)${pattern}[:\\s]*(.*?)(?=(?:\\n(?:${sectionConfigs.map(s => s.patterns.join('|')).join('|')})[\\s:]*|$))`, 'is');
            const match = remainingContent.match(headerRegex);

            if (match && match[1] && match[1].trim()) {
                sections.push({
                    title: config.title,
                    content: match[1].trim(),
                    icon: config.icon,
                    color: config.color
                });

                // Remove this section from remaining content
                remainingContent = remainingContent.replace(match[0], '');
                break;
            }
        }
    });

    // If no sections found, treat entire content as one section
    if (sections.length === 0 && content.trim()) {
        // Check if content has markdown-style headers
        if (content.includes('###') || content.includes('**') || content.includes('|')) {
            return (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                        {content.split('\n').map((line, idx) => {
                            if (line.trim().startsWith('###')) {
                                return <h3 key={idx} className="text-lg font-semibold mt-4 mb-2">{line.replace('###', '').trim()}</h3>;
                            }
                            if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
                                return <h4 key={idx} className="font-semibold mt-3 mb-1">{line.replace(/\*\*/g, '')}</h4>;
                            }
                            if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                                return <li key={idx} className="ml-4 mb-1 list-disc">{line.replace(/^[-•]\s*/, '')}</li>;
                            }
                            if (/^\d+\.\s/.test(line.trim())) {
                                return <li key={idx} className="ml-4 mb-1 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>;
                            }
                            if (line.trim().startsWith('|')) {
                                return <pre key={idx} className="bg-gray-50 p-2 rounded my-2 overflow-x-auto text-sm">{line}</pre>;
                            }
                            if (line.trim() === '---') {
                                return <hr key={idx} className="my-4 border-gray-200" />;
                            }
                            if (line.trim()) {
                                return <p key={idx} className="mb-3">{line}</p>;
                            }
                            return <br key={idx} />;
                        })}
                    </div>
                </div>
            );
        }

        // Plain text - preserve all content
        return (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {content}
                </div>
            </div>
        );
    }

    // Render sections with all content preserved
    return (
        <div className="space-y-6">
            {sections.map((section, idx) => (
                <div
                    key={idx}
                    className={`bg-gradient-to-r from-${section.color}-50 to-${section.color}-100/30 rounded-xl p-6 border border-${section.color}-200 shadow-sm`}
                >
                    <h3 className={`text-${section.color}-800 font-semibold text-lg mb-4 flex items-center gap-2 border-b border-${section.color}-200 pb-2`}>
                        <span className="text-2xl">{section.icon}</span>
                        {section.title}
                    </h3>
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {section.content.split('\n').map((line, i) => {
                            // Preserve all formatting
                            if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                                return (
                                    <div key={i} className="flex items-start gap-2 ml-2">
                                        <span className="text-gray-500">•</span>
                                        <span className="flex-1">{line.replace(/^[-•]\s*/, '')}</span>
                                    </div>
                                );
                            }
                            if (/^\d+\.\s/.test(line.trim())) {
                                const match = line.match(/^(\d+)\.\s*(.*)/);
                                if (match) {
                                    return (
                                        <div key={i} className="flex items-start gap-2 ml-2">
                                            <span className="text-gray-500 font-medium min-w-[20px]">{match[1]}.</span>
                                            <span className="flex-1">{match[2]}</span>
                                        </div>
                                    );
                                }
                            }
                            if (line.trim().startsWith('|')) {
                                return <pre key={i} className="bg-gray-50 p-3 rounded-lg my-2 overflow-x-auto text-sm font-mono">{line}</pre>;
                            }
                            if (line.trim() === '---') {
                                return <hr key={i} className="my-4 border-gray-200" />;
                            }
                            if (line.trim()) {
                                return <p key={i} className="mb-3">{line}</p>;
                            }
                            return <br key={i} />;
                        })}
                    </div>
                </div>
            ))}

            {/* If there's any remaining content not captured in sections */}
            {remainingContent.trim() && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="text-gray-700 whitespace-pre-wrap">
                        {remainingContent}
                    </div>
                </div>
            )}
        </div>
    );
};