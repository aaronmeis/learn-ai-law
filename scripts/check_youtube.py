"""Check that the Shorts moved to YouTube will play on the site.

For every Short in shorts-meta.json that has a "youtube" ID, ask YouTube's public
oEmbed endpoint whether the video exists and allows embedding. Unlisted videos
pass; private, deleted or embed-disabled videos fail.

    python scripts/check_youtube.py                 # check every ID
    python scripts/check_youtube.py --import ids.csv  # fill IDs first, then check

ids.csv has two columns, the Short id and the YouTube link or ID, e.g.
    32-aibom-versus-sbom,https://youtube.com/shorts/AbCdEfGhIjK
Standard library only. Needs internet access to youtube.com.
"""
import csv
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
META = ROOT / "shorts-meta.json"
ID_RE = re.compile(r"(?:v=|youtu\.be/|/shorts/|/embed/|/live/)([A-Za-z0-9_-]{11})|^([A-Za-z0-9_-]{11})$")


def video_id(text):
    m = ID_RE.search(text.strip())
    return (m.group(1) or m.group(2)) if m else None


def check(vid):
    url = "https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote(
        f"https://www.youtube.com/watch?v={vid}", safe=""
    )
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            return "OK", json.loads(r.read().decode("utf-8")).get("title", "")
    except urllib.error.HTTPError as e:
        reason = {
            400: "bad ID",
            401: "embedding turned off, or the video is private",
            403: "private or restricted",
            404: "not found (deleted, private, or still processing)",
        }.get(e.code, f"HTTP {e.code}")
        return "FAIL", reason
    except urllib.error.URLError as e:
        return "ERROR", f"could not reach YouTube ({e.reason})"


def main():
    meta = json.loads(META.read_text(encoding="utf-8"))
    items = meta["items"]

    if "--import" in sys.argv:
        path = Path(sys.argv[sys.argv.index("--import") + 1])
        n = 0
        with path.open(newline="", encoding="utf-8-sig") as f:
            for row in csv.reader(f):
                if len(row) < 2 or row[0].strip() not in items:
                    continue
                vid = video_id(row[1])
                if not vid:
                    print(f"  skipped {row[0]}: no video ID in {row[1]!r}")
                    continue
                items[row[0].strip()]["youtube"] = vid
                n += 1
        META.write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"Imported {n} YouTube IDs into shorts-meta.json\n")

    with_id = {k: v["youtube"] for k, v in items.items() if v.get("youtube")}
    missing = [k for k, v in items.items() if not v.get("youtube")]
    failures = 0
    for short_id, vid in with_id.items():
        status, detail = check(vid)
        if status != "OK":
            failures += 1
        print(f"{status:5}  {short_id:40}  {vid}  {detail}")

    print(f"\n{len(with_id) - failures} of {len(items)} Shorts play from YouTube.")
    if failures:
        print(f"{failures} need fixing in YouTube Studio (visibility Unlisted, Allow embedding on).")
    if missing:
        print(f"{len(missing)} still play from media/shorts/ (no YouTube ID yet).")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
