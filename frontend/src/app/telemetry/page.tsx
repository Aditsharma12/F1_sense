"use client";

import React from "react";
import { useF1Sense } from "@/context/F1SenseContext";
import TelemetryControls from "@/components/TelemetryControls";
import SensorFeeds from "@/components/SensorFeeds";
import SectorTimelineChart from "@/components/SectorTimelineChart";

export default function TelemetryPage() {
  const { telemetry, handleFieldChange, handleResetDefaults, analysisResult } = useF1Sense();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] overflow-hidden">
        <TelemetryControls 
          telemetry={telemetry} 
          onChange={handleFieldChange} 
          onReset={handleResetDefaults} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] overflow-hidden min-h-[300px]">
          <SensorFeeds
            stressScore={analysisResult.stressScore}
            tireWear={telemetry.tire_wear_pct}
            lateBraking={telemetry.late_braking_count}
            steeringInstability={telemetry.steering_instability}
          />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] overflow-hidden min-h-[300px]">
          <SectorTimelineChart 
            s1={telemetry.s1} 
            s2={telemetry.s2} 
            s3={telemetry.s3} 
          />
        </div>
      </div>
    </div>
  );
}
