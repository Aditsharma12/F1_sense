"use client";

import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { LineChart as ChartIcon, Zap } from "lucide-react";

interface StressPaceChartProps {
  stressScore: number;
  lapDelta: number;
  history?: Array<{ lap: string; stress: number; delta: number }>;
}

export default function StressPaceChart({ stressScore = 75, lapDelta = 1.2, history = [] }: StressPaceChartProps) {
  // Ensure unique X-axis labels for history runs or generate clean lap baseline (Lap N-4 to Lap N)
  const chartData = history.length > 1
    ? history.map((item, idx) => ({
        ...item,
        label: history.length > 1 ? `Run #${idx + 1}` : item.lap,
      }))
    : [
        { label: "Lap 10", stress: Math.max(15, Math.round(stressScore * 0.3)), delta: Number(Math.max(0.1, lapDelta * 0.2).toFixed(2)) },
        { label: "Lap 11", stress: Math.max(25, Math.round(stressScore * 0.45)), delta: Number(Math.max(0.2, lapDelta * 0.4).toFixed(2)) },
        { label: "Lap 12", stress: Math.max(35, Math.round(stressScore * 0.6)), delta: Number(Math.max(0.3, lapDelta * 0.65).toFixed(2)) },
        { label: "Lap 13", stress: Math.max(45, Math.round(stressScore * 0.8)), delta: Number(Math.max(0.5, lapDelta * 0.85).toFixed(2)) },
        { label: "Lap 14 (LIVE)", stress: stressScore, delta: lapDelta },
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
        <div className="flex items-center space-x-4 text-[10px] font-mono">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5500] inline-block"></span>
            <span className="text-gray-700 font-medium">STRESS INDEX (0-100)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
            <span className="text-gray-700 font-medium">PACE DELTA (+s)</span>
          </span>
        </div>
      </div>

      {/* Dual Axis Chart Canvas */}
      <div className="p-3 flex-1 min-h-0 bg-white/30 backdrop-blur-md flex flex-col justify-between">
        <div className="w-full flex-1 min-h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="stressGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff5500" />
                  <stop offset="100%" stopColor="#d97700" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.12)" />
              <XAxis dataKey="label" stroke="#4b5563" tick={{ fontSize: 10, fill: "#111827", fontWeight: "bold" }} />
              
              {/* Left Y-Axis: Stress Score (0 - 100) */}
              <YAxis yAxisId="left" domain={[0, 100]} stroke="#ff5500" tick={{ fontSize: 10, fill: "#c2410c", fontWeight: "bold" }} />
              
              {/* Right Y-Axis: Lap Delta (+s) */}
              <YAxis yAxisId="right" orientation="right" stroke="#dc2626" tick={{ fontSize: 10, fill: "#b91c1c", fontWeight: "bold" }} />
              
              <Tooltip
                formatter={(value: any, name: any) => [
                  name === "stress" ? `${value} / 100` : `+${Number(value).toFixed(2)}s`,
                  name === "stress" ? "Stress Index" : "Lap Delta"
                ]}
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
              
              {/* Line 1: Vocal Stress Score */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="stress"
                name="stress"
                stroke="url(#stressGlow)"
                strokeWidth={3}
                dot={{ r: 5, fill: "#ffaa00", stroke: "#ff5500", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#ff5500", stroke: "#fff", strokeWidth: 2 }}
              />
              
              {/* Line 2: Lap Pace Loss Delta (+s) */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="delta"
                name="delta"
                stroke="#dc2626"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: "#dc2626", stroke: "#991b1b", strokeWidth: 1.5 }}
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
