"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp, Flame } from "lucide-react";

interface MountainPeakChartProps {
  stressScore: number;
}

export default function MountainPeakChart({ stressScore = 75 }: MountainPeakChartProps) {
  const peakData = [
    { time: "00:00", value: 120 },
    { time: "00:05", value: 180 },
    { time: "00:10", value: 340 },
    { time: "00:15", value: 290 },
    { time: "00:20", value: 480 },
    { time: "00:25", value: 520 },
    { time: "00:30", value: 680 + (stressScore * 2) },
    { time: "00:35", value: 410 },
    { time: "00:40", value: 790 },
    { time: "00:45", value: 890 },
  ];

  return (
    <div className="dashboard-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="dashboard-card-header flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-[#ff5500]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900">
            AGGREGATE STRESS PEAK HARMONICS
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff5500]/15 text-[#d94400] font-bold border border-[#ff5500]/30">
          FFT FREQUENCY
        </span>
      </div>

      {/* Area Chart */}
      <div className="p-3 flex-1 min-h-0 bg-white/30 backdrop-blur-md flex flex-col justify-between">
        <div className="w-full flex-1 min-h-[130px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={peakData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="mountainOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff5500" stopOpacity={0.7} />
                  <stop offset="60%" stopColor="#ffaa00" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ff5500" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
              <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 10, fill: "#4b5563" }} />
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
              <Area
                type="monotone"
                dataKey="value"
                stroke="#ff5500"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#mountainOrange)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-2 border-t border-black/10 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#d97700]" />
            <span className="text-gray-600 font-medium">PEAK HARMONIC:</span>
            <span className="text-[#ff5500] font-bold">890 Hz</span>
          </div>
          <span className="text-[11px] text-gray-600 font-medium">BANDWIDTH: 16 kHz</span>
        </div>
      </div>
    </div>
  );
}
