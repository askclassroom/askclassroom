// "use client";

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { saveOnboardingData } from "@/lib/actions/user.actions";
// import { useRouter } from "next/navigation";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";

// // Constants for choices
// const CLASSES = ["6th", "7th", "8th", "9th", "10th", "11th", "12th"];
// const SUBJECTS = ["Math", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science"];
// const BOARDS = ["CBSE", "ICSE", "State Board", "IB", "Other"];
// const GOALS = ["Board Exams", "JEE", "NEET", "Foundation", "Olympiads", "Skill Building"];

// interface OnboardingFormProps {
//   initialData?: {
//     name?: string;
//     classStr?: string;
//     class?: string;
//     subjects?: string[];
//     board?: string;
//     goals?: string;
//     school_name?: string;
//   };
//   isEditMode?: boolean;
// }

// export default function OnboardingForm({ initialData, isEditMode = false }: OnboardingFormProps) {
//   const router = useRouter();

//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     name: initialData?.name || "",
//     classStr: initialData?.classStr || initialData?.class || "",
//     subjects: initialData?.subjects || [] as string[],
//     board: initialData?.board || "",
//     goals: initialData?.goals || "",
//     school_name: initialData?.school_name || "",
//   });

//   const handleNext = () => {
//     if (step === 1 && (!formData.name.trim() || !formData.classStr)) {
//       setError("Please fill your Name and select your Class.");
//       return;
//     }
//     if (step === 2 && formData.subjects.length === 0) {
//       setError("Please select at least one subject.");
//       return;
//     }
//     if (step === 3 && (!formData.board || !formData.goals)) {
//       setError("Please select your Board and Goal.");
//       return;
//     }
//     setError("");
//     setStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setError("");
//     setStep((prev) => prev - 1);
//   };

//   const handleSubmit = async () => {
//     if (!formData.school_name.trim()) {
//       setError("Please enter your School Name.");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     try {
//       await saveOnboardingData(formData);
//       if (isEditMode) {
//         window.location.reload();
//       } else {
//         router.push("/homepage");
//       }
//     } catch (err: any) {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubjectToggle = (sub: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       subjects: prev.subjects.includes(sub)
//         ? prev.subjects.filter((s) => s !== sub)
//         : [...prev.subjects, sub],
//     }));
//   };

//   return (
//     <div className="w-full max-w-xl mx-auto p-6 md:p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white">
//       {/* Progress Bar */}
//       <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
//         <motion.div
//           className="h-full bg-blue-600"
//           initial={{ width: `${((step - 1) / 4) * 100}%` }}
//           animate={{ width: `${(step / 4) * 100}%` }}
//           transition={{ duration: 0.3 }}
//         />
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
//           {error}
//         </div>
//       )}

//       <div className="min-h-[350px] relative">
//         <AnimatePresence mode="wait">
//           {/* STEP 1 */}
//           {step === 1 && (
//             <motion.div
//               key="step1"
//               initial={{ x: 50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: -50, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="flex flex-col gap-6"
//             >
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome! Let's get to know you.</h2>
//                 <p className="text-gray-500">What's your name and which class are you in?</p>
//               </div>

//               <div className="space-y-3">
//                 <Label htmlFor="name" className="text-gray-700">Full Name</Label>
//                 <Input
//                   id="name"
//                   placeholder="e.g. Rahul Kumar"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <Label className="text-gray-700">Select Class</Label>
//                 <div className="flex flex-wrap gap-3">
//                   {CLASSES.map((cls) => (
//                     <button
//                       key={cls}
//                       onClick={() => setFormData({ ...formData, classStr: cls })}
//                       className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${formData.classStr === cls
//                           ? "bg-blue-600 text-white shadow-md"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                         }`}
//                     >
//                       {cls}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* STEP 2 */}
//           {step === 2 && (
//             <motion.div
//               key="step2"
//               initial={{ x: 50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: -50, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="flex flex-col gap-6"
//             >
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Subjects</h2>
//                 <p className="text-gray-500">Choose all the subjects you are studying.</p>
//               </div>

//               <div className="flex flex-wrap gap-3">
//                 {SUBJECTS.map((sub) => (
//                   <button
//                     key={sub}
//                     onClick={() => handleSubjectToggle(sub)}
//                     className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${formData.subjects.includes(sub)
//                         ? "bg-blue-600 text-white shadow-md"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }`}
//                   >
//                     {sub}
//                   </button>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {/* STEP 3 */}
//           {step === 3 && (
//             <motion.div
//               key="step3"
//               initial={{ x: 50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: -50, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="flex flex-col gap-6"
//             >
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Academics & Goals</h2>
//                 <p className="text-gray-500">Tell us about your educational board and main focus.</p>
//               </div>

