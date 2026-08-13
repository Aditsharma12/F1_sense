"use client";

import React from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import { ShieldAlert } from "lucide-react";

interface RadarRiskMatrixProps {
  stressScore: number;
  tireWear: number;
  steeringInstability: number;
  lateBraking: number;
  confidence: number;
}

export default function RadarRiskMatrix({
  stressScore = 75,
  tireWear = 82,
  steeringInstability = 76,
  lateBraking = 3,
  confidence = 0.85,
}: RadarRiskMatrixProps) {
  const data = [
    { metric: "Vocal Stress", value: stressScore, fullMark: 100 },
    { metric: "Tire Wear", value: tireWear, fullMark: 100 },
    { metric: "Steering Inst", value: steeringInstability, fullMark: 100 },
    { metric: "Late Braking", value: Math.min(100, lateBraking * 20), fullMark: 100 },
    { metric: "AI Confidence", value: Math.round(confidence * 100), fullMark: 100 },
  ];

  return (
    <div className="dashboard-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="dashboard-card-header flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-[#d97700]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900">
            RISK MATRIX (RADAR CHART)
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#d97700]/15 text-[#d97700] font-bold border border-[#d97700]/30">
          5D PROFILE
        </span>
      </div>

      {/* Radar Chart Canvas */}
      <div className="p-3 flex-1 min-h-0 bg-white/30 backdrop-blur-md flex flex-col justify-between">
        <div className="w-full flex-1 min-h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
              <PolarGrid stroke="rgba(0,0,0,0.18)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: "#0f172a", fontWeight: "800" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: "#374151", fontWeight: "bold" }} />
              <Radar
                name="Telemetry Profile"
                dataKey="value"
                stroke="#ff5500"
                fill="#ff5500"
                fillOpacity={0.45}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.96)",
                  borderColor: "rgba(0,0,0,0.15)",
                  borderRadius: "12px",
                  fontSize: "11px",
                  color: "#0f172a",
                  fontWeight: "600",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
