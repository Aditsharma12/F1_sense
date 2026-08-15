"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

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

export interface AnalysisResult {
  transcript: string;
  emotion: string;
  confidence: number;
  stressScore: number;
  riskLevel: string;
  reasoning: string;
  emotionScores: Record<string, number>;
}

export interface HistoryItem {
  lap: string;
  stress: number;
  delta: number;
}

interface F1SenseContextType {
  telemetry: TelemetryState;
  setTelemetry: React.Dispatch<React.SetStateAction<TelemetryState>>;
  samples: string[];
  selectedSample: string;
  setSelectedSample: React.Dispatch<React.SetStateAction<string>>;
  uploadedFile: File | null;
  setUploadedFile: React.Dispatch<React.SetStateAction<File | null>>;
  apiOnline: boolean;
  isAnalyzing: boolean;
  history: HistoryItem[];
  analysisResult: AnalysisResult;
  getApiBase: () => string;
  executeAnalysis: (tel: TelemetryState, file: File | null, samplePath: string) => Promise<void>;
  handleFieldChange: (field: keyof TelemetryState, val: number) => void;
  handleSelectSample: (path: string) => void;
  handleFileUpload: (file: File) => void;
  handleMicRecorded: (file: File) => void;
  handleResetDefaults: () => void;
  handleRunAnalysis: () => void;
}

const defaultTelemetry: TelemetryState = {
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
};

const defaultAnalysisResult: AnalysisResult = {
  transcript: "",
  emotion: "",
  confidence: 0,
  stressScore: 0,
  riskLevel: "",
  reasoning: "",
  emotionScores: {},
};

const F1SenseContext = createContext<F1SenseContextType | undefined>(undefined);

export function F1SenseProvider({ children }: { children: ReactNode }) {
  const [telemetry, setTelemetry] = useState<TelemetryState>(defaultTelemetry);
  const [samples, setSamples] = useState<string[]>([]);
  const [selectedSample, setSelectedSample] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [apiOnline, setApiOnline] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(defaultAnalysisResult);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const getApiBase = () => (typeof window !== "undefined" && window.location.hostname ? `http://${window.location.hostname}:8000` : "http://localhost:8000");

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
      } catch {
        setApiOnline(false);
      }
    }
    initBackend();
  }, []);

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
    } catch {
      // Ignore temporary fetch failures
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

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setSelectedSample(`File: ${file.name}`);
    if (apiOnline) {
      executeAnalysis(telemetry, file, file.name);
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
    const def = { ...defaultTelemetry, audio_path: samples.length > 0 ? samples[0] : defaultTelemetry.audio_path };
    setTelemetry(def);
    setSelectedSample(def.audio_path);
    setUploadedFile(null);
    if (apiOnline) {
      executeAnalysis(def, null, def.audio_path);
    }
  };

  return (
    <F1SenseContext.Provider
      value={{
        telemetry,
        setTelemetry,
        samples,
        selectedSample,
        setSelectedSample,
        uploadedFile,
        setUploadedFile,
        apiOnline,
        isAnalyzing,
        history,
        analysisResult,
        getApiBase,
        executeAnalysis,
        handleFieldChange,
        handleSelectSample,
        handleFileUpload,
        handleMicRecorded,
        handleResetDefaults,
        handleRunAnalysis,
      }}
    >
      {children}
    </F1SenseContext.Provider>
  );
}

export function useF1Sense() {
  const context = useContext(F1SenseContext);
  if (context === undefined) {
    throw new Error("useF1Sense must be used within a F1SenseProvider");
  }
  return context;
}
