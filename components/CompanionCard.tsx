// import React from 'react'
// import Image from 'next/image';
// import Link from 'next/link';
// interface CompanionCardProps {
//     id: string;
//     name: string;
//     topic: string;
//     subject: string;
//     duration: number;
//     color: string;
//     // bookmarked: boolean;
// }

// const CompanionCard = ({
//     id,
//     name,
//     topic,
//     subject,
//     duration,
//     color, }:CompanionCardProps) => {
//     return (
//         <article 
//             className='flex flex-col rounded-[24px] px-5 py-6 gap-6 w-full min-lg:max-w-[410px] justify-between transition-all duration-300 hover:-translate-y-2 group' 
//             style={{ 
//               background: color,
//               backdropFilter: "blur(14px)",
//               WebkitBackdropFilter: "blur(14px)",
//               border: "1px solid rgba(255,255,255,0.7)",
//               boxShadow: "0 8px 32px rgba(0, 0, 0, 0.04)"
//             }}
//         >
//              <div className="flex justify-between items-center">
//         <div className="bg-white/80 backdrop-blur-md text-[#02aaa0] font-bold rounded-full text-xs px-3 py-1.5 capitalize shadow-sm border border-white/50">{subject}</div>
//         <button className="flex items-center justify-center p-2.5 bg-white/60 backdrop-blur-md hover:bg-white/90 transition-colors rounded-full shadow-sm border border-white/40 cursor-pointer">
//           <Image
//             src={"/icons/bookmark.svg"}
//             alt="bookmark"
//             width={14}
//             height={14}
//             className="opacity-70 group-hover:opacity-100 transition-opacity"
//           />
//         </button>
//       </div>

//       <div>
//         <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight leading-tight mb-1">{name}</h2>
//         <p className="text-sm font-medium text-gray-600/90 line-clamp-2">{topic}</p>
//       </div>

//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2 bg-white/40 px-3 py-1.5 rounded-xl border border-white/50 w-fit">
//           <Image
//             src="/icons/clock.svg"
//             alt="duration"
//             width={14}
//             height={14}
//             className="opacity-80"
//           />
//           <p className="text-sm font-semibold text-gray-700">{duration} min</p>
//         </div>
//       </div>

//       <Link href={`companions/${id}`} className="w-full mt-2">
//         <button className="w-full justify-center bg-[#02aaa0] hover:bg-[#02958d] text-white rounded-2xl font-semibold shadow-md transition-all py-3 flex items-center gap-2 active:scale-[0.98]">
//           Launch Lesson
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
//         </button>
//       </Link>
//         </article>
//     )
// }

// export default CompanionCard

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { createClient } from 'pexels';

// interface CompanionCardProps {
//   id: string;
//   name: string;
//   topic: string;
//   subject: string;
//   duration: number;
//   color: string;
//   image_keywords?: string[];
// }

// const CompanionCard = async ({
//   id,
//   name,
//   topic,
//   subject,
//   duration,
//   color,
//   image_keywords,
// }: CompanionCardProps) => {

//   // Fetch image logic
//   let imageUrl = "";
//   try {
//     if (image_keywords && image_keywords.length > 0) {
//       const keyword = image_keywords[0];
//       const pexelsClientId = process.env.NEXT_PUBLIC_PEXELS_CLIENT_ID;
//       if (pexelsClientId) {
//         const client = createClient(pexelsClientId);
//         const res = await client.photos.search({
//           query: keyword,
//           per_page: 1,
//           orientation: 'landscape',
//           size: 'small'
//         });
//         if ('photos' in res && res.photos.length > 0) {
//           imageUrl = res.photos[0].src.landscape;
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Failed to fetch CompanionCard image:", error);
//   }

//   return (
//     <article
//       className="w-full max-w-[460px] rounded-[32px] p-5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300"
//     >
//       {/* IMAGE / GLASSY GENERATED PLACEHOLDER */}
//       <div className="relative w-full h-[220px] rounded-[24px] overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#a1eee9" }}>

//         {/* Glassmorphic Depth Background (Theme #a1eee9) */}
//         {!imageUrl && (
//           <>
//             <div className="absolute top-[-20%] left-[-10%] w-[150%] h-[150%] bg-gradient-to-br from-white/40 via-transparent to-black/5 rounded-full blur-2xl pointer-events-none"></div>
//             <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-gradient-to-tl from-white/30 to-transparent rounded-full blur-xl pointer-events-none"></div>

