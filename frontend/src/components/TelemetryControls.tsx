"use client";

import React from "react";
import { Sliders, RotateCcw } from "lucide-react";

export interface TelemetryState {
  audio_path: string;
  lap_number: number;
  expected_lap_time: number;
  actual_lap_time: number;
  s1: number;
  s2: number;
  s3: number;
  tire_wear_pct: number;
  late_braking_count: number;
  steering_instability: number;
}

interface TelemetryControlsProps {
  telemetry: TelemetryState;
  onChange: (field: keyof TelemetryState, val: number) => void;
  onReset: () => void;
}

export default function TelemetryControls({ telemetry, onChange, onReset }: TelemetryControlsProps) {
  const lapDelta = (telemetry.actual_lap_time - telemetry.expected_lap_time).toFixed(2);

  return (
    <div className="dashboard-card mb-3 shrink-0">
      <div className="dashboard-card-header flex items-center justify-between py-2 px-3">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#0088cc]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900">
            LIVE TELEMETRY SIMULATION CONTROLS
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-1 text-[11px] font-mono text-gray-600 hover:text-gray-900 transition cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 text-[#d97700]" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-white/30 backdrop-blur-md font-mono text-xs">
        {/* Actual vs Expected Lap Time */}
        <div className="p-3 rounded-xl glass-box space-y-2">
          <div className="flex justify-between text-gray-800 font-semibold">
            <span>ACTUAL LAP TIME</span>
            <span className="font-bold text-[#d97700]">{telemetry.actual_lap_time.toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="75"
            max="95"
            step="0.1"
            value={telemetry.actual_lap_time}
            onChange={(e) => onChange("actual_lap_time", parseFloat(e.target.value))}
            className="w-full accent-[#ff5500] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-600 font-medium">
            <span>EXPECTED: {telemetry.expected_lap_time}s</span>
            <span className={parseFloat(lapDelta) > 1.0 ? "text-red-600 font-bold" : "text-emerald-700 font-bold"}>
              DELTA: +{lapDelta}s
            </span>
          </div>
        </div>

        {/* Tire Wear Deg */}
        <div className="p-3 rounded-xl glass-box space-y-2">
          <div className="flex justify-between text-gray-800 font-semibold">
            <span>TIRE WEAR DEG</span>
            <span className={telemetry.tire_wear_pct > 75 ? "font-bold text-red-600" : "font-bold text-[#0088cc]"}>
              {telemetry.tire_wear_pct}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={telemetry.tire_wear_pct}
            onChange={(e) => onChange("tire_wear_pct", parseInt(e.target.value))}
            className="w-full accent-[#0088cc] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-600 font-medium">
            <span>CLIFF THRESHOLD: 75%</span>
            <span>{telemetry.tire_wear_pct > 75 ? "MECHANICAL DEG" : "OPTIMAL"}</span>
          </div>
        </div>

        {/* Steering Instability % */}
        <div className="p-3 rounded-xl glass-box space-y-2">
          <div className="flex justify-between text-gray-800 font-semibold">
            <span>STEERING INSTABILITY</span>
            <span className={telemetry.steering_instability > 70 ? "font-bold text-red-600" : "font-bold text-[#d97700]"}>
              {telemetry.steering_instability}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={telemetry.steering_instability}
            onChange={(e) => onChange("steering_instability", parseInt(e.target.value))}
            className="w-full accent-[#ff5500] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-600 font-medium">
            <span>OVERDRIVE: &gt;70%</span>
            <span>{telemetry.steering_instability > 70 ? "HIGH ANOMALY" : "STABLE"}</span>
          </div>
        </div>

        {/* Late Braking Count */}
        <div className="p-3 rounded-xl glass-box space-y-2">
          <div className="flex justify-between text-gray-800 font-semibold">
            <span>LATE BRAKING EVENTS</span>
            <span className="font-bold text-[#d97700]">{telemetry.late_braking_count}</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={telemetry.late_braking_count}
            onChange={(e) => onChange("late_braking_count", parseInt(e.target.value))}
            className="w-full accent-[#ff5500] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-600 font-medium">
            <span>THRESHOLD: &ge;2</span>
            <span className={telemetry.late_braking_count >= 2 ? "text-red-600 font-bold" : "text-emerald-700"}>
              {telemetry.late_braking_count >= 2 ? "OVERCOOKED" : "CLEAN"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
