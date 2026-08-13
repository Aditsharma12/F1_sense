# 🏎️ F1 Sense — Telemetry & Driver Stress Perception Dashboard

**F1 Sense** is a real-time Formula 1 telemetry and driver vocal stress analysis platform. It combines raw vehicle sensor data (lap times, sector deltas, tire wear, braking late count, steering instability) with acoustic AI perception (speech transcription via OpenAI Whisper and vocal emotion classification via Wav2Vec2) to deliver immediate multi-modal risk diagnostics to race engineers.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Frontend["Frontend (Next.js 15 & React 19)"]
        H["Header (Controls & Recording)"]
        TC["Telemetry Controls (Sliders & Telemetry Inputs)"]
        
        subgraph Visualization["Dashboard Visualizations"]
            TM["World Track Map"]
            SPC["Stress vs Pace Chart"]
            SF["Sensor Feeds & Risk Status"]
            RG["Radial Gauges"]
            MPC["Mountain Peak Chart"]
            STC["Sector Timeline Chart"]
            APP["Audio Perception Panel"]
        end
    end

    subgraph Backend["Backend (FastAPI & PyTorch Engine)"]
        API["FastAPI REST Endpoints (/analyze, /analyze-file)"]
        
        subgraph Perception["Acoustic AI Perception"]
            W["OpenAI Whisper (Speech-to-Text)"]
            W2V["Wav2Vec2 (Vocal Emotion Classification)"]
        end
        
        subgraph FusionEngine["Multi-Modal Fusion Engine"]
            PSI["Psychological Stress Index"]
            AE["Telemetry Anomaly Engine"]
            DM["Decision & Diagnostic Matrix"]
        end
    end

    TC -->|"Telemetry State"| H
    H -->|"POST JSON / Multipart Form"| API
    API -->|"Raw Audio File/Stream"| Perception
    Perception --> W
    Perception --> W2V
    W -->|"Transcript"| FusionEngine
    W2V -->|"Emotion & Confidence"| FusionEngine
    API -->|"Vehicle Telemetry"| FusionEngine
    FusionEngine --> PSI
    FusionEngine --> AE
    PSI & AE --> DM
    DM -->|"JSON Analysis & Diagnostic Payload"| Visualization
```

---

## 🔄 End-to-End Data & Decision Flow

```mermaid
sequenceDiagram
    autonumber
    actor Driver as Driver / Pit Wall
    participant UI as Next.js Dashboard
    participant API as FastAPI Backend
    participant Whisper as Whisper AI
    participant W2V as Wav2Vec2 AI
    participant Engine as Anomaly & Fusion Engine

    Driver->>UI: Selects sample WAV / Uploads audio / Records mic
    Driver->>UI: Adjusts telemetry (Lap Time, Sector Deltas, Tire Wear, Braking, Steering)
    UI->>API: POST /analyze or /analyze-file
    par Parallel Perception
        API->>Whisper: Transcribe driver team radio audio
        Whisper-->>API: Returns transcript string
        API->>W2V: Classify vocal tone & stress confidence
        W2V-->>API: Returns emotion (ANG, SAD, NEU, HAP) & confidence
    end
    API->>Engine: Fuse vocal emotion + driver telemetry data
    Engine->>Engine: Calculate Psychological Stress Index & Telemetry Anomalies
    Engine->>Engine: Classify Risk (NORMAL, WATCH, ELEVATED STRESS, CRITICAL RISK)
    Engine-->>API: Return diagnostic reasoning payload
    API-->>UI: Deliver real-time analysis payload
    UI->>UI: Update Gauges, Stress Charts, Timeline & Audio Perception Panel
```

---

## 🧩 Web Dashboard Component Breakdown

```mermaid
mindmap
  root((F1 Sense Dashboard))
    Controls
      Header
        Backend API Status Indicator
        Sample Audio Selector
        Custom File Upload
        Mic Audio Recorder
      Telemetry Controls
        Target Lap Time vs Actual Lap Time
        Sector Deltas (S1, S2, S3)
        Tire Degradation Percentage
        Late Braking Event Counter
        Steering Instability Percentage
    Telemetry Charts
      World Track Map
        Live Speed Indicator
        Telemetry Lap Number
      Stress vs Pace Chart
        Pace Delta Overlay
        Vocal Stress Overlay
      Sector Timeline Chart
        S1, S2, S3 Split Performance
      Mountain Peak Chart
        Stint Stress Distribution
    AI Risk Diagnostics
      Radial Gauges
        Stress Index Score
        Steering Instability Gauge
        Late Braking Frequency
      Sensor Feeds
        Real-time Driver Stress Badge
        Tire Wear Degradation Indicator
        Overdriving Anomaly Detection
      Audio Perception Panel
        Audio Player & Waveform
        Whisper Radio Transcript
        Vocal Emotion & Confidence Score
        Diagnostic Reasoning & Action Plan
```

---

## 📁 Repository Structure

```
f1_tech/
├── backend/
│   ├── app.py          # FastAPI application & REST endpoint router
│   ├── ex.py           # ML Perception logic (Whisper, Wav2Vec2) & Anomaly Fusion Engine
│   └── goo.py          # Dataset audio extraction utility script
├── frontend/
│   ├── src/
│   │   ├── app/        # Next.js App Router (Layout & Dashboard Page)
│   │   └── components/ # Reusable UI Dashboard Components
│   └── next.config.ts  # Next.js configuration
└── test_audio_samples/ # Sample driver radio WAV audio files
```

---

## ⚡ Quick Start

### 1. Start Backend API
```bash
cd backend
pip install fastapi uvicorn torch transformers openai-whisper soundfile pydantic
python app.py
```
> The API will start at `http://localhost:8000`.

### 2. Start Frontend Web Dashboard
```bash
cd frontend
npm install
npm run dev
```
> Open `http://localhost:3000` in your browser.