//               <div className="space-y-3">
//                 <Label className="text-gray-700">Select Board</Label>
//                 <div className="flex flex-wrap gap-3">
//                   {BOARDS.map((b) => (
//                     <button
//                       key={b}
//                       onClick={() => setFormData({ ...formData, board: b })}
//                       className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${formData.board === b
//                           ? "bg-blue-600 text-white shadow-md"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                         }`}
//                     >
//                       {b}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <Label className="text-gray-700">Primary Goal</Label>
//                 <div className="flex flex-wrap gap-3">
//                   {GOALS.map((g) => (
//                     <button
//                       key={g}
//                       onClick={() => setFormData({ ...formData, goals: g })}
//                       className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${formData.goals === g
//                           ? "bg-blue-600 text-white shadow-md"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                         }`}
//                     >
//                       {g}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* STEP 4 */}
//           {step === 4 && (
//             <motion.div
//               key="step4"
//               initial={{ x: 50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: -50, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="flex flex-col gap-6"
//             >
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Almost Done!</h2>
//                 <p className="text-gray-500">What is the name of your school?</p>
//               </div>

//               <div className="space-y-3 mt-4">
//                 <Label htmlFor="school" className="text-gray-700">School Name</Label>
//                 <Input
//                   id="school"
//                   placeholder="e.g. Delhi Public School"
//                   value={formData.school_name}
//                   onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
//                   className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Navigation */}
//       <div className="flex justify-between mt-8">
//         {step > 1 ? (
//           <Button variant="outline" onClick={handleBack} disabled={loading} className="rounded-xl px-6">
//             Back
//           </Button>
//         ) : (
//           <div /> // Placeholder for space-between
//         )}

//         {step < 4 ? (
//           <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8">
//             Next
//           </Button>
//         ) : (
//           <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-8">
//             {loading ? "Saving..." : isEditMode ? "Save Changes" : "Complete Profile"}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { saveOnboardingData, getBoards, getClasses } from "@/lib/actions/user.actions";
// import { useRouter } from "next/navigation";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";

// const SUBJECTS = ["Math", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science"];
// const GOALS = ["Board Exams", "JEE", "NEET", "Foundation", "Olympiads", "Skill Building"];

// interface OnboardingFormProps {
//   initialData?: any;
//   isEditMode?: boolean;
// }

// export default function OnboardingForm({ initialData, isEditMode = false }: OnboardingFormProps) {
//   const router = useRouter();
//   const [boards, setBoards] = useState<any[]>([]);
//   const [classes, setClasses] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [step, setStep] = useState(1);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     name: initialData?.name || "",
//     classNumber: initialData?.class ? parseInt(initialData.class) : 0,
//     subjects: initialData?.subjects || [] as string[],
//     boardCode: initialData?.board || "",
//     goals: initialData?.goals || "",
//     school_name: initialData?.school_name || "",
//   });

