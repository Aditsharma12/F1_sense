"use client";

import React, { useState, useRef } from "react";
import { Activity, Radio, Cpu, Upload, Play, Mic, Square } from "lucide-react";

interface HeaderProps {
  apiOnline: boolean;
  isAnalyzing: boolean;
  samples: string[];
  selectedSample: string;
  onSelectSample: (samplePath: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMicRecorded: (file: File) => void;
  onRunAnalysis: () => void;
}

export default function Header({
  apiOnline,
  isAnalyzing,
  samples,
  selectedSample,
  onSelectSample,
  onFileUpload,
  onMicRecorded,
  onRunAnalysis,
}: HeaderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Real Microphone Recording via Web Audio API
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const recordedFile = new File([blob], "mic_recording.wav", { type: "audio/wav" });
        onMicRecorded(recordedFile);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch {
      alert("Microphone access denied or not supported.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <header className="dashboard-card mb-3 shrink-0">
      <div className="flex flex-col lg:flex-row items-center justify-between p-3 gap-3 bg-white/40 backdrop-blur-md">
        {/* Title & Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff5500] to-[#ffaa00] flex items-center justify-center shadow-md">
            <Activity className="w-6 h-6 text-white font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg md:text-xl font-bold tracking-wider text-gray-900 uppercase font-mono">
                CABIN SENSORS <span className="text-[#ff5500]">&</span> TELEMETRY
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#ff5500]/15 text-[#d94400] border border-[#ff5500]/30">
                LIVE FASTAPI ENGINE
              </span>
            </div>
            <p className="text-xs text-gray-600 font-mono">Real-Time Vocal Stress & Vehicle Telemetry Fusion</p>
          </div>
        </div>

        {/* Backend Status & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Badge */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/60 border border-black/10 text-xs font-mono shadow-sm">
            <span className={`w-2.5 h-2.5 rounded-full ${apiOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
            <span className="text-gray-800 font-semibold">
              {apiOnline ? "FASTAPI BACKEND READY (PORT 8000)" : "BACKEND OFFLINE (START APP.PY)"}
            </span>
          </div>

          {/* Sample Audio Selection */}
          <div className="flex items-center space-x-2 bg-white/60 border border-black/10 rounded-xl px-3 py-1.5 text-xs font-mono shadow-sm">
            <Radio className="w-4 h-4 text-[#d97700]" />
            <select
              value={selectedSample}
              onChange={(e) => onSelectSample(e.target.value)}
              className="bg-transparent text-gray-900 outline-none cursor-pointer max-w-[200px] truncate font-medium"
            >
              {(samples || []).length > 0 ? (
                (samples || []).map((s, idx) => (
                  <option key={s} value={s} className="bg-white text-gray-900">
                    Audio {idx + 1}: {s.split("/").pop()}
                  </option>
                ))
              ) : (
                <option value="" className="bg-white text-gray-900">No samples loaded</option>
              )}
            </select>
          </div>

          {/* Microphone Recording */}
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/70 hover:bg-red-50 border border-red-200 text-xs text-red-700 font-mono font-semibold transition cursor-pointer shadow-sm"
            >
              <Mic className="w-4 h-4 text-red-600" />
              <span>Record Mic</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs font-mono transition cursor-pointer animate-pulse shadow-md"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Stop Recording</span>
            </button>
          )}

          {/* Upload Audio File */}
          <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white/90 border border-black/10 text-xs text-gray-800 font-mono font-semibold cursor-pointer transition shadow-sm">
            <Upload className="w-4 h-4 text-[#0088cc]" />
            <span>Upload Audio</span>
            <input type="file" accept="audio/*" onChange={onFileUpload} className="hidden" />
          </label>

          {/* Run AI Analysis Action Button */}
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing || !apiOnline}
            className="flex items-center space-x-2 px-5 py-1.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ffaa00] hover:from-[#ff6600] hover:to-[#ffbb00] text-white font-bold text-xs font-mono uppercase tracking-wider shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {isAnalyzing ? (
              <Cpu className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Play className="w-4 h-4 fill-white text-white" />
            )}
            <span>{isAnalyzing ? "Processing..." : "Analyze Audio"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
