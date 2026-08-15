"use client";

import React from "react";
import { useF1Sense } from "@/context/F1SenseContext";
import StressPaceChart from "@/components/StressPaceChart";
import RadialGauges from "@/components/RadialGauges";
import RadarRiskMatrix from "@/components/RadarRiskMatrix";
import EmotionPieChart from "@/components/EmotionPieChart";
import SectorTimelineChart from "@/components/SectorTimelineChart";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  const { telemetry, analysisResult, history } = useF1Sense();
  const lapDelta = (telemetry.actual_lap_time - telemetry.expected_lap_time).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-gray-800 mb-6 border-b border-[#e0d9cc] pb-2">
        <BarChart3 className="w-5 h-5 text-[#ff5500]" />
        <h2 className="text-lg font-bold uppercase tracking-wider">Detailed Analytics Engine</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Performance Trend */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-[#e0d9cc] min-h-[400px]">
          <StressPaceChart 
            stressScore={analysisResult.stressScore} 
            lapDelta={parseFloat(lapDelta)} 
            history={history} 
          />
        </div>

        {/* Risk Matrix */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-[#e0d9cc] min-h-[400px]">
          <RadarRiskMatrix
            stressScore={analysisResult.stressScore}
            tireWear={telemetry.tire_wear_pct}
            steeringInstability={telemetry.steering_instability}
            lateBraking={telemetry.late_braking_count}
            confidence={analysisResult.confidence}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] min-h-[300px]">
          <RadialGauges
            stressScore={analysisResult.stressScore}
            steeringInstability={telemetry.steering_instability}
            lateBraking={telemetry.late_braking_count}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] min-h-[300px]">
          <SectorTimelineChart 
            s1={telemetry.s1} 
            s2={telemetry.s2} 
            s3={telemetry.s3} 
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] min-h-[300px]">
          <EmotionPieChart
            emotionScores={analysisResult.emotionScores}
            primaryEmotion={analysisResult.emotion}
          />
        </div>
      </div>
    </div>
  );
}
