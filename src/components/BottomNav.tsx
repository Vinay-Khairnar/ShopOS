"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { name: "Tabs", href: "/dashboard", icon: LayoutDashboard },
    { name: "Khata", href: "/dashboard/khata", icon: BookText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-neutral-200 shadow-md pb-safe">
      <div className="grid h-full w-full grid-cols-3 mx-auto max-w-md">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-neutral-50 active:bg-neutral-100 transition-colors group",
                isActive ? "text-blue-600" : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              <link.icon
                className={cn(
                  "w-6 h-6 mb-1 transition-transform",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )}
              />
              <span className="text-xs font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
