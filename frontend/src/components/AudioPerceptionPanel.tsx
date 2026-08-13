"use client";

import React from "react";
import { Mic, MessageSquare, Brain, ShieldAlert, Volume2 } from "lucide-react";

interface AudioPerceptionPanelProps {
  audioUrl?: string;
  transcript: string;
  emotion: string;
  confidence: number;
  riskLevel: string;
  reasoning: string;
  isAnalyzing: boolean;
}

export default function AudioPerceptionPanel({
  audioUrl,
  transcript,
  emotion,
  confidence,
  riskLevel,
  reasoning,
  isAnalyzing,
}: AudioPerceptionPanelProps) {
  const getRiskColor = (level: string) => {
    if (level.includes("CRITICAL")) return "text-red-800 border-red-300 bg-red-100/80 font-bold shadow-sm";
    if (level.includes("ELEVATED")) return "text-amber-800 border-amber-300 bg-amber-100/80 font-bold shadow-sm";
    if (level.includes("WATCH")) return "text-yellow-800 border-yellow-300 bg-yellow-100/80 font-bold shadow-sm";
    return "text-emerald-800 border-emerald-300 bg-emerald-100/80 font-bold shadow-sm";
  };

  return (
    <div className="dashboard-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="dashboard-card-header flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mic className="w-4 h-4 text-[#0088cc]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900">
            DRIVER RADIO PERCEPTION & ANOMALY ENGINE
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0088cc]/15 text-[#0088cc] font-bold border border-[#0088cc]/30">
          WHISPER + WAV2VEC2
        </span>
      </div>

      {/* Main Content */}
      <div className="p-4 flex-1 space-y-4 bg-white/30 backdrop-blur-md font-mono">
        {/* Audio Player & Visualizer */}
        <div className="p-3 rounded-xl glass-box space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-700 font-semibold flex items-center space-x-1.5">
              <Volume2 className="w-4 h-4 text-[#d97700]" />
              <span>REAL AUDIO FEED</span>
            </span>

            {/* Glowing Equalizer Bars */}
            <div className="flex items-center space-x-1 h-5">
              {[40, 75, 100, 60, 90, 45, 80, 100, 70, 30, 85, 95, 50, 80, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-[#ff5500] to-[#d97700] rounded-full transition-all duration-200"
                  style={{
                    height: isAnalyzing ? `${h}%` : "25%",
                    opacity: isAnalyzing ? 1 : 0.4,
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* HTML5 Audio Player */}
          {audioUrl && (
            <audio controls src={audioUrl} className="w-full h-8 mt-2 accent-[#ff5500]" />
          )}
        </div>

        {/* Radio Transcript Box */}
        <div className="p-3 rounded-xl glass-box space-y-1">
          <div className="flex items-center justify-between text-[11px] text-gray-700 font-semibold">
            <span className="flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#d97700]" />
              <span>WHISPER TRANSCRIPT</span>
            </span>
            <span className="text-[10px] text-gray-500 font-bold">LIVE RESULT</span>
          </div>
          <p className="text-xs text-gray-900 font-medium italic bg-white/70 p-2.5 rounded-lg border border-black/10 min-h-[44px]">
            {transcript ? `"${transcript}"` : "(No transcript processed yet. Click 'Analyze Audio')"}
          </p>
        </div>

        {/* Emotion & Diagnostic Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Emotion Badge */}
          <div className="p-3 rounded-xl glass-box flex flex-col justify-between">
            <span className="text-[11px] text-gray-700 font-semibold flex items-center space-x-1 mb-1">
              <Brain className="w-3.5 h-3.5 text-[#0088cc]" />
              <span>DETECTED EMOTION</span>
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-extrabold text-[#d97700] uppercase">
                {emotion || "N/A"}
              </span>
              <span className="text-xs text-gray-600 font-medium">
                CONF: <span className="text-gray-900 font-bold">{Math.round(confidence * 100)}%</span>
              </span>
            </div>
          </div>

          {/* System Status Risk Level */}
          <div className={`p-3 rounded-xl border flex flex-col justify-between ${getRiskColor(riskLevel)}`}>
            <span className="text-[11px] flex items-center space-x-1 mb-1 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SYSTEM RISK LEVEL</span>
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wide">
              {riskLevel || "STANDBY"}
            </span>
          </div>
        </div>

        {/* Diagnostic Reasoning Box */}
        <div className="p-3 rounded-xl glass-box">
          <span className="text-[10px] text-gray-600 font-bold uppercase block mb-1">DIAGNOSTIC REASONING</span>
          <p className="text-xs text-gray-800 font-medium leading-relaxed">
            {reasoning || "Awaiting audio & telemetry input..."}
          </p>
        </div>
      </div>
    </div>
  );
}
