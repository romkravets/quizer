/**
 * Removes white background from region map JPEG images using flood-fill from edges.
 * Outputs PNG files with transparent background in the same folder.
 * Run: node scripts/remove-map-bg.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../public/region-map");

const WHITE_THRESHOLD = 235; // pixels with R,G,B all above this are considered white/background

async function processImage(inputPath) {
  const outputPath = inputPath.replace(/\.jpe?g$/i, ".png");

  const image = sharp(inputPath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info; // channels = 4 (RGBA)

  const pixelCount = width * height;
  const visited = new Uint8Array(pixelCount);

  // Iterative BFS queue (plain array used as ring buffer via index)
  const queue = new Int32Array(pixelCount);
  let qHead = 0;
  let qTail = 0;

  const enqueue = (x, y) => {
    const pos = y * width + x;
    if (visited[pos]) return;
    const base = pos * channels;
    const r = data[base], g = data[base + 1], b = data[base + 2];
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      visited[pos] = 1;
      queue[qTail++] = pos;
    }
  };

  // Seed from all four edges
  for (let x = 0; x < width; x++) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  // BFS
  while (qHead < qTail) {
    const pos = queue[qHead++];
    // Make pixel transparent
    data[pos * channels + 3] = 0;

    const x = pos % width;
    const y = Math.floor(pos / width);

    if (x > 0)          enqueue(x - 1, y);
    if (x < width - 1)  enqueue(x + 1, y);
    if (y > 0)          enqueue(x, y - 1);
    if (y < height - 1) enqueue(x, y + 1);
  }

  await sharp(Buffer.from(data), { raw: { width, height, channels } })
    .png({ compressionLevel: 8 })
    .toFile(outputPath);

  console.log(`✓ ${path.basename(outputPath)}`);
}

const files = fs.readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f));
console.log(`Processing ${files.length} images…`);

for (const file of files) {
  await processImage(path.join(dir, file));
}

console.log("Done.");
