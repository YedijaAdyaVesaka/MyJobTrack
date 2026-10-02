import fs from "node:fs";
import path from "node:path";

const WIDTH = 32;
const HEIGHT = 32;

// Create 32x32 RGBA canvas buffer (y: 0 is top, y: 31 is bottom)
const pixels = Array.from({ length: HEIGHT }, () =>
  Array.from({ length: WIDTH }, () => [0, 0, 0, 0])
);

function setPixel(x, y, r, g, b, a = 255) {
  if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
    // Alpha blending with existing pixel
    const existing = pixels[y][x];
    if (existing[3] === 0 || a === 255) {
      pixels[y][x] = [r, g, b, a];
    } else {
      const alpha = a / 255;
      const invAlpha = (1 - alpha) * (existing[3] / 255);
      const outAlpha = alpha + invAlpha;
      if (outAlpha > 0) {
        pixels[y][x] = [
          Math.round((r * alpha + existing[0] * invAlpha) / outAlpha),
          Math.round((g * alpha + existing[1] * invAlpha) / outAlpha),
          Math.round((b * alpha + existing[2] * invAlpha) / outAlpha),
          Math.round(outAlpha * 255),
        ];
      }
    }
  }
}

// Distance to rounded rectangle
function roundedRectDist(x, y, rx, ry, w, h, radius) {
  const dx = Math.max(Math.abs(x - (rx + w / 2)) - (w / 2 - radius), 0);
  const dy = Math.max(Math.abs(y - (ry + h / 2)) - (h / 2 - radius), 0);
  return Math.sqrt(dx * dx + dy * dy) - radius;
}

// 1. Draw rounded background (brand blue gradient: #3B82F6 -> #1D4ED8)
for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    const dist = roundedRectDist(x + 0.5, y + 0.5, 1, 1, 30, 30, 7.5);
    if (dist <= 0) {
      const t = (x + y) / (WIDTH + HEIGHT);
      // Gradient from [59, 130, 246] to [29, 78, 216]
      const r = Math.round(59 + (29 - 59) * t);
      const g = Math.round(130 + (78 - 130) * t);
      const b = Math.round(246 + (216 - 246) * t);
      setPixel(x, y, r, g, b, 255);
    } else if (dist < 1.0) {
      // Anti-aliasing border
      const t = (x + y) / (WIDTH + HEIGHT);
      const r = Math.round(59 + (29 - 59) * t);
      const g = Math.round(130 + (78 - 130) * t);
      const b = Math.round(246 + (216 - 246) * t);
      const alpha = Math.round((1 - dist) * 255);
      setPixel(x, y, r, g, b, alpha);
    }
  }
}

// 2. Draw Briefcase
// Handle: x from 12 to 19, y from 6 to 9 (top handle arch)
for (let x = 13; x <= 18; x++) {
  setPixel(x, 6, 255, 255, 255, 255);
  setPixel(x, 7, 255, 255, 255, 255);
}
for (let y = 7; y <= 9; y++) {
  setPixel(12, y, 255, 255, 255, 255);
  setPixel(13, y, 255, 255, 255, 255);
  setPixel(18, y, 255, 255, 255, 255);
  setPixel(19, y, 255, 255, 255, 255);
}
// Handle cutout (keep blue inside handle)
for (let x = 14; x <= 17; x++) {
  setPixel(x, 8, 45, 105, 230, 255);
  setPixel(x, 9, 45, 105, 230, 255);
}

// Briefcase main body outline: x: 6 to 25, y: 10 to 24 (corner radius ~2)
for (let y = 10; y <= 24; y++) {
  for (let x = 6; x <= 25; x++) {
    const isCorner =
      (x === 6 && (y === 10 || y === 24)) ||
      (x === 25 && (y === 10 || y === 24));
    if (isCorner) continue;

    const isBorder = (x === 6 || x === 25 || y === 10 || y === 24);
    if (isBorder) {
      setPixel(x, y, 255, 255, 255, 255);
    } else {
      // Body fill: bright navy blue
      setPixel(x, y, 37, 99, 235, 255);
    }
  }
}

// Horizontal center divider line
for (let x = 7; x <= 24; x++) {
  setPixel(x, 16, 255, 255, 255, 230);
}

// Briefcase center buckle / badge (x: 13 to 18, y: 14 to 18)
for (let y = 14; y <= 18; y++) {
  for (let x = 13; x <= 18; x++) {
    const isBorder = (x === 13 || x === 18 || y === 14 || y === 18);
    if (isBorder) {
      setPixel(x, y, 255, 255, 255, 255);
    } else {
      // Accent cyan/light blue buckle
      setPixel(x, y, 96, 165, 250, 255);
    }
  }
}

// Build ICO Buffer
const headerSize = 6;
const dirEntrySize = 16;
const bmiHeaderSize = 40;
const pixelDataSize = WIDTH * HEIGHT * 4;
const maskDataSize = (WIDTH / 8) * HEIGHT; // 4 * 32 = 128
const imageSize = bmiHeaderSize + pixelDataSize + maskDataSize;
const totalSize = headerSize + dirEntrySize + imageSize;

const buf = Buffer.alloc(totalSize);

// Header
buf.writeUInt16LE(0, 0); // reserved
buf.writeUInt16LE(1, 2); // type: icon
buf.writeUInt16LE(1, 4); // count: 1

// Directory Entry
buf.writeUInt8(WIDTH, 6); // width
buf.writeUInt8(HEIGHT, 7); // height
buf.writeUInt8(0, 8); // color count
buf.writeUInt8(0, 9); // reserved
buf.writeUInt16LE(1, 10); // color planes
buf.writeUInt16LE(32, 12); // bits per pixel
buf.writeUInt32LE(imageSize, 14); // image size
buf.writeUInt32LE(headerSize + dirEntrySize, 18); // offset (22)

// BITMAPINFOHEADER
let offset = 22;
buf.writeUInt32LE(40, offset); // biSize
buf.writeInt32LE(WIDTH, offset + 4); // biWidth
buf.writeInt32LE(HEIGHT * 2, offset + 8); // biHeight (doubled for ICO: 64)
buf.writeUInt16LE(1, offset + 12); // biPlanes
buf.writeUInt16LE(32, offset + 14); // biBitCount
buf.writeUInt32LE(0, offset + 16); // biCompression (BI_RGB)
buf.writeUInt32LE(pixelDataSize + maskDataSize, offset + 20); // biSizeImage
buf.writeInt32LE(0, offset + 24); // biXPelsPerMeter
buf.writeInt32LE(0, offset + 28); // biYPelsPerMeter
buf.writeUInt32LE(0, offset + 32); // biClrUsed
buf.writeUInt32LE(0, offset + 36); // biClrImportant
offset += 40;

// Pixel Data: bottom-to-top (y = 31 down to 0), BGRA format
for (let y = HEIGHT - 1; y >= 0; y--) {
  for (let x = 0; x < WIDTH; x++) {
    const [r, g, b, a] = pixels[y][x];
    buf.writeUInt8(b, offset++);
    buf.writeUInt8(g, offset++);
    buf.writeUInt8(r, offset++);
    buf.writeUInt8(a, offset++);
  }
}

// AND Mask: all 0s (alpha channel handles transparency)
for (let i = 0; i < maskDataSize; i++) {
  buf.writeUInt8(0, offset++);
}

const targetPath = path.resolve("src/app/favicon.ico");
fs.writeFileSync(targetPath, buf);
console.log(`Successfully generated favicon.ico at ${targetPath} (${buf.length} bytes)`);
