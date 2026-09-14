"use client";

import { useState } from "react";
import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

const SignOutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push("/sign-in");
      router.refresh();
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      title="Sign Out"
      className="inline-flex items-center gap-1.5 px-3 h-[38px] text-xs font-medium text-[#A7B0C5] hover:text-[#F5F7FF] bg-[#0B1224] hover:bg-[rgba(26,36,68,0.85)] border border-[rgba(110,120,180,0.22)] hover:border-[rgba(115,90,255,0.4)] rounded-[8px] transition-colors cursor-pointer disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="size-3.5 animate-spin text-[#A7B0C5]" />
      ) : (
        <LogOut className="size-3.5" />
      )}
      <span className="hidden sm:inline">Sign out</span>
    </button>
  );
};

export default SignOutButton;