//             <div className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-110"
//               style={{
//                 background: "rgba(255, 255, 255, 0.25)",
//                 backdropFilter: "blur(12px)",
//                 WebkitBackdropFilter: "blur(12px)",
//               }}>
//               <span className="text-4xl font-extrabold text-[#01867c] opacity-90 drop-shadow-sm">
//                 {name.charAt(0).toUpperCase()}
//               </span>
//             </div>
//           </>
//         )}

//         {/* Pexels Image */}
//         {imageUrl && (
//           <Image
//             src={imageUrl}
//             alt={name}
//             fill
//             className="object-cover"
//           />
//         )}
//       </div>

//       {/* CONTENT */}
//       <div className="mt-5 flex flex-col gap-3">
//         <h2 className="text-2xl font-bold text-gray-800">{name}</h2>

//         <p className="text-sm text-gray-500 line-clamp-2">{topic}</p>

//         <div className="flex items-center gap-3 text-sm text-gray-600">
//           <span className="px-3 py-1 bg-gray-100 rounded-full">
//             {subject}
//           </span>

//           <span className="flex items-center gap-1">
//             <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
//             {duration} min
//           </span>
//         </div>
//       </div>

//       {/* BUTTON */}
//       <Link href={`/companions/${id}`} className="block mt-5">
//         <button className="w-full bg-black text-white rounded-full py-3 font-semibold hover:opacity-90 transition">
//           Launch Lesson
//         </button>
//       </Link>
//     </article>
//   );
// };

// export default CompanionCard;

// components/CompanionCard.tsx
'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from 'pexels';
import { Trash2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import { deleteCompanion } from "@/lib/actions/companion.actions";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  image_keywords?: string[];
  isAuthor?: boolean; // Add this to know if current user is the author
}

const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  image_keywords,
  isAuthor = false,
}: CompanionCardProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");

  // Fetch image logic
  React.useEffect(() => {
    const fetchImage = async () => {
      try {
        if (image_keywords && image_keywords.length > 0) {
          const keyword = image_keywords[0];
          const pexelsClientId = process.env.NEXT_PUBLIC_PEXELS_CLIENT_ID;
          if (pexelsClientId) {
            const client = createClient(pexelsClientId);
            const res = await client.photos.search({
              query: keyword,
              per_page: 1,
              orientation: 'landscape',
              size: 'small'
            });
            if ('photos' in res && res.photos.length > 0) {
              setImageUrl(res.photos[0].src.landscape);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch CompanionCard image:", error);
      }
    };

    fetchImage();
  }, [image_keywords]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all associated quizzes and session history.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCompanion(id);
      router.refresh(); // Refresh the page to show updated list
    } catch (error) {
      console.error("Failed to delete companion:", error);
      alert("Failed to delete companion. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article
      className="w-full max-w-[460px] rounded-[32px] p-5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 relative group"
    >
      {/* Delete button - only show if user is author */}
      {isAuthor && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-7 right-7 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
          aria-label="Delete companion"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}

      {/* IMAGE / GLASSY GENERATED PLACEHOLDER */}
      <div className="relative w-full h-[220px] rounded-[24px] overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#a1eee9" }}>

        {/* Glassmorphic Depth Background */}
        {!imageUrl && (
          <>
            <div className="absolute top-[-20%] left-[-10%] w-[150%] h-[150%] bg-gradient-to-br from-white/40 via-transparent to-black/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-gradient-to-tl from-white/30 to-transparent rounded-full blur-xl pointer-events-none"></div>

            <div className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-110"
              style={{
                background: "rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}>
              <span className="text-4xl font-extrabold text-[#01867c] opacity-90 drop-shadow-sm">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          </>
        )}

        {/* Pexels Image */}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* CONTENT */}
      <div className="mt-5 flex flex-col gap-3">
        <h2 className="text-2xl font-bold text-gray-800">{name}</h2>

        <p className="text-sm text-gray-500 line-clamp-2">{topic}</p>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="px-3 py-1 bg-gray-100 rounded-full">
            {subject}
          </span>

          <span className="flex items-center gap-1">
            <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
            {duration} min
          </span>
        </div>
      </div>

      {/* BUTTON */}
      <Link href={`/companions/${id}`} className="block mt-5">
        <button className="w-full bg-black text-white rounded-full py-3 font-semibold hover:opacity-90 transition">
          Launch Lesson
        </button>
      </Link>
    </article>
  );
};

export default CompanionCard;