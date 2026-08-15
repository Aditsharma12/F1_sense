"use client";

import React from "react";
import { useF1Sense } from "@/context/F1SenseContext";
import StressPaceChart from "@/components/StressPaceChart";
import { Activity, AlertTriangle, Timer, ActivitySquare, AlertCircle } from "lucide-react";

export default function Overview() {
  const { telemetry, analysisResult } = useF1Sense();
  const lapDelta = (telemetry.actual_lap_time - telemetry.expected_lap_time).toFixed(2);
  
  const getRiskColor = (risk: string) => {
    switch (risk.toUpperCase()) {
      case "HIGH": return "text-red-600 bg-red-100";
      case "MEDIUM": return "text-[#d97700] bg-[#ff5500]/10";
      default: return "text-emerald-600 bg-emerald-100";
    }
  };

  const getStressColor = (stress: number) => {
    if (stress > 70) return "text-red-600";
    if (stress > 40) return "text-[#d97700]";
    return "text-emerald-600";
  };

  return (
    <div className="space-y-6">
      {/* Race Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] p-4 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <ActivitySquare className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Driver Status</div>
            <div className="text-lg font-bold text-gray-900">
              {analysisResult.stressScore > 70 ? "High Stress" : "Optimal"}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] p-4 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-[#ff5500]/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-[#ff5500]" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Active Alerts</div>
            <div className="text-lg font-bold text-gray-900">
              {telemetry.late_braking_count > 2 || telemetry.steering_instability > 70 ? "2 Warnings" : "None"}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] p-4 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Timer className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Expected Pace</div>
            <div className="text-lg font-bold text-gray-900">{telemetry.expected_lap_time}s</div>
          </div>
        </div>
      </div>

      {/* 4 Compact Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Driver Stress */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] p-5">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Driver Stress</div>
          <div className="flex items-end justify-between">
            <div className={`text-4xl font-bold ${getStressColor(analysisResult.stressScore)}`}>
              {analysisResult.stressScore || 0}%
            </div>
            <Activity className={`w-6 h-6 mb-1 ${getStressColor(analysisResult.stressScore)}`} />
          </div>
        </div>

        {/* Risk Level */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] p-5">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Risk Level</div>
          <div className="flex items-end justify-between">
            <div className={`px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wider ${getRiskColor(analysisResult.riskLevel || "LOW")}`}>
              {analysisResult.riskLevel || "LOW"}
            </div>
            <AlertTriangle className={`w-6 h-6 mb-1 ${getRiskColor(analysisResult.riskLevel || "LOW").split(' ')[0]}`} />
          </div>
        </div>

        {/* Lap Delta */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] p-5">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Lap Delta</div>
          <div className="flex items-end justify-between">
            <div className={`text-4xl font-bold ${parseFloat(lapDelta) > 1.0 ? "text-red-600" : "text-emerald-600"}`}>
              {parseFloat(lapDelta) > 0 ? "+" : ""}{lapDelta}s
            </div>
            <Timer className="w-6 h-6 text-gray-400 mb-1" />
          </div>
        </div>

        {/* Tire Wear */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] p-5">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Tire Wear</div>
          <div className="flex items-end justify-between">
            <div className={`text-4xl font-bold ${telemetry.tire_wear_pct > 75 ? "text-red-600" : "text-blue-600"}`}>
              {telemetry.tire_wear_pct}%
            </div>
            <div className="w-6 h-6 mb-1 rounded-full border-4 border-gray-300 relative">
               <div className="absolute inset-0 rounded-full border-4 border-gray-800" style={{ clipPath: `inset(${100 - telemetry.tire_wear_pct}% 0 0 0)`}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trend */}
      <div className="h-96">
         <StressPaceChart 
           stressScore={analysisResult.stressScore} 
           lapDelta={parseFloat(lapDelta)} 
         />
      </div>
    </div>
  );
}
