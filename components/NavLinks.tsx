"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Dumbbell } from "lucide-react";

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", exact: true, icon: LayoutDashboard },
    { href: "/interviews", label: "Interviews", exact: false, icon: FileText },
    { href: "/practice", label: "Practice", exact: false, icon: Dumbbell },
  ];

  return (
    <nav className="flex items-center gap-2">
      {links.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);

        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 text-sm rounded-[8px] transition-all duration-150 ${
              isActive
                ? "text-[#A493FF] bg-[#7652FF]/12 border border-[#7652FF]/30 font-semibold shadow-xs"
                : "text-[#A5AFBF] hover:text-[#F8FAFC] hover:bg-[#151B27] border border-transparent font-medium"
            }`}
          >
            <Icon className={`size-3.5 ${isActive ? "text-[#A493FF]" : "text-[#687386]"}`} />
            <span>{link.label}</span>
            {isActive && (
              <span className="size-1 rounded-full bg-[#7652FF]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
