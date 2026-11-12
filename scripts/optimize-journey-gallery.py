#!/usr/bin/env python3
"""Create high-quality, full-resolution WebP copies of the Our Journey photos.

The scene list contains .webp output paths. This script reads the original
JPEG beside each one and writes a WebP copy. Original files are never changed.
"""

from pathlib import Path
import re
import sys

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SCENES_FILE = ROOT / "data" / "scenes.js"


def gallery_outputs():
    source = SCENES_FILE.read_text(encoding="utf-8")
    match = re.search(
        r"ourJourney\s*:\s*\{[\s\S]*?images\s*:\s*\[([\s\S]*?)\]",
        source,
    )
    if not match:
        raise RuntimeError("Could not find the Our Journey image array in data/scenes.js.")

    # Ignore commented-out examples inside the array.
    array_text = re.sub(r"//.*$", "", match.group(1), flags=re.MULTILINE)
    paths = re.findall(
        r"""["'](images/adventures/[^"']+\.webp)["']""",
        array_text,
        flags=re.IGNORECASE,
    )
    paths = list(dict.fromkeys(paths))
    if len(paths) != 26:
        raise RuntimeError(
            f"Expected 26 active WebP gallery paths, but found {len(paths)}."
        )
    return paths


def convert_one(webp_relative_path):
    output_path = ROOT / webp_relative_path
    source_path = output_path.with_suffix(".jpg")

    # Support a .jpeg original if a future gallery photo uses that extension.
    if not source_path.is_file():
        jpeg_alternative = output_path.with_suffix(".jpeg")
        if jpeg_alternative.is_file():
            source_path = jpeg_alternative

    if not source_path.is_file():
        raise FileNotFoundError(
            f"Could not find the original JPG/JPEG for {webp_relative_path}."
        )

    with Image.open(source_path) as original:
        original.load()
        image = ImageOps.exif_transpose(original)
        icc_profile = image.info.get("icc_profile")

        if image.mode in ("RGBA", "LA") or "transparency" in image.info:
            image = image.convert("RGBA")
        else:
            image = image.convert("RGB")

        # Preserve pixel dimensions. WebP quality 90 retains fine detail.
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
        f"{source_path.relative_to(ROOT)}: {source_mb:.2f} MB -> "
        f"{output_path.relative_to(ROOT)}: {output_mb:.2f} MB"
    )


def main():
    paths = gallery_outputs()
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
