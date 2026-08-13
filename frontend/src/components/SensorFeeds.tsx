"use client";

import React from "react";
import { Sliders, Heart, AlertOctagon, Disc, Activity } from "lucide-react";

interface SensorFeedsProps {
  stressScore: number;
  tireWear: number;
  lateBraking: number;
  steeringInstability: number;
}

export default function SensorFeeds({
  stressScore = 75,
  tireWear = 78,
  lateBraking = 3,
  steeringInstability = 72,
}: SensorFeedsProps) {
  return (
    <div className="dashboard-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="dashboard-card-header flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#d97700]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900">
            SENSORS & PSYCHOMETRICS
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff5500]/15 text-[#d94400] font-bold border border-[#ff5500]/30">
          LIVE FEED
        </span>
      </div>

      {/* Sensor Feed Rows */}
      <div className="p-4 flex-1 space-y-3.5 bg-white/30 backdrop-blur-md font-mono">
        {/* Row 1: Vocal Stress Score */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-800 font-semibold flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>VOCAL STRESS INDEX</span>
            </span>
            <span className={`font-bold ${stressScore > 75 ? 'text-red-600' : 'text-[#d97700]'}`}>
              {stressScore} / 100
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-black/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ffaa00] via-[#ff5500] to-red-600 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, stressScore)}%` }}
            ></div>
          </div>
        </div>

        {/* Row 2: Steering Instability */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-800 font-semibold flex items-center space-x-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-[#d97700]" />
              <span>STEERING INSTABILITY</span>
            </span>
            <span className="font-bold text-[#d97700]">{steeringInstability}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-black/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ffaa00] to-[#ff5500] transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, steeringInstability)}%` }}
            ></div>
          </div>
        </div>

        {/* Row 3: Tire Wear Deg */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-800 font-semibold flex items-center space-x-1.5">
              <Disc className="w-3.5 h-3.5 text-[#0088cc]" />
              <span>MECHANICAL TIRE WEAR</span>
            </span>
            <span className={`font-bold ${tireWear > 75 ? 'text-red-600' : 'text-[#0088cc]'}`}>
              {tireWear}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-black/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0088cc] to-[#ffaa00] transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, tireWear)}%` }}
            ></div>
          </div>
        </div>

        {/* Row 4: Late Braking Count */}
        <div className="pt-2 border-t border-black/10 flex items-center justify-between text-xs font-semibold">
          <span className="text-gray-700">LATE BRAKING EVENTS</span>
          <span className="px-2 py-0.5 rounded bg-[#ff5500]/15 text-[#d94400] font-bold border border-[#ff5500]/30">
            {lateBraking} EVENTS
          </span>
        </div>
      </div>
    </div>
  );
}
