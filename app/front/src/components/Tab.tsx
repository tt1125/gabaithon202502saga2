"use client";

import * as React from "react";
import { Home, MessageCircleMore } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

type TabItem = {
  icon: React.ReactNode;
  label: string;
  path: string;
};

export function Tab() {
  const router = useRouter();
  const currentPath = usePathname();

  console.log(currentPath);

  const tabs: TabItem[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "ホーム",
      path: "/",
    },
    {
      icon: <MessageCircleMore className="h-5 w-5" />,
      label: "ソーシャル",
      path: "/social",
    },
  ];

  return (
    <nav className="w-full flex h-16 fixed bottom-0 left-0">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => router.push(tab.path)}
          className={cn(
            "flex flex-col w-full items-center justify-center gap-0.5 text-sm transition-colors",
            currentPath === tab.path
              ? "text-black"
              : "text-gray-400 hover:text-black",
          )}
          aria-selected={currentPath === tab.path}
          role="tab"
        >
          <div className="flex items-center justify-center h-5 w-5">
            {tab.icon}
          </div>
          <span className="text-xs">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
