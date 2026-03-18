"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
    Mic,
    MicOff,
    Send,
    Loader2,
    Sparkles,
    ChevronDown,
    BookOpen,
    History,
    Camera,
    GraduationCap,
    FileText,
    Sparkle,
    Mic2,
    Brain,
    Zap,
    PenTool,
    Target,
    Lightbulb,
    Rocket,
    X
} from "lucide-react";
import Link from "next/link";
import { askDoubt, transcribeAudio, analyzeImage } from "@/lib/actions/question.actions";
import { FormattedMessage } from "@/components/MessageWithMath";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    imageUrl?: string; // Optional image URL for user messages
};

// Floating text component with glass effect
const FloatingText = ({ text, icon: Icon, position, delay, color = "blue", top }: {
    text: string;
    icon: any;
    position: "left" | "right";
    delay: number;
    color?: string;
    top: string;
}) => {
    const colors = {
        blue: "from-blue-500/20 to-blue-600/5 border-blue-200/20 text-blue-600",
        purple: "from-purple-500/20 to-purple-600/5 border-purple-200/20 text-purple-600",
        green: "from-green-500/20 to-green-600/5 border-green-200/20 text-green-600",
        orange: "from-orange-500/20 to-orange-600/5 border-orange-200/20 text-orange-600",
        pink: "from-pink-500/20 to-pink-600/5 border-pink-200/20 text-pink-600",
        indigo: "from-indigo-500/20 to-indigo-600/5 border-indigo-200/20 text-indigo-600",
        teal: "from-teal-500/20 to-teal-600/5 border-teal-200/20 text-teal-600",
        amber: "from-amber-500/20 to-amber-600/5 border-amber-200/20 text-amber-600",
    };

    const positionClasses = {
        left: "left-4 md:left-8 lg:left-12",
        right: "right-4 md:right-8 lg:right-12",
    };

    const animations = [
        "animate-float-slow",
        "animate-float-medium",
        "animate-float-fast",
    ];

    const animation = animations[Math.floor(Math.random() * animations.length)];

    return (
        <div
            className={`fixed ${positionClasses[position]} hidden lg:flex items-center gap-2 px-4 py-2 rounded-full 
                bg-gradient-to-r ${colors[color as keyof typeof colors]} 
                backdrop-blur-md backdrop-filter border shadow-xl
                ${animation} hover:scale-105 transition-transform duration-300 cursor-default`}
            style={{
                top: top,
                animationDelay: `${delay}s`,
                zIndex: 40,
            }}
        >
            <Icon className={`w-4 h-4 ${color === "blue" ? "text-blue-600" : `text-${color}-600`}`} />
            <span className={`text-sm font-medium whitespace-nowrap ${color === "blue" ? "text-blue-600" : `text-${color}-600`}`}>
                {text}
            </span>
        </div>
    );
};

// Floating elements container with spaced out positions
const FloatingElements = () => {
    const leftElements = [
        { text: "Upload a picture for homework", icon: Camera, color: "purple", top: "15%" },
        { text: "Solve a question", icon: Brain, color: "blue", top: "28%" },
        { text: "Prepare for project", icon: FileText, color: "green", top: "41%" },
        { text: "Generate a summary", icon: Sparkle, color: "orange", top: "54%" },
        { text: "Generate elocution", icon: Mic2, color: "pink", top: "67%" },
        { text: "Practice problems", icon: PenTool, color: "indigo", top: "80%" },
    ];

    const rightElements = [
        { text: "Get explanations", icon: BookOpen, color: "blue", top: "12%" },
        { text: "Quick revision", icon: Zap, color: "orange", top: "25%" },
        { text: "Mock tests", icon: Target, color: "purple", top: "38%" },
        { text: "Study tips", icon: Lightbulb, color: "amber", top: "51%" },
        { text: "Concept clearing", icon: Brain, color: "teal", top: "64%" },
        { text: "Exam preparation", icon: Rocket, color: "green", top: "77%" },
    ];

    return (
        <>
            {/* Left side floating elements - spaced evenly */}
            {leftElements.map((item, index) => (
                <FloatingText
                    key={`left-${index}`}
                    text={item.text}
                    icon={item.icon}
                    position="left"
                    delay={index * 0.3}
                    color={item.color}
                    top={item.top}
                />
            ))}

            {/* Right side floating elements - spaced evenly */}
            {rightElements.map((item, index) => (
                <FloatingText
                    key={`right-${index}`}
                    text={item.text}
                    icon={item.icon}
                    position="right"
                    delay={index * 0.4}
                    color={item.color}
                    top={item.top}
                />
            ))}
        </>
    );
};

