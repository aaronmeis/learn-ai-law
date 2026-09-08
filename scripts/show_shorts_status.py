import json
from pathlib import Path

manifest_path = Path(r"C:\output\obsidian\learning\ai-law\notebooklm\shorts\shorts-manifest.json")
spa_dir = Path(r"C:\projects\claude\learn-ai-law\media\shorts")
if not manifest_path.exists():
    print("no manifest")
    raise SystemExit(0)
raw = json.loads(manifest_path.read_text(encoding="utf-8-sig"))
rows = raw if isinstance(raw, list) else [raw]
print(f"manifest={len(rows)}")
ready_files = 0
with_aid = 0
for x in rows:
    aid = x.get("artifact_id")
    if aid:
        with_aid += 1
    mp4 = spa_dir / f"{x.get('name')}.mp4"
    exists = mp4.exists()
    if exists:
        ready_files += 1
    print(f"{x.get('name')} | {x.get('status')} | aid={'yes' if aid else 'no'} | mp4={'yes' if exists else 'no'}")
print(f"with_artifact={with_aid} spa_mp4={ready_files}")
