"use client";

import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { LineChart as ChartIcon, Zap } from "lucide-react";

interface StressPaceChartProps {
  stressScore: number;
  lapDelta: number;
}

export default function StressPaceChart({ stressScore = 75, lapDelta = 1.2 }: StressPaceChartProps) {
  // Generate realistic live lap pace & vocal stress telemetry timeline
  const chartData = [
    { lap: "L1", stress: 25, delta: 0.1, speed: 310 },
    { lap: "L2", stress: 30, delta: 0.2, speed: 312 },
    { lap: "L3", stress: 45, delta: 0.4, speed: 308 },
    { lap: "L4", stress: 60, delta: 0.8, speed: 305 },
    { lap: "L5", stress: stressScore > 0 ? stressScore : 78, delta: lapDelta, speed: 298 },
    { lap: "L6", stress: Math.max(30, stressScore - 15), delta: Math.max(0.3, lapDelta - 0.4), speed: 304 },
    { lap: "L7", stress: Math.max(20, stressScore - 25), delta: Math.max(0.2, lapDelta - 0.6), speed: 311 },
  ];

  return (
    <div className="dashboard-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="dashboard-card-header flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ChartIcon className="w-4 h-4 text-[#ff5500]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900">
            DRIVER STRESS VS LAP PACE DELTA
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[10px] font-mono">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97700] inline-block"></span>
            <span className="text-gray-700 font-medium">STRESS INDEX</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
            <span className="text-gray-700 font-medium">LAP DELTA (+s)</span>
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="p-3 flex-1 min-h-0 bg-white/30 backdrop-blur-md flex flex-col justify-between">
        <div className="w-full flex-1 min-h-[130px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff5500" />
                  <stop offset="50%" stopColor="#d97700" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
              <XAxis dataKey="lap" stroke="#9ca3af" tick={{ fontSize: 10, fill: "#4b5563" }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 10, fill: "#4b5563" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderColor: "rgba(0,0,0,0.15)",
                  borderRadius: "12px",
                  fontSize: "11px",
                  color: "#111827",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
              />
              <Line
                type="monotone"
                dataKey="stress"
                stroke="url(#lineGlow)"
                strokeWidth={3}
                dot={{ r: 5, fill: "#ffaa00", stroke: "#ff5500", strokeWidth: 2 }}
                activeDot={{ r: 8, fill: "#dc2626", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Live Metrics Footnote */}
        <div className="flex items-center justify-between pt-2 border-t border-black/10 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-[#d97700]" />
            <span className="text-gray-600 font-medium">CORRELATION:</span>
            <span className="text-[#d97700] font-bold">HIGH VOCAL STRESS &rarr; PACE DROP</span>
          </div>
          <div className="text-gray-600 text-[11px] font-medium">
            MAX DELTA: <span className="text-red-600 font-bold">+{lapDelta.toFixed(2)}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
