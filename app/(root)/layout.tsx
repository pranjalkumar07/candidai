import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import BackgroundEffects from "@/components/BackgroundEffects";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/sign-in");

  return (
    <div className="min-h-screen flex bg-[#050816] text-[#F5F7FF] relative selection:bg-[#6D4AFF]/30 selection:text-white">
      {/* 1. Global Atmospheric Background System */}
      <BackgroundEffects />

      {/* 2. Desktop Left Sidebar (~230px) */}
      <div className="hidden md:flex shrink-0 sticky top-0 h-screen z-40">
        <Sidebar />
      </div>

      {/* 3. Main Application Flow Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        {/* Top Header (~60px) */}
        <TopHeader userName={user.name} />

        {/* Content Viewport Container (max-width: 1440px) */}
        <main className="flex-1 candid-container py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
