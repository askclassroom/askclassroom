import React from "react";
import OnboardingForm from "@/components/OnboardingForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/actions/user.actions";

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if they already have data in our DB
  const existingProfile = await getUserProfile();
  
  if (existingProfile?.name && existingProfile?.class) {
    // If they already completed onboarding, redirect them out
    redirect("/homepage");
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4"
         style={{ background: "linear-gradient(135deg, #02AAA0 0%, #0284c7 100%)" }}>
      
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-3xl" />
         <div className="absolute bottom-[0%] right-[0%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="z-10 w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Complete Your Profile</h1>
          <p className="text-white/80 text-lg">Help us personalize your AskClassroom experience.</p>
        </div>
        
        <OnboardingForm initialData={existingProfile || undefined} />
      </div>

    </div>
  );
}
