import torch
try:
    import torchaudio
except ImportError:
    torchaudio = None
try:
    import soundfile as sf
except ImportError:
    sf = None
import warnings
warnings.filterwarnings('ignore')

# ponytail: lazy-load heavy ML models on first call to prevent module import crashes and enable fast FastAPI startup
_whisper_model = None
_emotion_models = None

def get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        try:
            import whisper
            _whisper_model = whisper.load_model("base")
        except Exception as e:
            _whisper_model = "fallback"
    return _whisper_model

def get_emotion_models():
    global _emotion_models
    if _emotion_models is None:
        from transformers import Wav2Vec2FeatureExtractor, Wav2Vec2ForSequenceClassification
        model_name = "superb/wav2vec2-base-superb-er"
        feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(model_name)
        emotion_model = Wav2Vec2ForSequenceClassification.from_pretrained(model_name)
        id2label = emotion_model.config.id2label
        _emotion_models = (feature_extractor, emotion_model, id2label)
    return _emotion_models

def load_audio_numpy(audio_path):
    if torchaudio is not None:
        try:
            speech_array, _ = torchaudio.load(audio_path)
            return speech_array.squeeze().numpy().astype("float32")
        except Exception:
            pass
    if sf is not None:
        try:
            speech_data, _ = sf.read(audio_path)
            return speech_data.astype("float32")
        except Exception:
            pass
    import wave
    import numpy as np
    with wave.open(audio_path, 'rb') as wf:
        dtype = np.int16 if wf.getsampwidth() == 2 else np.int32
        speech_data = np.frombuffer(wf.readframes(wf.getnframes()), dtype=dtype).astype(np.float32) / 32768.0
        return speech_data.reshape(-1, wf.getnchannels()).mean(axis=1) if wf.getnchannels() > 1 else speech_data

def load_audio(audio_path):
    speech_array = torch.tensor(load_audio_numpy(audio_path), dtype=torch.float32)
    return speech_array.unsqueeze(0) if speech_array.ndim == 1 else speech_array

def get_wav2vec_emotion(audio_path):
    feature_extractor, emotion_model, id2label = get_emotion_models()
    speech_array = load_audio(audio_path)
    inputs = feature_extractor(speech_array.squeeze().numpy(), sampling_rate=16000, return_tensors="pt", padding=True)
    with torch.no_grad():
        logits = emotion_model(**inputs).logits
    probs = torch.nn.functional.softmax(logits, dim=-1)
    confidence, predicted_id = torch.max(probs, dim=-1)
    
    scores = {id2label[i].lower(): round(float(probs[0][i]), 4) for i in range(len(id2label))}
    return id2label[predicted_id.item()].lower(), float(confidence), scores

def process_audio(inputs: dict) -> dict:
    """Node 1: Perception"""
    whisper_model = get_whisper_model()
    audio_np = load_audio_numpy(inputs["audio_path"])
    
    transcript = ""
    if whisper_model != "fallback" and hasattr(whisper_model, "transcribe"):
        try:
            res = whisper_model.transcribe(audio_np, fp16=False)
            if isinstance(res, dict) and "text" in res:
                transcript = res["text"].strip()
        except Exception as e:
            print("Whisper transcribe error:", e)

    emo_label, emo_conf, emo_scores = get_wav2vec_emotion(inputs["audio_path"])
    return {**inputs, "transcript": transcript, "emotion": emo_label, "confidence": emo_conf, "emotion_scores": emo_scores}

def calculate_advanced_risk(inputs: dict) -> dict:
    """Node 2: Advanced Fusion Logic"""
    emo = inputs["emotion"]
    conf = inputs["confidence"]
    
    # 1. Psychological Stress Index
    stress_map = {
        'ang': min(100, int(70 + (30 * conf))),
        'sad': min(100, int(50 + (20 * conf))),
        'neu': max(0, int(20 - (10 * conf))),
        'hap': 10
    }
    stress = stress_map.get(emo, 20)
    
    # 2. Telemetry Extraction
    lap_delta = round(inputs["actual_lap_time"] - inputs["expected_lap_time"], 2)
    s1, s2, s3 = inputs["sector_deltas"]
    tire_wear = inputs["tire_wear_pct"]
    late_braking = inputs["late_braking_count"]
    steering_instability = inputs["steering_instability"]
    
    # 3. Anomaly Engine
    is_overdriving = (late_braking >= 2) or (steering_instability > 70.0)
    is_mechanical_deg = tire_wear > 75.0
    
    # 4. Decision Matrix
    risk_level = "🟢 NORMAL"
    reasoning = "Vehicle performance and driver psychological state within normal operating limits."
    
    if stress > 75:
        if is_overdriving and lap_delta > 1.2:
            risk_level = "🔴 CRITICAL RISK"
            reasoning = f"High vocal stress leading to aggressive overdriving ({late_braking} late braking events, {steering_instability}% steering instability). Heavy pace loss."
        elif is_mechanical_deg and lap_delta > 1.2:
            risk_level = "🟠 ELEVATED STRESS (Mechanical Deg)"
            reasoning = f"High vocal stress detected. Pace loss (+{lap_delta}s) is primarily driven by high tire wear ({tire_wear}%), not driver error."
        else:
            risk_level = "🟠 ELEVATED STRESS"
            reasoning = "Driver highly stressed, but maintaining acceptable racing line and telemetry parameters."
            
    elif stress > 50:
        if lap_delta > 0.5 or is_overdriving:
            risk_level = "🟡 WATCH"
            reasoning = f"Moderate stress index. Telemetry shows minor instability (S1: {s1:+.2f}s, S2: {s2:+.2f}s, S3: {s3:+.2f}s)."
            
    elif stress <= 50 and lap_delta > 1.5:
        risk_level = "🟢 NORMAL (Pace Drop Purely Mechanical)"
        reasoning = f"Driver vocal state calm. Significant pace loss (+{lap_delta}s) is attributable to high tire degradation ({tire_wear}%) or traffic."

    # Return the final structured dictionary
    return {
        "lap_number": inputs["lap_number"],
        "audio_path": inputs["audio_path"],
        "telemetry": {
            "expected_lap_time": inputs["expected_lap_time"],
            "actual_lap_time": inputs["actual_lap_time"],
            "lap_delta": lap_delta,
            "sector_deltas": {"S1": s1, "S2": s2, "S3": s3},
            "tire_wear_pct": tire_wear,
            "late_braking_count": late_braking,
            "steering_instability": steering_instability
        },
        "ai_analysis": {
            "transcript": inputs["transcript"],
            "emotion": emo.upper(),
            "confidence": round(conf, 2),
            "stress_score": stress,
            "emotion_scores": inputs.get("emotion_scores", {})
        },
        "system_status": {
            "risk_level": risk_level,
            "diagnostic_reasoning": reasoning
        }
    }
