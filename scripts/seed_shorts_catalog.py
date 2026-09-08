import json
import datetime
from pathlib import Path

topics = json.loads(
    Path(r"C:\projects\claude\learn-ai-law\assets-src\notebooklm\shorts-topics.json").read_text(
        encoding="utf-8"
    )
)
items = []
for it in topics["items"]:
    items.append(
        {
            "id": it["name"],
            "name": it["name"],
            "title": it["title"],
            "file": f"media/shorts/{it['name']}.mp4",
            "artifact_id": None,
            "status": "pending",
        }
    )
notebook_id = None
state_path = Path(r"C:\output\obsidian\learning\ai-law\notebooklm\shorts\notebook-state.json")
if state_path.exists():
    try:
        notebook_id = json.loads(state_path.read_text(encoding="utf-8")).get("notebook_id")
    except Exception:
        notebook_id = None

# Prefer existing artifact status from manifest when present
manifest_path = Path(r"C:\output\obsidian\learning\ai-law\notebooklm\shorts\shorts-manifest.json")
by_name = {}
if manifest_path.exists():
    try:
        rows = json.loads(manifest_path.read_text(encoding="utf-8"))
        if isinstance(rows, dict):
            rows = [rows]
        for row in rows:
            by_name[row.get("name")] = row
    except Exception:
        by_name = {}

for it in items:
    row = by_name.get(it["id"])
    if not row:
        continue
    it["artifact_id"] = row.get("artifact_id")
    spa_mp4 = Path(r"C:\projects\claude\learn-ai-law") / it["file"]
    if spa_mp4.exists():
        it["status"] = "ready"
    elif row.get("artifact_id"):
        it["status"] = row.get("status") or "generating"
    else:
        it["status"] = row.get("status") or "pending"

ready = sum(1 for it in items if it["status"] == "ready")
catalog = {
    "notebook_id": notebook_id,
    "title": topics["title"],
    "total": len(items),
    "ready": ready,
    "updated": datetime.datetime.now().isoformat(),
    "items": items,
}
spa = Path(r"C:\projects\claude\learn-ai-law\shorts-catalog.json")
out_dir = Path(r"C:\output\obsidian\learning\ai-law\notebooklm\shorts")
out_dir.mkdir(parents=True, exist_ok=True)
text = json.dumps(catalog, indent=2)
spa.write_text(text, encoding="utf-8")
(out_dir / "shorts-catalog.json").write_text(text, encoding="utf-8")
print(f"seeded {len(items)} pending shorts")