//   // Fetch boards and classes on mount
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const [boardsData, classesData] = await Promise.all([
//           getBoards(),
//           getClasses()
//         ]);
//         setBoards(boardsData);
//         setClasses(classesData);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   const handleNext = () => {
//     if (step === 1 && (!formData.name.trim() || !formData.classNumber)) {
//       setError("Please fill your Name and select your Class.");
//       return;
//     }
//     if (step === 2 && formData.subjects.length === 0) {
//       setError("Please select at least one subject.");
//       return;
//     }
//     if (step === 3 && (!formData.boardCode || !formData.goals)) {
//       setError("Please select your Board and Goal.");
//       return;
//     }
//     setError("");
//     setStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setError("");
//     setStep((prev) => prev - 1);
//   };

//   const handleSubmit = async () => {
//     if (!formData.school_name.trim()) {
//       setError("Please enter your School Name.");
//       return;
//     }
//     setSaving(true);
//     setError("");
//     try {
//       await saveOnboardingData(formData);
//       if (isEditMode) {
//         window.location.reload();
//       } else {
//         router.push("/homepage");
//       }
//     } catch (err: any) {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSubjectToggle = (sub: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       subjects: prev.subjects.includes(sub)
//         ? prev.subjects.filter((s: any) => s !== sub)
//         : [...prev.subjects, sub],
//     }));
//   };

//   if (loading) {
//     return (
//       <div className="w-full max-w-xl mx-auto p-8 bg-white rounded-3xl shadow-xl">
//         <div className="flex justify-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-xl mx-auto p-6 md:p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white">
//       {/* Progress Bar */}
//       <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
//         <motion.div
//           className="h-full bg-blue-600"
//           initial={{ width: `${((step - 1) / 4) * 100}%` }}
//           animate={{ width: `${(step / 4) * 100}%` }}
//           transition={{ duration: 0.3 }}
//         />
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
//           {error}
//         </div>
//       )}

//       <div className="min-h-[350px] relative">
//         <AnimatePresence mode="wait">
//           {/* STEP 1 - Name & Class */}
//           {step === 1 && (
//             <motion.div
//               key="step1"
//               initial={{ x: 50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: -50, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="flex flex-col gap-6"
//             >
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome! Let's get to know you.</h2>
//                 <p className="text-gray-500">What's your name and which class are you in?</p>
//               </div>

//               <div className="space-y-3">
//                 <Label htmlFor="name" className="text-gray-700">Full Name</Label>
//                 <Input
//                   id="name"
//                   placeholder="e.g. Rahul Kumar"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <Label className="text-gray-700">Select Class</Label>
//                 <div className="flex flex-wrap gap-3">
//                   {classes.map((cls) => (
//                     <button
//                       key={cls.id}
//                       onClick={() => setFormData({ ...formData, classNumber: cls.class_number })}
//                       className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${formData.classNumber === cls.class_number
//                           ? "bg-blue-600 text-white shadow-md"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                         }`}
//                     >
//                       {cls.display_name}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* STEP 2 - Subjects */}
//           {step === 2 && (
//             <motion.div
//               key="step2"
//               initial={{ x: 50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: -50, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="flex flex-col gap-6"
//             >
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Subjects</h2>
//                 <p className="text-gray-500">Choose all the subjects you are studying.</p>
//               </div>

//               <div className="flex flex-wrap gap-3">
//                 {SUBJECTS.map((sub) => (
//                   <button
//                     key={sub}
//                     onClick={() => handleSubjectToggle(sub)}
//                     className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${formData.subjects.includes(sub)
//                         ? "bg-blue-600 text-white shadow-md"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }`}
//                   >
//                     {sub}
//                   </button>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {/* STEP 3 - Board & Goals */}
//           {step === 3 && (
//             <motion.div
//               key="step3"
//               initial={{ x: 50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: -50, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="flex flex-col gap-6"
//             >
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Academics & Goals</h2>
//                 <p className="text-gray-500">Tell us about your educational board and main focus.</p>
//               </div>

//               <div className="space-y-3">
//                 <Label className="text-gray-700">Select Board</Label>
//                 <div className="flex flex-wrap gap-3">
//                   {boards.map((board) => (
//                     <button
//                       key={board.id}
//                       onClick={() => setFormData({ ...formData, boardCode: board.code })}
//                       className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${formData.boardCode === board.code
//                           ? "bg-blue-600 text-white shadow-md"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                         }`}
//                     >
//                       {board.name}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <Label className="text-gray-700">Primary Goal</Label>
//                 <div className="flex flex-wrap gap-3">
//                   {GOALS.map((g) => (
//                     <button
//                       key={g}
//                       onClick={() => setFormData({ ...formData, goals: g })}
//                       className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${formData.goals === g
//                           ? "bg-blue-600 text-white shadow-md"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                         }`}
//                     >
//                       {g}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* STEP 4 - School Name */}
//           {step === 4 && (
//             <motion.div
//               key="step4"
//               initial={{ x: 50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: -50, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="flex flex-col gap-6"
//             >
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Almost Done!</h2>
//                 <p className="text-gray-500">What is the name of your school?</p>
//               </div>

//               <div className="space-y-3 mt-4">
//                 <Label htmlFor="school" className="text-gray-700">School Name</Label>
//                 <Input
//                   id="school"
//                   placeholder="e.g. Delhi Public School"
//                   value={formData.school_name}
//                   onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
//                   className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Navigation */}
//       <div className="flex justify-between mt-8">
//         {step > 1 ? (
//           <Button variant="outline" onClick={handleBack} disabled={saving} className="rounded-xl px-6">
//             Back
//           </Button>
//         ) : (
//           <div />
//         )}

//         {step < 4 ? (
//           <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8">
//             Next
//           </Button>
//         ) : (
//           <Button onClick={handleSubmit} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-8">
//             {saving ? "Saving..." : isEditMode ? "Save Changes" : "Complete Profile"}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveOnboardingData, getBoards, getClasses } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const SUBJECTS = ["Math", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science"];
const GOALS = ["Board Exams", "JEE", "NEET", "Foundation", "Olympiads", "Skill Building"];

interface OnboardingFormProps {
  initialData?: any;
  isEditMode?: boolean;
  onComplete?: () => void; // Add this prop for edit mode callback
}

export default function OnboardingForm({ initialData, isEditMode = false, onComplete }: OnboardingFormProps) {
  const router = useRouter();
  const [boards, setBoards] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    classNumber: initialData?.class ? parseInt(initialData.class) : 0,
    subjects: initialData?.subjects || [] as string[],
    boardCode: initialData?.board || "",
    goals: initialData?.goals || "",
    school_name: initialData?.school_name || "",
  });

  // Fetch boards and classes on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [boardsData, classesData] = await Promise.all([
          getBoards(),
          getClasses()
        ]);
        setBoards(boardsData);
        setClasses(classesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleNext = () => {
    if (step === 1 && (!formData.name.trim() || !formData.classNumber)) {
      setError("Please fill your Name and select your Class.");
      return;
    }
    if (step === 2 && formData.subjects.length === 0) {
      setError("Please select at least one subject.");
      return;
    }
    if (step === 3 && (!formData.boardCode || !formData.goals)) {
      setError("Please select your Board and Goal.");
      return;
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!formData.school_name.trim()) {
      setError("Please enter your School Name.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await saveOnboardingData(formData);

      if (isEditMode) {
        // In edit mode, call onComplete callback if provided
        if (onComplete) {
          onComplete();
        }
        // Refresh the page data without full reload
        router.refresh();
      } else {
        // In onboarding mode, redirect to homepage
        router.push("/homepage");
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubjectToggle = (sub: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(sub)
        ? prev.subjects.filter((s: any) => s !== sub)
        : [...prev.subjects, sub],
    }));
  };

  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 bg-white rounded-3xl shadow-xl">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-6 md:p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: `${((step - 1) / 4) * 100}%` }}
          animate={{ width: `${(step / 4) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <div className="min-h-[350px] relative">
        <AnimatePresence mode="wait">
          {/* STEP 1 - Name & Class */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {isEditMode ? "Edit Your Profile" : "Welcome! Let's get to know you."}
                </h2>
                <p className="text-gray-500">
                  {isEditMode ? "Update your name and class." : "What's your name and which class are you in?"}
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Rahul Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700">Select Class</Label>
                <div className="flex flex-wrap gap-3">
                  {classes.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => setFormData({ ...formData, classNumber: cls.class_number })}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${formData.classNumber === cls.class_number
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {cls.display_name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2 - Subjects */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Subjects</h2>
                <p className="text-gray-500">Choose all the subjects you are studying.</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {SUBJECTS.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => handleSubjectToggle(sub)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${formData.subjects.includes(sub)
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3 - Board & Goals */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Academics & Goals</h2>
                <p className="text-gray-500">Tell us about your educational board and main focus.</p>
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700">Select Board</Label>
                <div className="flex flex-wrap gap-3">
                  {boards.map((board) => (
                    <button
                      key={board.id}
                      onClick={() => setFormData({ ...formData, boardCode: board.code })}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${formData.boardCode === board.code
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {board.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700">Primary Goal</Label>
                <div className="flex flex-wrap gap-3">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, goals: g })}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${formData.goals === g
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4 - School Name */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Almost Done!</h2>
                <p className="text-gray-500">What is the name of your school?</p>
              </div>

              <div className="space-y-3 mt-4">
                <Label htmlFor="school" className="text-gray-700">School Name</Label>
                <Input
                  id="school"
                  placeholder="e.g. Delhi Public School"
                  value={formData.school_name}
                  onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                  className="bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <Button variant="outline" onClick={handleBack} disabled={saving} className="rounded-xl px-6">
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-8">
            {saving ? "Saving..." : isEditMode ? "Save Changes" : "Complete Profile"}
          </Button>
        )}
      </div>
    </div>
  );
}