export default function AskDoubtPage() {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [subject, setSubject] = useState("");
    const [topic, setTopic] = useState("");
    const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
    const [lastWasMath, setLastWasMath] = useState(false);

    const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", "English", "Computer Science"];


    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle image selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (OCR.space free tier limit is 1MB)
            if (file.size > 1 * 1024 * 1024) {
                alert("Image too large. Please upload under 1MB.");
                return;
            }

            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Clear selected image
    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Start voice recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                await processAudio(audioBlob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone. Please check permissions.");
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Process audio with Whisper
    const processAudio = async (audioBlob: Blob) => {
        setIsProcessing(true);

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        try {
            const result = await transcribeAudio(formData);
            if (result.success && result.text) {
                setInputText(result.text);
            } else {
                alert("Failed to transcribe audio. Please try again.");
            }
        } catch (error) {
            console.error("Error processing audio:", error);
            alert("Error processing audio");
        } finally {
            setIsProcessing(false);
        }
    };

    // Submit question (handles both text and image)
    const handleSubmit = async () => {
        // If no text and no image, do nothing
        if (!inputText.trim() && !selectedImage) return;

        setIsProcessing(true);

        // Prepare user message
        let userMessageContent = inputText;
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: userMessageContent || (selectedImage ? "Uploaded image for analysis" : ""),
            timestamp: new Date(),
            imageUrl: imagePreview || undefined,
        };

        setMessages(prev => [...prev, userMessage]);

        // Store current input and clear
        const currentInput = inputText;
        const currentImage = selectedImage;
        setInputText("");
        clearImage();

        try {
            let questionText = currentInput;

            // If there's an image but no text, analyze the image first
            if (currentImage && !currentInput.trim()) {
                const formData = new FormData();
                formData.append("image", currentImage);

                const analysisResult = await analyzeImage(formData);

                if (analysisResult.success && analysisResult.extractedText) {
                    questionText = analysisResult.extractedText;
                    // Update the user message to show what was extracted
                    setMessages(prev => prev.map(msg =>
                        msg.id === userMessage.id
                            ? { ...msg, content: `[Image uploaded] Extracted: "${analysisResult.extractedText}"` }
                            : msg
                    ));
                } else {
                    throw new Error(analysisResult.error || "Failed to analyze image");
                }
            }

            // If we have text to ask (either from input or extracted from image)
            if (questionText) {
                // Get AI response
                const result = await askDoubt({
                    text: questionText,
                    subject: subject || undefined,
                    topic: topic || undefined,
                    previousMessages: messages.map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                });

                if (result.success) {
                    // Add AI response
                    const assistantMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        content: result.response || "",
                        timestamp: new Date(),
                    };
                    // Detect if this response is math (you can store this from AI detection)
                    setLastWasMath(result.isMath || false); // You'll need to return this from askDoubt
                    setMessages(prev => [...prev, assistantMessage]);
                } else {
                    alert(result.error || "Failed to get response");
                }
            }
        } catch (error: any) {
            console.error("Error submitting question:", error);
            alert(error.message || "An error occurred. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                <div className="absolute top-20 left-20 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-1000"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-3000"></div>
            </div>

            {/* Floating glass elements */}
            <FloatingElements />

            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Ask a Doubt
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/ask-doubt/history"
                                className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors bg-gray-100/80 backdrop-blur-sm px-3 py-1.5 rounded-full"
                            >
                                <History className="w-4 h-4" />
                                <span>History</span>
                            </Link>
                            <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full">
                                <Sparkles className="w-4 h-4" />
                                <span>Class {user?.publicMetadata?.class || "?"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
                {/* Subject & Topic Selection */}
                <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-sm border p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <div className="relative">
                                <button
                                    onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                                    className="w-full px-3 py-2 border rounded-lg text-left flex items-center justify-between bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors"
                                >
                                    <span className={subject ? "text-gray-900" : "text-gray-500"}>
                                        {subject || "Select subject"}
                                    </span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {showSubjectDropdown && (
                                    <div className="absolute z-20 mt-1 w-full bg-white/90 backdrop-blur-md border rounded-lg shadow-lg max-h-60 overflow-auto">
                                        {subjects.map(s => (
                                            <button
                                                key={s}
                                                className="w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors"
                                                onClick={() => {
                                                    setSubject(s);
                                                    setShowSubjectDropdown(false);
                                                }}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Topic (optional)</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Quadratic Equations"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="space-y-6 mb-32">
                    {messages.length === 0 && (
                        <div className="text-center py-12 bg-white/30 backdrop-blur-sm rounded-2xl">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                <BookOpen className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">What's your doubt?</h2>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Ask anything using text, voice, or upload an image. I'll analyze it and help you step by step.
                            </p>
                            <div className="mt-6 flex justify-center gap-4 text-sm">
                                <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Free to use</span>
                                </div>
                                <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>No limits</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-md ${message.role === "user"
                                    ? "bg-blue-600/90 text-white"
                                    : "bg-white/70 text-gray-900 border"
                                    }`}
                            >
                                {message.imageUrl && (
                                    <div className="mb-2">
                                        <img
                                            src={message.imageUrl}
                                            alt="Uploaded"
                                            className="max-w-full rounded-lg max-h-40 object-contain"
                                        />
                                    </div>
                                )}
                                {/* <p className="whitespace-pre-wrap">{message.content}</p> */}
                                {message.role === "assistant" ? (
                                    <FormattedMessage content={message.content} isMath={message.id === lastMessageId ? lastWasMath : undefined} />
                                ) : (
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                )}
                                <div className={`text-xs mt-1 ${message.role === "user" ? "text-blue-200" : "text-gray-500"
                                    }`}>
                                    {message.timestamp.toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isProcessing && (
                        <div className="flex justify-start">
                            <div className="bg-white/70 backdrop-blur-md border rounded-2xl px-4 py-3 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                <span>
                                    {selectedImage ? "Analyzing image..." : "Thinking..."}
                                </span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                />

                {/* Image Preview (shows when image selected) */}
                {imagePreview && (
                    <div className="mb-3 relative inline-block">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-20 w-auto rounded-lg border shadow-sm"
                        />
                        <button
                            onClick={clearImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                )}

                {/* Input Area - Fixed at bottom */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t shadow-lg z-50">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="flex items-end gap-2">
                            <div className="flex-1 bg-white/50 backdrop-blur-sm rounded-2xl border focus-within:ring-2 focus-within:ring-blue-500">
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit();
                                        }
                                    }}
                                    placeholder={selectedImage ? "Add a message or send image directly..." : "Type your doubt here..."}
                                    className="w-full px-4 py-3 bg-transparent border-0 focus:outline-none resize-none max-h-32"
                                    rows={1}
                                    disabled={isProcessing}
                                />
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isProcessing}
                                className={`p-3 rounded-full transition-all backdrop-blur-sm 
                                    ${selectedImage
                                        ? "bg-green-500 text-white"
                                        : "bg-white/70 text-gray-600 hover:bg-white border"
                                    } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                                title="Upload image"
                            >
                                <Camera className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-2">
                                {/* Voice Input */}
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    disabled={isProcessing}
                                    className={`p-3 rounded-full transition-all backdrop-blur-sm ${isRecording
                                        ? "bg-red-500 text-white animate-pulse shadow-lg"
                                        : "bg-white/70 text-gray-600 hover:bg-white border"
                                        } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>

                                {/* Send Button - Always enabled if there's text OR image */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={(!inputText.trim() && !selectedImage) || isProcessing}
                                    className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Recording indicator */}
                        {isRecording && (
                            <div className="absolute left-0 right-0 -top-8 text-center">
                                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full inline-flex items-center gap-2 shadow-lg backdrop-blur-sm">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    Recording... Click mic to stop
                                </span>
                            </div>
                        )}

                        {/* Image attached indicator */}
                        {selectedImage && !imagePreview && (
                            <div className="absolute left-0 right-0 -top-8 text-center">
                                <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full inline-flex items-center gap-2 shadow-lg backdrop-blur-sm">
                                    <Camera className="w-3 h-3" />
                                    Image ready to send
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}