#!/usr/bin/env python3
"""Create full-size WebP and lightweight preview copies for Our Journey.

The image list in data/scenes.js contains .webp output paths. For each one,
this script finds the matching original JPG/JPEG/PNG in images/adventures.
Original photos are never modified.
"""

from pathlib import Path
import re
import sys

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SCENES_FILE = ROOT / "data" / "scenes.js"
IMAGE_DIR = ROOT / "images" / "adventures"


def gallery_outputs():
    source = SCENES_FILE.read_text(encoding="utf-8")
    match = re.search(
        r"ourJourney\s*:\s*\{[\s\S]*?images\s*:\s*\[([\s\S]*?)\]",
        source,
    )
    if not match:
        raise RuntimeError(
            "Could not find the Our Journey image array in data/scenes.js."
        )

    # Ignore commented-out examples inside the array.
    array_text = re.sub(r"//.*$", "", match.group(1), flags=re.MULTILINE)
    paths = re.findall(
        r"""["'](images/adventures/[^"']+\.webp)["']""",
        array_text,
        flags=re.IGNORECASE,
    )
    paths = list(dict.fromkeys(paths))

    for relative_path in paths:
        output = Path(relative_path)
        if output.parent != Path("images/adventures") or output.suffix.lower() != ".webp":
            raise RuntimeError(f"Unsupported Our Journey image path: {relative_path}")

    return paths


def find_original(output_path):
    # Use a case-insensitive extension fallback for photos from different cameras.
    for extension in (".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"):
        candidate = output_path.with_suffix(extension)
        if candidate.is_file():
            return candidate
    raise FileNotFoundError(
        f"No matching original JPG/JPEG/PNG found for {output_path.relative_to(ROOT)}. "
        "Keep the original photo beside its .webp entry using the same filename."
    )


def convert_one(webp_relative_path):
    output_path = ROOT / webp_relative_path
    output_path.parent.mkdir(parents=True, exist_ok=True)
    thumbnail_path = output_path.with_name(output_path.stem + ".thumb.webp")
    source_path = find_original(output_path)

    with Image.open(source_path) as original:
        original.load()
        image = ImageOps.exif_transpose(original)
        icc_profile = image.info.get("icc_profile")

        if image.mode in ("RGBA", "LA") or "transparency" in image.info:
            image = image.convert("RGBA")
        else:
            image = image.convert("RGB")

        # Full-size lightbox image: preserve original pixel dimensions.
        image.save(
            output_path,
            format="WEBP",
            quality=90,
            method=6,
            lossless=False,
            icc_profile=icc_profile,
        )

        # Crisp collage preview; full-size image loads when a guest opens it.
        preview = image.copy()
        preview.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
        preview.save(
            thumbnail_path,
            format="WEBP",
            quality=87,
            method=6,
            lossless=False,
            icc_profile=icc_profile,
        )

    source_mb = source_path.stat().st_size / (1024 * 1024)
    full_mb = output_path.stat().st_size / (1024 * 1024)
    thumb_mb = thumbnail_path.stat().st_size / (1024 * 1024)
    print(
        f"{source_path.relative_to(ROOT)}: {source_mb:.2f} MB -> "
        f"full {full_mb:.2f} MB; preview {thumb_mb:.2f} MB"
    )


def remove_unused_numbered_outputs(active_paths):
    """Remove stale numbered WebP outputs after a photo is removed from the list.

    Original JPG/JPEG/PNG photos are deliberately kept as the archive.
    Only generated numbered WebP files and their .thumb.webp previews are removed.
    """
    keep_names = set()
    for relative_path in active_paths:
        output = Path(relative_path)
        keep_names.add(output.name)
        keep_names.add(output.stem + ".thumb.webp")

    removed = 0
    for candidate in IMAGE_DIR.glob("*.webp"):
        if not re.fullmatch(r"\d+(?:\.thumb)?\.webp", candidate.name, re.IGNORECASE):
            continue
        if candidate.name not in keep_names:
            candidate.unlink()
            print(f"Removed unused generated image: {candidate.relative_to(ROOT)}")
            removed += 1

    if removed == 0:
        print("No unused numbered WebP files to remove.")


def main():
    paths = gallery_outputs()
    print(f"Preparing {len(paths)} Our Journey photo(s)...")

    for path in paths:
        convert_one(path)

    remove_unused_numbered_outputs(paths)
    print("Done. Original JPG/JPEG/PNG photos were not changed or deleted.")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise
