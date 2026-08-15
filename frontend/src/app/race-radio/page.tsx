"use client";

import React, { useState, useRef } from "react";
import { useF1Sense } from "@/context/F1SenseContext";
import AudioPerceptionPanel from "@/components/AudioPerceptionPanel";
import { Mic, Upload, Play, Cpu, Square, Radio, ArrowRight } from "lucide-react";

export default function RaceRadioPage() {
  const {
    apiOnline,
    isAnalyzing,
    samples,
    selectedSample,
    uploadedFile,
    analysisResult,
    handleSelectSample,
    handleFileUpload,
    handleMicRecorded,
    handleRunAnalysis,
    getApiBase,
  } = useF1Sense();

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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
        handleMicRecorded(recordedFile);
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

  const audioUrl = uploadedFile
    ? URL.createObjectURL(uploadedFile)
    : selectedSample
    ? `${getApiBase()}/audio-file?path=${encodeURIComponent(selectedSample)}`
    : undefined;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Step 1: Input Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4 flex items-center">
          <span className="w-6 h-6 rounded-full bg-[#ff5500] text-white flex items-center justify-center mr-2 text-xs">1</span>
          Select Audio Source
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Samples */}
          <div className="p-4 border border-[#e0d9cc] rounded-lg bg-[#f8f5f0]">
            <div className="flex items-center space-x-2 mb-3">
              <Radio className="w-5 h-5 text-[#ff5500]" />
              <span className="font-semibold text-gray-800">Use Sample</span>
            </div>
            <select
              value={selectedSample}
              onChange={(e) => handleSelectSample(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5500]"
            >
              {(samples || []).length > 0 ? (
                (samples || []).map((s, idx) => (
                  <option key={s} value={s}>
                    Sample {idx + 1}: {s.split("/").pop()}
                  </option>
                ))
              ) : (
                <option value="">No samples loaded</option>
              )}
            </select>
          </div>

          {/* Upload */}
          <div className="p-4 border border-[#e0d9cc] rounded-lg bg-[#f8f5f0]">
            <div className="flex items-center space-x-2 mb-3">
              <Upload className="w-5 h-5 text-[#0088cc]" />
              <span className="font-semibold text-gray-800">Upload File</span>
            </div>
            <label className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 text-sm font-semibold text-gray-700 rounded cursor-pointer hover:bg-gray-50 transition">
              <span>Choose Audio File</span>
              <input type="file" accept="audio/*" onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }} className="hidden" />
            </label>
          </div>

          {/* Mic */}
          <div className="p-4 border border-[#e0d9cc] rounded-lg bg-[#f8f5f0]">
            <div className="flex items-center space-x-2 mb-3">
              <Mic className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-gray-800">Record Live</span>
            </div>
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded text-sm font-semibold hover:bg-red-100 transition"
              >
                <Mic className="w-4 h-4" />
                <span>Start Recording</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white border border-red-700 rounded text-sm font-semibold animate-pulse"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Stop Recording</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Step 2: Analysis Action */}
      <div className="flex justify-center">
        <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleRunAnalysis}
          disabled={isAnalyzing || !apiOnline}
          className="flex items-center space-x-3 px-8 py-3 rounded-full bg-[#ff5500] hover:bg-[#ff4400] text-white font-bold text-sm tracking-wider uppercase shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <Cpu className="w-5 h-5 animate-spin" />
          ) : (
            <Play className="w-5 h-5 fill-white" />
          )}
          <span>{isAnalyzing ? "Running Analysis..." : "Analyze Audio"}</span>
        </button>
      </div>

      <div className="flex justify-center">
        <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
      </div>

      {/* Step 3: Perception Result */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e0d9cc] overflow-hidden min-h-[400px]">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest m-6 mb-2 flex items-center">
          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center mr-2 text-xs">3</span>
          Analysis Result
        </h2>
        <div className="px-6 pb-6 h-[400px]">
          <AudioPerceptionPanel
            audioUrl={audioUrl}
            transcript={analysisResult.transcript}
            emotion={analysisResult.emotion}
            confidence={analysisResult.confidence}
            riskLevel={analysisResult.riskLevel}
            reasoning={analysisResult.reasoning}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>
    </div>
  );
}
