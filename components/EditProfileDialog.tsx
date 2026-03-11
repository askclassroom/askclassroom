"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import OnboardingForm from "./OnboardingForm";

interface EditProfileDialogProps {
  initialData: any;
}

export default function EditProfileDialog({ initialData }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4 sm:mt-0 text-sm h-8 rounded-xl bg-white/50 border-white/50 hover:bg-white/80 transition-colors shadow-sm text-gray-700 font-semibold" onClick={() => setOpen(true)}>
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-transparent border-none shadow-none p-0 overflow-visible [&>button]:hidden">
        <DialogTitle className="sr-only">Edit Profile</DialogTitle>
        <DialogDescription className="sr-only">Update your profile information</DialogDescription>
        {/* We reuse the OnboardingForm but hide its native styling or just let it render */}
        {/* We also pass a custom close handler if we want, but OnboardingForm redirects. */}
        {/* Wait, OnboardingForm calls router.push("/homepage") on complete. Let's make it just refresh or push to current Route if isEditMode */}
        <div className="relative">
          <Button 
            variant="ghost" 
            className="absolute top-4 right-4 z-50 rounded-full h-8 w-8 p-0 bg-white/50 hover:bg-white/90 text-gray-500"
            onClick={() => setOpen(false)}
          >
            ✕
          </Button>
          <OnboardingForm initialData={initialData} isEditMode={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
