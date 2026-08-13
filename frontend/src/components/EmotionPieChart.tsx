"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Brain } from "lucide-react";

interface EmotionPieChartProps {
  emotionScores?: Record<string, number>;
  primaryEmotion?: string;
}

const EMOTION_COLORS: Record<string, string> = {
  ang: "#dc2626", // Angry / Stressed -> Red
  sad: "#3b82f6", // Sad -> Blue
  neu: "#10b981", // Neutral -> Green
  hap: "#f59e0b", // Happy -> Amber
};

const EMOTION_LABELS: Record<string, string> = {
  ang: "Anger / Stress",
  sad: "Sad / Low Energy",
  neu: "Neutral / Calm",
  hap: "Positive / Happy",
};

export default function EmotionPieChart({ emotionScores = {}, primaryEmotion = "NEU" }: EmotionPieChartProps) {
  const data = Object.keys(emotionScores).length > 0
    ? Object.entries(emotionScores).map(([key, val]) => ({
        name: EMOTION_LABELS[key] || key.toUpperCase(),
        value: Math.round(val * 100),
        color: EMOTION_COLORS[key] || "#8884d8",
      }))
    : [
        { name: "Neutral / Calm", value: 70, color: "#10b981" },
        { name: "Anger / Stress", value: 20, color: "#dc2626" },
        { name: "Low Energy", value: 10, color: "#3b82f6" },
      ];

  return (
    <div className="dashboard-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="dashboard-card-header flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-[#ff5500]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900">
            EMOTION PERCEPTION (DONUT CHART)
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff5500]/15 text-[#ff5500] font-bold border border-[#ff5500]/30">
          WAV2VEC2
        </span>
      </div>

      {/* Pie Chart Canvas */}
      <div className="p-3 flex-1 min-h-0 bg-white/30 backdrop-blur-md flex flex-col justify-between">
        <div className="w-full flex-1 min-h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${value}%`, "Probability"]}
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
              <Legend
                wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", color: "#0f172a", fontWeight: "bold" }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
