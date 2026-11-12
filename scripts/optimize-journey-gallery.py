#!/usr/bin/env python3
"""Build the Our Journey gallery list and optimized WebP images from numbered JPGs.

Put original photos directly in images/adventures/ and name them 01.jpg,
02.jpg, 03.jpg, etc. The numeric filename controls the gallery order.
Original JPGs are never modified by this script.
"""

from pathlib import Path
import re
import sys

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SCENES_FILE = ROOT / "data" / "scenes.js"
IMAGE_DIR = ROOT / "images" / "adventures"


def discover_gallery_outputs():
    """Use numbered JPGs in the folder as the complete Our Journey album."""
    sources = []
    for candidate in IMAGE_DIR.iterdir():
        if candidate.is_file() and re.fullmatch(r"\d+\.jpg", candidate.name, re.IGNORECASE):
            sources.append(candidate)

    sources.sort(key=lambda path: (int(path.stem), path.name.lower()))

    numbers = [int(path.stem) for path in sources]
    if len(numbers) != len(set(numbers)):
        raise RuntimeError(
            "Two photo files use the same number (for example 1.jpg and 01.jpg). "
            "Give every photo a unique number."
        )
    if not sources:
        raise RuntimeError(
            "No numbered JPG photos found in images/adventures/. "
            "Add photos named 01.jpg, 02.jpg, etc."
        )

    return [
        f"images/adventures/{source.stem}.webp"
        for source in sources
    ]


def update_scene_gallery(paths):
    """Rewrite only the Our Journey images array from the discovered photo order."""
    source = SCENES_FILE.read_text(encoding="utf-8")
    pattern = re.compile(
        r"(ourJourney\s*:\s*\{[\s\S]*?\bimages\s*:\s*\[)([\s\S]*?)(\])"
    )
    match = pattern.search(source)
    if not match:
        raise RuntimeError(
            "Could not find the Our Journey image array in data/scenes.js."
        )

    lines = "\n" + "\n".join(f'    "{path}",' for path in paths) + "\n    "
    updated = source[:match.start()] + match.group(1) + lines + match.group(3) + source[match.end():]

    if updated != source:
        SCENES_FILE.write_text(updated, encoding="utf-8")
        print("Updated the Our Journey image list automatically in data/scenes.js.")
    else:
        print("Our Journey image list already matches the numbered JPG files.")


def convert_one(webp_relative_path):
    output_path = ROOT / webp_relative_path
    thumbnail_path = output_path.with_name(output_path.stem + ".thumb.webp")
    source_path = output_path.with_suffix(".jpg")

    # Support uppercase .JPG filenames on case-sensitive build runners.
    if not source_path.is_file():
        source_path = output_path.with_suffix(".JPG")
    if not source_path.is_file():
        raise FileNotFoundError(
            f"Could not find the original JPG for {webp_relative_path}."
        )

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
    """Remove generated numbered WebPs and previews for photos no longer listed.

    The original JPGs are never removed by the optimizer. If you want to keep a
    photo outside the album, move it into a subfolder such as images/adventures/archive/.
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
    paths = discover_gallery_outputs()
    print(f"Preparing {len(paths)} Our Journey photo(s)...")

    update_scene_gallery(paths)

    for path in paths:
        convert_one(path)

    remove_unused_numbered_outputs(paths)
    print("Done. Original JPG photos were not changed or deleted.")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise
