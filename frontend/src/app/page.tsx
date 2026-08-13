"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import StressPaceChart from "@/components/StressPaceChart";
import SensorFeeds from "@/components/SensorFeeds";
import RadialGauges from "@/components/RadialGauges";
import RadarRiskMatrix from "@/components/RadarRiskMatrix";
import EmotionPieChart from "@/components/EmotionPieChart";
import AudioPerceptionPanel from "@/components/AudioPerceptionPanel";
import SectorTimelineChart from "@/components/SectorTimelineChart";
import TelemetryControls, { TelemetryState } from "@/components/TelemetryControls";

export default function Dashboard() {
  // Telemetry Input State
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    audio_path: "test_audio_samples/sample_01_idx_447.wav",
    lap_number: 14,
    expected_lap_time: 80.0,
    actual_lap_time: 82.3,
    s1: 0.35,
    s2: 1.25,
    s3: 0.70,
    tire_wear_pct: 82,
    late_braking_count: 3,
    steering_instability: 76,
  });

  const [samples, setSamples] = useState<string[]>([]);
  const [selectedSample, setSelectedSample] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [apiOnline, setApiOnline] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<Array<{ lap: string; stress: number; delta: number }>>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Real AI Analysis Result
  const [analysisResult, setAnalysisResult] = useState({
    transcript: "",
    emotion: "",
    confidence: 0,
    stressScore: 0,
    riskLevel: "",
    reasoning: "",
    emotionScores: {} as Record<string, number>,
  });

  const getApiBase = () => (typeof window !== "undefined" && window.location.hostname ? `http://${window.location.hostname}:8000` : "http://localhost:8000");

  // Fetch Samples & Check Backend Status
  useEffect(() => {
    async function initBackend() {
      const apiBase = getApiBase();
      try {
        const res = await fetch(`${apiBase}/`, { method: "GET" });
        if (res.ok) {
          setApiOnline(true);
          const samplesRes = await fetch(`${apiBase}/samples`);
          if (samplesRes.ok) {
            const data = await samplesRes.json();
            if (data.samples && data.samples.length > 0) {
              setSamples(data.samples);
              setSelectedSample(data.samples[0]);
              setTelemetry((prev) => ({ ...prev, audio_path: data.samples[0] }));
            }
          }
        } else {
          setApiOnline(false);
        }
      } catch (err) {
        setApiOnline(false);
      }
    }
    initBackend();
  }, []);

  // Execute Real FastAPI Telemetry & Perception AI Analysis
  const executeAnalysis = async (tel: TelemetryState, file: File | null, samplePath: string) => {
    setIsAnalyzing(true);
    const apiBase = getApiBase();
    try {
      let url = `${apiBase}/analyze`;
      let options: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio_path: samplePath || tel.audio_path,
          lap_number: tel.lap_number,
          expected_lap_time: tel.expected_lap_time,
          actual_lap_time: tel.actual_lap_time,
          sector_deltas: [tel.s1, tel.s2, tel.s3],
          tire_wear_pct: tel.tire_wear_pct,
          late_braking_count: tel.late_braking_count,
          steering_instability: tel.steering_instability,
        }),
      };

      if (file) {
        url = `${apiBase}/analyze-file`;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("lap_number", tel.lap_number.toString());
        formData.append("expected_lap_time", tel.expected_lap_time.toString());
        formData.append("actual_lap_time", tel.actual_lap_time.toString());
        formData.append("s1", tel.s1.toString());
        formData.append("s2", tel.s2.toString());
        formData.append("s3", tel.s3.toString());
        formData.append("tire_wear_pct", tel.tire_wear_pct.toString());
        formData.append("late_braking_count", tel.late_braking_count.toString());
        formData.append("steering_instability", tel.steering_instability.toString());
        options = { method: "POST", body: formData };
      }

      const res = await fetch(url, options);
      if (res.ok) {
        const data = await res.json();
        if (data.ai_analysis) {
          const stress = data.ai_analysis.stress_score;
          const delta = Number((tel.actual_lap_time - tel.expected_lap_time).toFixed(2));
          setAnalysisResult({
            transcript: data.ai_analysis.transcript,
            emotion: data.ai_analysis.emotion,
            confidence: data.ai_analysis.confidence,
            stressScore: stress,
            riskLevel: data.system_status.risk_level,
            reasoning: data.system_status.diagnostic_reasoning,
            emotionScores: data.ai_analysis.emotion_scores || {},
          });
          setHistory((prev) => [
            ...prev.slice(-7),
            { lap: `Lap ${tel.lap_number}`, stress, delta },
          ]);
        }
      }
    } catch (e) {
      // Quietly ignore temporary connection interruptions during slider dragging
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunAnalysis = () => {
    executeAnalysis(telemetry, uploadedFile, selectedSample);
  };

  const handleFieldChange = (field: keyof TelemetryState, val: number) => {
    const nextTel = { ...telemetry, [field]: val };
    setTelemetry(nextTel);
    if (apiOnline) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        executeAnalysis(nextTel, uploadedFile, selectedSample);
      }, 400);
    }
  };

  const handleSelectSample = (path: string) => {
    setSelectedSample(path);
    setUploadedFile(null);
    const nextTel = { ...telemetry, audio_path: path };
    setTelemetry(nextTel);
    if (apiOnline) {
      executeAnalysis(nextTel, null, path);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setSelectedSample(`File: ${file.name}`);
      if (apiOnline) {
        executeAnalysis(telemetry, file, file.name);
      }
    }
  };

  const handleMicRecorded = (file: File) => {
    setUploadedFile(file);
    setSelectedSample("Mic Recording");
    if (apiOnline) {
      executeAnalysis(telemetry, file, "Mic Recording");
    }
  };

  const handleResetDefaults = () => {
    const def: TelemetryState = {
      audio_path: samples.length > 0 ? samples[0] : "test_audio_samples/sample_01_idx_447.wav",
      lap_number: 14,
      expected_lap_time: 80.0,
      actual_lap_time: 82.3,
      s1: 0.35,
      s2: 1.25,
      s3: 0.70,
      tire_wear_pct: 82,
      late_braking_count: 3,
      steering_instability: 76,
    };
    setTelemetry(def);
    setSelectedSample(def.audio_path);
    setUploadedFile(null);
    if (apiOnline) {
      executeAnalysis(def, null, def.audio_path);
    }
  };

  const lapDelta = telemetry.actual_lap_time - telemetry.expected_lap_time;
  const audioUrl = uploadedFile
    ? URL.createObjectURL(uploadedFile)
    : selectedSample
    ? `${getApiBase()}/audio-file?path=${encodeURIComponent(selectedSample)}`
    : undefined;

  return (
    <main className="min-h-screen p-4 md:p-6 text-gray-900 selection:bg-[#ff5500] selection:text-white overflow-y-auto space-y-6 relative">
      {/* Ambient Floating Background Light Orbs (Visible through Frosty Glass) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#ff5500]/30 to-[#ffaa00]/25 blur-[120px] fixed top-[-80px] left-[-80px] ambient-orb-1" />
        <div className="w-[450px] h-[450px] rounded-full bg-gradient-to-r from-[#ff7700]/25 to-[#ffbb66]/20 blur-[110px] fixed top-[30%] right-[-100px] ambient-orb-2" />
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#ff9900]/20 to-[#0088cc]/15 blur-[140px] fixed bottom-[-150px] left-[30%] ambient-orb-3" />
        
        {/* Subtle Vertical Scanning Telemetry Beam */}
        <div className="w-full h-[150px] bg-gradient-to-b from-transparent via-[#ff5500]/10 to-transparent blur-md fixed top-0 left-0 right-0 scanline-beam pointer-events-none" />
      </div>

      {/* Header Bar */}
      <Header
        apiOnline={apiOnline}
        isAnalyzing={isAnalyzing}
        samples={samples}
        selectedSample={selectedSample}
        onSelectSample={handleSelectSample}
        onFileUpload={handleFileUpload}
        onMicRecorded={handleMicRecorded}
        onRunAnalysis={handleRunAnalysis}
      />

      {/* Telemetry Sliders Controls */}
      <TelemetryControls
        telemetry={telemetry}
        onChange={handleFieldChange}
        onReset={handleResetDefaults}
      />

      {/* Grid Row 1: Top 2 Cards (Real Stress Line Chart, Sensor Feeds) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 min-h-[280px]">
          <StressPaceChart stressScore={analysisResult.stressScore} lapDelta={lapDelta} history={history} />
        </div>
        <div className="lg:col-span-4 min-h-[280px]">
          <SensorFeeds
            stressScore={analysisResult.stressScore}
            tireWear={telemetry.tire_wear_pct}
            lateBraking={telemetry.late_braking_count}
            steeringInstability={telemetry.steering_instability}
          />
        </div>
      </div>

      {/* Grid Row 2: Middle 3 Cards (Radial Gauges, Sector Bar Chart, Radar Risk Matrix) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[280px]">
        <RadialGauges
          stressScore={analysisResult.stressScore}
          steeringInstability={telemetry.steering_instability}
          lateBraking={telemetry.late_braking_count}
        />
        <SectorTimelineChart s1={telemetry.s1} s2={telemetry.s2} s3={telemetry.s3} />
        <RadarRiskMatrix
          stressScore={analysisResult.stressScore}
          tireWear={telemetry.tire_wear_pct}
          steeringInstability={telemetry.steering_instability}
          lateBraking={telemetry.late_braking_count}
          confidence={analysisResult.confidence}
        />
      </div>

      {/* Grid Row 3: Bottom 2 Cards (Emotion Donut Chart & Audio Perception Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[300px]">
        <div className="lg:col-span-4">
          <EmotionPieChart
            emotionScores={analysisResult.emotionScores}
            primaryEmotion={analysisResult.emotion}
          />
        </div>
        <div className="lg:col-span-8">
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
    </main>
  );
}
