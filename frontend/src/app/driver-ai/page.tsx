"use client";

import React from "react";
import { useF1Sense } from "@/context/F1SenseContext";
import EmotionPieChart from "@/components/EmotionPieChart";
import { Brain, ShieldAlert, FileText, Zap } from "lucide-react";

export default function DriverAIPage() {
  const { analysisResult } = useF1Sense();

  const getStressColor = (stress: number) => {
    if (stress > 70) return "text-red-600 bg-red-50";
    if (stress > 40) return "text-[#d97700] bg-[#ff5500]/10";
    return "text-emerald-600 bg-emerald-50";
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toUpperCase()) {
      case "HIGH": return "text-red-600 border-red-200 bg-red-50";
      case "MEDIUM": return "text-[#d97700] border-[#ff5500]/20 bg-[#ff5500]/5";
      default: return "text-emerald-600 border-emerald-200 bg-emerald-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Main Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Driver Stress */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] p-6 flex items-center space-x-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getStressColor(analysisResult.stressScore)}`}>
            <Brain className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">Driver Stress Level</h2>
            <div className="flex items-end space-x-2">
              <span className={`text-6xl font-black ${getStressColor(analysisResult.stressScore).split(' ')[0]}`}>
                {analysisResult.stressScore || 0}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2 font-medium">
              Vocal stress index calculated by Wav2Vec2 model.
            </p>
          </div>
        </div>

        {/* System Risk Level */}
        <div className={`rounded-xl shadow-sm border p-6 flex flex-col justify-center ${getRiskColor(analysisResult.riskLevel || "LOW")}`}>
           <div className="flex items-center space-x-3 mb-2">
             <ShieldAlert className="w-6 h-6" />
             <h2 className="text-sm font-semibold uppercase tracking-widest">Calculated Risk Level</h2>
           </div>
           <div className="text-5xl font-black tracking-wider uppercase">
             {analysisResult.riskLevel || "LOW"}
           </div>
           <p className="text-sm mt-3 opacity-80 font-medium">
             Aggregate of telemetry and audio analysis.
           </p>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emotion Distribution */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-[#e0d9cc] min-h-[300px]">
          <EmotionPieChart 
            emotionScores={analysisResult.emotionScores}
            primaryEmotion={analysisResult.emotion}
          />
        </div>

        {/* AI Reasoning */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-[#e0d9cc] p-6 flex flex-col">
          <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-[#e0d9cc]">
            <FileText className="w-5 h-5 text-[#0088cc]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">AI Diagnostic Reasoning</h3>
          </div>
          <div className="flex-1 bg-[#f8f5f0] rounded-lg p-5 border border-[#e0d9cc]">
            {analysisResult.reasoning ? (
              <p className="text-gray-800 leading-relaxed font-medium">
                {analysisResult.reasoning}
              </p>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 font-medium italic">
                Awaiting analysis...
              </div>
            )}
          </div>
          
          {analysisResult.emotion && (
            <div className="mt-4 pt-4 border-t border-[#e0d9cc]">
               <div className="flex items-center space-x-2">
                 <Zap className="w-4 h-4 text-[#ff5500]" />
                 <span className="text-xs font-bold uppercase text-gray-600 tracking-wider">Primary Emotion Detected:</span>
                 <span className="text-sm font-bold text-gray-900 px-2 py-0.5 bg-gray-100 rounded">{analysisResult.emotion.toUpperCase()}</span>
                 <span className="text-xs text-gray-500 font-medium ml-2">({Math.round(analysisResult.confidence * 100)}% Confidence)</span>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
