"use client";

import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen w-full bg-[#f8f5f0] text-gray-900 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full w-full overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
