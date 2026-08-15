"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Activity, 
  BrainCircuit, 
  Radio, 
  BarChart3, 
  Settings,
  Flag
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Telemetry", href: "/telemetry", icon: Activity },
  { name: "Driver AI", href: "/driver-ai", icon: BrainCircuit },
  { name: "Race Radio", href: "/race-radio", icon: Radio },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#f8f5f0] border-r border-[#e0d9cc] flex flex-col h-full hidden md:flex shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-[#e0d9cc]">
        <Flag className="w-6 h-6 text-[#ff5500] mr-2" />
        <span className="font-bold text-xl tracking-wider text-[#222]">F1 SENSE</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-[#ff5500]/10 text-[#ff5500]" 
                  : "text-gray-600 hover:bg-[#e8e2d5] hover:text-gray-900"
              )}
            >
              <item.icon className={clsx("w-5 h-5", isActive ? "text-[#ff5500]" : "text-gray-500")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#e0d9cc]">
        <Link
          href="/settings"
          className={clsx(
            "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-[#ff5500]/10 text-[#ff5500]"
              : "text-gray-600 hover:bg-[#e8e2d5] hover:text-gray-900"
          )}
        >
          <Settings className={clsx("w-5 h-5", pathname === "/settings" ? "text-[#ff5500]" : "text-gray-500")} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
