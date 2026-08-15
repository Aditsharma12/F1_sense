"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { Clock, Layers } from "lucide-react";

interface SectorTimelineChartProps {
  s1: number;
  s2: number;
  s3: number;
}

const SECTOR_COLORS = ["#d97700", "#ff5500", "#0088cc"];

export default function SectorTimelineChart({ s1 = 0.35, s2 = 1.25, s3 = 0.70 }: SectorTimelineChartProps) {
  const sectorData = [
    { sector: "Sector 1", delta: s1 },
    { sector: "Sector 2", delta: s2 },
    { sector: "Sector 3", delta: s3 },
  ];

  return (
    <div className="dashboard-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="dashboard-card-header flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#d97700]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900">
            SECTOR DELTAS (BAR CHART)
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#d97700]/15 text-[#d97700] font-bold border border-[#d97700]/30">
          BAR METRICS
        </span>
      </div>

      {/* Bar Chart Canvas */}
      <div className="p-3 flex-1 min-h-0 bg-white/30 backdrop-blur-md flex flex-col justify-between">
        <div className="w-full flex-1 min-h-[130px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.12)" />
              <XAxis dataKey="sector" stroke="#4b5563" tick={{ fontSize: 10, fill: "#111827", fontWeight: "bold" }} />
              <YAxis stroke="#4b5563" tick={{ fontSize: 10, fill: "#111827", fontWeight: "bold" }} />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`+${Number(value).toFixed(2)}s`, "Delta"]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.96)",
                  borderColor: "rgba(0,0,0,0.15)",
                  borderRadius: "12px",
                  fontSize: "11px",
                  color: "#0f172a",
                  fontWeight: "600",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.12)"
                }}
              />
              <Bar dataKey="delta" radius={[6, 6, 0, 0]}>
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-black/10 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#0088cc]" />
            <span className="text-gray-600 font-medium">TOTAL SECTOR DELTA:</span>
            <span className="text-[#ff5500] font-bold">+{(s1 + s2 + s3).toFixed(2)}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
