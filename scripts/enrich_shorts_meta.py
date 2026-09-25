"""Fill shorts-meta.json for every short in shorts-catalog.json.

Keeps existing fields (pillar, keywords, youtube). Adds duration (seconds) and a
poster frame for any short that is missing them. Needs ffmpeg and ffprobe on PATH.

    python scripts/enrich_shorts_meta.py
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
catalog = json.loads((ROOT / "shorts-catalog.json").read_text(encoding="utf-8"))
meta_path = ROOT / "shorts-meta.json"
meta = json.loads(meta_path.read_text(encoding="utf-8")) if meta_path.exists() else {"items": {}}
items = meta.setdefault("items", {})
(ROOT / "media" / "posters").mkdir(parents=True, exist_ok=True)

for it in catalog.get("items", []):
    m = items.setdefault(it["id"], {"pillar": "", "keywords": [], "youtube": ""})
    mp4 = ROOT / it.get("file", f"media/shorts/{it['id']}.mp4")
    if not mp4.exists():
        continue
    if not m.get("duration"):
        out = subprocess.check_output(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp4)]
        )
        m["duration"] = round(float(out.decode().strip()))
    poster = ROOT / "media" / "posters" / f"{it['id']}.webp"
    if not poster.exists():
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-ss", "6", "-i", str(mp4), "-frames:v", "1",
             "-vf", "scale=360:-2", "-c:v", "libwebp", "-quality", "70", str(poster)],
            check=True,
        )
    m["poster"] = f"media/posters/{it['id']}.webp"

meta_path.write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"shorts-meta.json: {len(items)} entries")
