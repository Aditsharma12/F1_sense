import os
import random
import io
import soundfile as sf

from datasets import load_dataset, Audio


# --------------------------------------------------
# 1. Output directory
# --------------------------------------------------

output_dir = "test_audio_samples"

os.makedirs(output_dir, exist_ok=True)

print(f"📁 Output directory: {output_dir}/")


# --------------------------------------------------
# 2. Load Hugging Face dataset
# --------------------------------------------------

print("⏳ Loading Hugging Face dataset ('PolyAI/minds14')...")

dataset = load_dataset(
    "PolyAI/minds14",
    name="en-US",
    split="train"
)

# Prevent Hugging Face from using torchcodec
dataset = dataset.cast_column(
    "audio",
    Audio(decode=False)
)

print(f"✅ Dataset loaded: {len(dataset)} samples")


# --------------------------------------------------
# 3. Select random samples
# --------------------------------------------------

total_samples = len(dataset)
num_to_download = min(15, total_samples)

random_indices = random.sample(
    range(total_samples),
    num_to_download
)

print(
    f"🎲 Selected {num_to_download} random samples "
    f"out of {total_samples} total records.\n"
)


# --------------------------------------------------
# 4. Save audio files
# --------------------------------------------------

for i, idx in enumerate(random_indices, start=1):

    sample = dataset[idx]

    audio = sample["audio"]

    # ----------------------------------------------
    # Get audio
    # ----------------------------------------------

    if audio.get("bytes") is not None:

        # Read audio directly from bytes
        audio_array, sample_rate = sf.read(
            io.BytesIO(audio["bytes"])
        )

    elif audio.get("path") is not None:

        # Fallback: read from file path
        audio_array, sample_rate = sf.read(
            audio["path"]
        )

    else:
        print(f"⚠️ Could not find audio for index {idx}")
        continue


    # ----------------------------------------------
    # Create filename
    # ----------------------------------------------

    filename = f"sample_{i:02d}_idx_{idx}.wav"

    filepath = os.path.join(
        output_dir,
        filename
    )


    # ----------------------------------------------
    # Save WAV
    # ----------------------------------------------

    sf.write(
        filepath,
        audio_array,
        sample_rate
    )

    print(
        f"✅ Saved [{i}/{num_to_download}]: "
        f"{filepath} | {sample_rate} Hz"
    )


# --------------------------------------------------
# 5. Done
# --------------------------------------------------

print(
    "\n🎉 All audio samples successfully "
    "saved to the test_audio_samples folder!"
)