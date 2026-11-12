#!/usr/bin/env python3
"""Create high-quality, full-resolution WebP copies of the Our Journey photos.

Original JPEG files are intentionally left untouched. The gallery references
the .webp copies after this script completes.
"""

from pathlib import Path
import re
import sys

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SCENES_FILE = ROOT / "data" / "scenes.js"


def gallery_sources():
    source = SCENES_FILE.read_text(encoding="utf-8")
    match = re.search(
        r"ourJourney\\s*:\\s*\\{[\\s\\S]*?images\\s*:\\s*\\[([\\s\\S]*?)\\]",
        source,
    )
    if not match:
        raise RuntimeError("Could not find the Our Journey image array in data/scenes.js.")

    # Ignore commented-out examples inside the array.
    array_text = re.sub(r"//.*$", "", match.group(1), flags=re.MULTILINE)
    paths = re.findall(
        r"""["'](images/adventures/[^"']+\\.(?:jpg|jpeg))["']""",
        array_text,
        flags=re.IGNORECASE,
    )
    if not paths:
        raise RuntimeError("No JPG/JPEG gallery photos were found.")
    return list(dict.fromkeys(paths))


def convert_one(relative_path):
    source_path = ROOT / relative_path
    output_path = source_path.with_suffix(".webp")

    if not source_path.is_file():
        raise FileNotFoundError(f"Missing original photo: {relative_path}")

    with Image.open(source_path) as original:
        original.load()
        image = ImageOps.exif_transpose(original)
        icc_profile = image.info.get("icc_profile")

        if image.mode in ("RGBA", "LA") or "transparency" in image.info:
            image = image.convert("RGBA")
        else:
            image = image.convert("RGB")

        # Preserve the original pixel dimensions; quality 90 keeps detail
        # while WebP is considerably smaller than the photographer JPEGs.
        image.save(
            output_path,
            format="WEBP",
            quality=90,
            method=6,
            lossless=False,
            icc_profile=icc_profile,
        )

    source_mb = source_path.stat().st_size / (1024 * 1024)
    output_mb = output_path.stat().st_size / (1024 * 1024)
    print(
        f"{relative_path}: {source_mb:.2f} MB -> "
        f"{output_path.relative_to(ROOT)}: {output_mb:.2f} MB"
    )


def main():
    paths = gallery_sources()
    print(f"Preparing {len(paths)} active Our Journey photos...")
    for path in paths:
        convert_one(path)
    print("Done. Original JPG/JPEG files were not changed.")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise
