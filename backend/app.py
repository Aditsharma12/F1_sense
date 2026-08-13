import glob
import os
import shutil
import tempfile
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from ex import process_audio, calculate_advanced_risk

app = FastAPI(title="F1 Driver Telemetry & Audio Stress API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def resolve_path(path: str) -> str:
    return os.path.abspath(os.path.join(BASE_DIR, path)) if not os.path.isabs(path) else path


class TelemetryRequest(BaseModel):
    audio_path: str
    lap_number: int = 1
    expected_lap_time: float
    actual_lap_time: float
    sector_deltas: list[float] = [0.0, 0.0, 0.0]
    tire_wear_pct: float = 0.0
    late_braking_count: int = 0
    steering_instability: float = 0.0


@app.get("/")
def root():
    return {"status": "ok", "message": "F1 Telemetry & Audio Stress API active"}


@app.get("/samples")
def list_samples():
    samples_dir = os.path.join(BASE_DIR, "test_audio_samples")
    if not os.path.exists(samples_dir):
        return {"samples": []}
    return {"samples": sorted(f"test_audio_samples/{f}" for f in os.listdir(samples_dir) if f.endswith(".wav"))}


@app.get("/audio-file")
def get_audio_file(path: str):
    full_path = resolve_path(path)
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(full_path, media_type="audio/wav")


@app.post("/analyze")
def analyze_telemetry(data: TelemetryRequest):
    full_path = resolve_path(data.audio_path)
    if not os.path.exists(full_path):
        raise HTTPException(status_code=400, detail=f"Audio file not found: {data.audio_path}")

    payload = data.model_dump()
    payload["audio_path"] = full_path
    return calculate_advanced_risk(process_audio(payload))


@app.post("/analyze-file")
async def analyze_telemetry_file(
    file: UploadFile = File(...),
    lap_number: int = Form(1),
    expected_lap_time: float = Form(...),
    actual_lap_time: float = Form(...),
    s1: float = Form(0.0),
    s2: float = Form(0.0),
    s3: float = Form(0.0),
    tire_wear_pct: float = Form(0.0),
    late_braking_count: int = Form(0),
    steering_instability: float = Form(0.0),
):
    suffix = os.path.splitext(file.filename)[1] if file.filename else ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        return analyze_telemetry(
            TelemetryRequest(
                audio_path=tmp_path,
                lap_number=lap_number,
                expected_lap_time=expected_lap_time,
                actual_lap_time=actual_lap_time,
                sector_deltas=[s1, s2, s3],
                tire_wear_pct=tire_wear_pct,
                late_braking_count=late_braking_count,
                steering_instability=steering_instability,
            )
        )
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
