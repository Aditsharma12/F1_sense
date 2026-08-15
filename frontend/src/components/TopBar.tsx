"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useF1Sense } from "@/context/F1SenseContext";
import { Server } from "lucide-react";
import clsx from "clsx";

const routeNames: Record<string, string> = {
  "/": "Overview",
  "/telemetry": "Telemetry",
  "/driver-ai": "Driver AI",
  "/race-radio": "Race Radio",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export default function TopBar() {
  const pathname = usePathname();
  const pageTitle = routeNames[pathname] || "Dashboard";
  const { apiOnline, telemetry } = useF1Sense();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#e0d9cc] flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
        {apiOnline && (
          <div className="hidden sm:flex items-center space-x-1.5 bg-[#ff5500]/10 px-2 py-1 rounded-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5500] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5500]"></span>
            </span>
            <span className="text-xs font-semibold text-[#ff5500] tracking-wider uppercase">Live</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-500 font-medium">Current Lap</span>
          <span className="font-mono font-bold text-gray-900 text-base">{telemetry.lap_number}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Server className={clsx("w-4 h-4", apiOnline ? "text-emerald-500" : "text-red-500")} />
          <span className="text-xs font-medium text-gray-600">
            {apiOnline ? "System Online" : "Backend Offline"}
          </span>
        </div>
      </div>
    </header>
  );
}
