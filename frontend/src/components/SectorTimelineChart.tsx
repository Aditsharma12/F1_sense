"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Clock, Layers } from "lucide-react";

interface SectorTimelineChartProps {
  s1: number;
  s2: number;
  s3: number;
}

export default function SectorTimelineChart({ s1 = 0.32, s2 = 0.78, s3 = 0.40 }: SectorTimelineChartProps) {
  const sectorData = [
    { point: "T1", S1: s1 * 0.4, S2: s2 * 0.2, S3: s3 * 0.3 },
    { point: "T2", S1: s1 * 0.7, S2: s2 * 0.5, S3: s3 * 0.6 },
    { point: "S1 Exit", S1: s1, S2: s2 * 0.7, S3: s3 * 0.8 },
    { point: "T4 Apex", S1: s1 * 0.8, S2: s2 * 0.9, S3: s3 * 0.7 },
    { point: "S2 Exit", S1: s1 * 0.6, S2: s2, S3: s3 * 0.9 },
    { point: "T9 Heavy", S1: s1 * 0.5, S2: s2 * 0.8, S3: s3 },
    { point: "Finish", S1: s1 * 0.3, S2: s2 * 0.4, S3: s3 * 0.5 },
  ];

  return (
    <div className="dashboard-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="dashboard-card-header flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#d97700]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900">
            SECTOR DELTA MICRO-TIMELINE (S1/S2/S3)
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#d97700]/15 text-[#d97700] font-bold border border-[#d97700]/30">
          DELTA TELEMETRY
        </span>
      </div>

      {/* Area Chart */}
      <div className="p-3 flex-1 min-h-0 bg-white/30 backdrop-blur-md flex flex-col justify-between">
        <div className="w-full flex-1 min-h-[130px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sectorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sectorGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff5500" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#ff5500" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="sectorGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d97700" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#d97700" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
              <XAxis dataKey="point" stroke="#9ca3af" tick={{ fontSize: 10, fill: "#4b5563" }} />
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
              <Area type="monotone" dataKey="S2" stroke="#ff5500" strokeWidth={2} fill="url(#sectorGrad1)" />
              <Area type="monotone" dataKey="S1" stroke="#d97700" strokeWidth={2} fill="url(#sectorGrad2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-black/10 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#0088cc]" />
            <span className="text-gray-600 font-medium">TOTAL PACE LOSS:</span>
            <span className="text-[#ff5500] font-bold">+{(s1 + s2 + s3).toFixed(2)}s</span>
          </div>
          <span className="text-[11px] text-gray-600 font-medium">TRACK TEMP: 42°C</span>
        </div>
      </div>
    </div>
  );
}
