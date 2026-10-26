#!/usr/bin/env python3
"""Generate stepped melt images from the user's ice block asset.

Requires: pip install pillow

The transparent ice block is the object layer extracted from the user's PSD.
Its visible area shrinks to (1 - melt) while it sinks toward the bottom of the
frame, leaving a growing puddle. At 0% the block fills the frame; at 70% only
30% of the block area remains; at 100% the block is gone.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/img/刘德华解冻.png"
ICE_BLOCK = ROOT / "assets/img/thaw/ice-block.png"
OUT = ROOT / "assets/img/thaw"
WIDTH, HEIGHT = 1080, 1116
LEVELS = list(range(0, 101, 10))


def paste_centered(canvas, block, center_x, center_y):
    width, height = block.size
    dest_x = center_x - width // 2
    dest_y = center_y - height // 2
    source_x = max(0, -dest_x)
    source_y = max(0, -dest_y)
    dest_x = max(0, dest_x)
    dest_y = max(0, dest_y)
    copy_width = min(width - source_x, WIDTH - dest_x)
    copy_height = min(height - source_y, HEIGHT - dest_y)
    if copy_width <= 0 or copy_height <= 0:
        return
    piece = block.crop((source_x, source_y, source_x + copy_width, source_y + copy_height))
    canvas.alpha_composite(piece, (dest_x, dest_y))


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    base = Image.open(SOURCE).convert("RGB").resize((WIDTH, HEIGHT), Image.LANCZOS).convert("RGBA")
    cube = Image.open(ICE_BLOCK).convert("RGBA")

    full_height = HEIGHT
    full_width = round(cube.width * full_height / cube.height)
    full = cube.resize((full_width, full_height), Image.LANCZOS)

    for level in LEVELS:
        melt = level / 100.0
        scale = (1 - melt) ** 0.5
        block_width = max(1, round(full_width * scale))
        block_height = max(1, round(full_height * scale))
        block = full.resize((block_width, block_height), Image.LANCZOS)
        center_x = WIDTH // 2
        center_y = round(HEIGHT * (0.5 + 0.30 * melt))

        canvas = base.copy()

        if level < 100:
            shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
            shadow_draw = ImageDraw.Draw(shadow)
            shadow_width = round(block_width * 0.75)
            shadow_height = max(2, round(block_height * 0.10))
            shadow_y = center_y + block_height // 2
            shadow_draw.ellipse(
                [
                    center_x - shadow_width // 2,
                    shadow_y - shadow_height // 2,
                    center_x + shadow_width // 2,
                    shadow_y + shadow_height // 2,
                ],
                fill=(6, 20, 32, 80),
            )
            shadow = shadow.filter(ImageFilter.GaussianBlur(12))
            canvas = Image.alpha_composite(canvas, shadow)
            paste_centered(canvas, block, center_x, center_y)

        if melt > 0:
            puddle = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
            puddle_draw = ImageDraw.Draw(puddle)
            puddle_width = round(WIDTH * (0.42 + 0.36 * melt))
            puddle_height = round(HEIGHT * (0.04 + 0.04 * melt))
            puddle_draw.ellipse(
                [
                    WIDTH // 2 - puddle_width // 2,
                    HEIGHT - puddle_height - 12,
                    WIDTH // 2 + puddle_width // 2,
                    HEIGHT - 12,
                ],
                fill=(198, 235, 250, int(120 * melt)),
            )
            puddle = puddle.filter(ImageFilter.GaussianBlur(10))
            canvas = Image.alpha_composite(canvas, puddle)

        result = canvas.convert("RGB")
        path = OUT / f"melt-{level:02d}.jpg"
        result.save(path, quality=88, optimize=True, progressive=True)
        print(
            f"{level:3d}%  ice_area={(1 - melt) * 100:5.1f}%  "
            f"block={block_width}x{block_height}  size={path.stat().st_size // 1024:4d}KB"
        )


if __name__ == "__main__":
    main()
