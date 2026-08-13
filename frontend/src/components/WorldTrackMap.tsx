"use client";

import React from "react";
import { Navigation, Globe, MapPin, Gauge } from "lucide-react";

interface TrackMapProps {
  speed: number;
  lapNumber: number;
}

export default function WorldTrackMap({ speed = 312, lapNumber = 1 }: { speed?: number; lapNumber?: number }) {
  return (
    <div className="dashboard-card h-full flex flex-col justify-between">
      {/* Header Bar */}
      <div className="dashboard-card-header flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-[#d97700]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900">
            CIRCUIT HEATMAP & TELEMETRY
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#d97700]/15 text-[#d97700] font-bold border border-[#d97700]/30">
          GPS LIVE 100Hz
        </span>
      </div>

      {/* Main Visualizer Canvas Area */}
      <div className="p-3 flex-1 min-h-0 flex flex-col justify-between relative bg-white/30 backdrop-blur-md">
        {/* Track Overlay / Heatmap Graphics */}
        <div className="relative w-full flex-1 min-h-[130px] rounded-xl border border-white/80 bg-white/50 overflow-hidden flex items-center justify-center shadow-inner">
          {/* Grid lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:16px_16px]"></div>

          {/* SVG F1 Track Path with Thermal Glow */}
          <svg className="w-full h-full p-2 relative z-10" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="trackGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff5500" />
                <stop offset="50%" stopColor="#d97700" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Outer Track Shadow */}
            <path
              d="M 60,140 C 40,100 80,40 150,40 C 220,40 280,70 340,60 C 370,55 380,100 350,140 C 310,180 200,160 140,170 Z"
              fill="none"
              stroke="rgba(217, 119, 0, 0.2)"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Glowing Main Track Ribbon */}
            <path
              d="M 60,140 C 40,100 80,40 150,40 C 220,40 280,70 340,60 C 370,55 380,100 350,140 C 310,180 200,160 140,170 Z"
              fill="none"
              stroke="url(#trackGlow)"
              strokeWidth="4"
              filter="url(#glowEffect)"
            />

            {/* Sector Pins */}
            <g className="font-mono text-[9px] font-bold">
              <circle cx="150" cy="40" r="4" fill="#d97700" className="animate-ping" />
              <circle cx="150" cy="40" r="3" fill="#d97700" />
              <text x="160" y="35" fill="#b45309">S1 ENTRY</text>

              <circle cx="340" cy="60" r="4" fill="#ff5500" />
              <text x="290" y="80" fill="#c2410c">S2 APEX (HEAVY DEG)</text>

              <circle cx="140" cy="170" r="4" fill="#0088cc" />
              <text x="120" y="190" fill="#0369a1">S3 STRAITS</text>
            </g>
          </svg>

          {/* Speed & Lap Badge Overlay */}
          <div className="absolute top-3 left-3 glass-box px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-sm">
            <Gauge className="w-4 h-4 text-[#d97700]" />
            <div className="text-left font-mono">
              <p className="text-[10px] text-gray-600 font-bold">TELEMETRY SPEED</p>
              <p className="text-sm font-extrabold text-gray-900 tracking-wider">{speed} <span className="text-xs text-[#ff5500]">KM/H</span></p>
            </div>
          </div>
        </div>

        {/* Bottom Sector Metrics Bar */}
        <div className="grid grid-cols-3 gap-2 mt-3 text-center font-mono">
          <div className="p-2 rounded-xl glass-box">
            <span className="text-[10px] text-gray-600 font-bold block">SECTOR 1</span>
            <span className="text-xs font-extrabold text-[#d97700]">+0.32s</span>
          </div>
          <div className="p-2 rounded-xl glass-box">
            <span className="text-[10px] text-gray-600 font-bold block">SECTOR 2</span>
            <span className="text-xs font-extrabold text-[#ff5500]">+0.78s</span>
          </div>
          <div className="p-2 rounded-xl glass-box">
            <span className="text-[10px] text-gray-600 font-bold block">SECTOR 3</span>
            <span className="text-xs font-extrabold text-[#0088cc]">+0.40s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
