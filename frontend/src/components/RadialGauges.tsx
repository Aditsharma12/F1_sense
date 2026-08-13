"use client";

import React from "react";
import { Gauge, ShieldAlert } from "lucide-react";

interface RadialGaugesProps {
  stressScore: number;
  steeringInstability: number;
  lateBraking: number;
}

export default function RadialGauges({
  stressScore = 80,
  steeringInstability = 72,
  lateBraking = 3,
}: RadialGaugesProps) {
  // Calculate SVG stroke-dashoffset for radial arcs
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const stressOffset = circumference - (stressScore / 100) * (circumference * 0.75);
  const telemetryRiskScore = Math.round(steeringInstability * 7.5 + lateBraking * 15);
  const riskOffset = circumference - (telemetryRiskScore / 800) * (circumference * 0.75);

  return (
    <div className="dashboard-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="dashboard-card-header flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gauge className="w-4 h-4 text-[#d97700]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900">
            DRIVER STRESS & TELEMETRY GAUGES
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#d97700]/15 text-[#d97700] font-bold border border-[#d97700]/30">
          ANOMALY ENGINE
        </span>
      </div>

      {/* Dials Container */}
      <div className="p-4 flex-1 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/30 backdrop-blur-md font-mono">
        {/* Left Radial Dial: Stress */}
        <div className="flex items-center space-x-3">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-135" viewBox="0 0 100 100">
              {/* Background Arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="rgba(0, 0, 0, 0.1)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * 0.25}
                strokeLinecap="round"
              />
              {/* Glowing Value Arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="url(#radialGlow1)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={stressOffset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="radialGlow1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0088cc" />
                  <stop offset="50%" stopColor="#d97700" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Value Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-gray-900 tracking-tighter">
                {stressScore}
              </span>
              <span className="text-[9px] text-gray-600 font-bold uppercase">STRESS</span>
            </div>
          </div>
        </div>

        {/* Right Radial Dial: Telemetry Risk */}
        <div className="flex items-center space-x-3">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-135" viewBox="0 0 100 100">
              {/* Background Arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="rgba(0, 0, 0, 0.1)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * 0.25}
                strokeLinecap="round"
              />
              {/* Glowing Value Arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="url(#radialGlow2)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={riskOffset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="radialGlow2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97700" />
                  <stop offset="100%" stopColor="#ff5500" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Value Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-gray-900 tracking-tighter">
                {telemetryRiskScore}
              </span>
              <span className="text-[9px] text-gray-600 font-bold uppercase">RISK INDEX</span>
            </div>
          </div>
        </div>

        {/* Telemetry Readout Stats List */}
        <div className="space-y-1.5 text-xs text-right border-l border-black/10 pl-4 w-full md:w-auto font-medium">
          <div className="text-gray-500 text-[10px]">ANOMALY FEED</div>
          <div className="text-gray-800">
            OVERDRIVING: <span className={steeringInstability > 70 ? "text-red-600 font-bold" : "text-emerald-700 font-bold"}>
              {steeringInstability > 70 ? "DETECTED" : "NOMINAL"}
            </span>
          </div>
          <div className="text-gray-800">
            LATENCY: <span className="text-[#0088cc] font-bold">12ms</span>
          </div>
          <div className="text-gray-800">
            DRIVER CAN BUS: <span className="text-[#d97700] font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
