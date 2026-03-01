

import { Mic, Presentation, ImageIcon, FileText, BarChart3, Sparkles } from "lucide-react";

export const subjects = [
  "maths",
  "language",
  "science",
  "history",
  "coding",
  "economics",
];

export const subjectsColors = {
  science: "#E5D0FF",
  maths: "#FFDA6E",
  language: "#BDE7FF",
  coding: "#FFC8E4",
  history: "#FFECC8",
  economics: "#C8FFDF",
};

export const voices = {
  male: { casual: "2BJW5coyhAzSr8STdHbE", formal: "c6SfcYrb2t09NHXiT80T" },
  female: { casual: "ZIlrSGI4jZqobxRKprJz", formal: "sarah" },
};

export const recentSessions = [
  {
    id: "1",
    subject: "science",
    name: "Neura the Brainy Explorer",
    topic: "Neural Network of the Brain",
    duration: 45,
    color: "#E5D0FF",
  },
  {
    id: "2",
    subject: "maths",
    name: "Countsy the Number Wizard",
    topic: "Derivatives & Integrals",
    duration: 30,
    color: "#FFDA6E",
  },
  {
    id: "3",
    subject: "language",
    name: "Verba the Vocabulary Builder",
    topic: "English Literature",
    duration: 30,
    color: "#BDE7FF",
  },
  {
    id: "4",
    subject: "coding",
    name: "Codey the Logic Hacker",
    topic: "Intro to If-Else Statements",
    duration: 45,
    color: "#FFC8E4",
  },
  {
    id: "5",
    subject: "history",
    name: "Memo, the Memory Keeper",
    topic: "World Wars: Causes & Consequences",
    duration: 15,
    color: "#FFECC8",
  },
  {
    id: "6",
    subject: "economics",
    name: "The Market Maestro",
    topic: "The Basics of Supply & Demand",
    duration: 10,
    color: "#C8FFDF",
  },
];

export const FeatureCards = [
  {
    id: "1",
    title: "Live AI Voice Tutor",
    description:
      "Speak naturally with subject-specialized AI Companions in real time. Get instant voice responses, dynamic explanations, and a truly immersive one-on-one tutoring experience — just like a private tutor.",
    icon: "/icons/ai-generated-sound.png",
    color: "#02aaa0",
  },
  {
    id: "2",
    title: "Interactive Smart Whiteboard",
    description:
      "Watch lessons unfold word-by-word with live whiteboard animations, speaking cursor, and visual soundwave sync — transforming passive listening into an engaging classroom experience.",
    icon: "/icons/whiteboard.png",
    color: "#02aaa0",
  },
  {
    id: "3",
    title: "Context-Aware Visual Learning",
    description:
      "AI automatically pulls relevant images and curated YouTube videos based on your conversation — blending voice, visuals, and media into one seamless learning flow.",
    icon: "/icons/video-gallery.png",
    color: "#02aaa0",
  },
  {
    id: "4",
    title: "Auto Quiz & Learning Analytics",
    description:
      "Every session ends with an AI-generated quiz and smart summary. Track your progress, review transcripts, download PDFs, and measure real learning over time.",
    icon: "/icons/quiz.png",
    color: "#02aaa0",
  },
];

export const WhyUsFeatures = [
  {
    icon: Mic,
    title: "A Tutor That Truly Listens",
    description:
      "Ask freely and learn without pressure. Your AI Companion adapts instantly to your pace and understanding.",
  },
  {
    icon: Presentation,
    title: "See Concepts Come to Life",
    description:
      "Watch lessons unfold on a live smart whiteboard that makes complex ideas clear and visual.",
  },
  {
    icon: ImageIcon,
    title: "Learn Beyond Just Words",
    description:
      "Relevant images and curated videos appear automatically to deepen understanding and memory.",
  },
  {
    icon: FileText,
    title: "Confidence After Every Session",
    description:
      "End with a personalized quiz and clear summary so you know exactly what you’ve mastered.",
  },
  {
    icon: BarChart3,
    title: "Track Your Growth",
    description:
      "See your progress over time and turn small study sessions into measurable improvement.",
  },
  {
    icon: Sparkles,
    title: "Your Personalized AI Classroom",
    description:
      "Create custom AI tutors tailored to your subjects, goals, and unique learning style.",
  },
];

export const faqs = [
  {
    question: "What is TutorTalkAI?",
    answer:
      "TutorTalkAI is an AI-powered voice tutoring platform where you learn through real-time conversations, interactive visuals, and smart assessments.",
  },
  {
    question: "How is this different from ChatGPT or other AI tools?",
    answer:
      "TutorTalkAI offers live voice tutoring, dynamic whiteboard animations, contextual media, and post-session quizzes — not just text responses.",
  },
  {
    question: "Do I need to type, or can I speak?",
    answer:
      "You can speak naturally with your AI Companion using your microphone and receive instant voice responses in return.",
  },
  {
    question: "What happens after a tutoring session ends?",
    answer:
      "You receive an AI-generated summary, a personalized quiz, and full transcript access to reinforce and track your learning.",
  },
  {
    question: "Can I create my own AI tutor?",
    answer:
      "Yes! You can design custom AI Companions tailored to your subjects, topics, and preferred teaching style.",
  },
];