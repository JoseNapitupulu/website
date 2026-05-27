const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function buildIco(images) {
  const headerSize = 6;
  const entrySize = 16;
  const directorySize = headerSize + entrySize * images.length;
  let offset = directorySize;

  const entries = [];
  const parts = [];

  for (const image of images) {
    const width = image.width >= 256 ? 0 : image.width;
    const height = image.height >= 256 ? 0 : image.height;
    const entry = Buffer.alloc(entrySize);

    entry.writeUInt8(width, 0);
    entry.writeUInt8(height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(image.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);

    entries.push(entry);
    parts.push(image.buffer);
    offset += image.buffer.length;
  }

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  return Buffer.concat([header, ...entries, ...parts]);
}

async function generate() {
  const src = path.join(__dirname, '..', 'public', 'it-del-logo.jpg');
  if (!fs.existsSync(src)) {
    console.error('Source image not found at', src);
    process.exit(1);
  }

  const outDir = path.join(__dirname, '..', 'public');
  const sizes = [16, 32, 180];

  console.log('Generating PNG favicons...');
  const pngBuffers = [];
  await Promise.all(
    sizes.map(async (s) => {
      const buffer = await sharp(src).resize(s, s, { fit: 'cover' }).png().toBuffer();
      pngBuffers.push({ width: s, height: s, buffer });
      await sharp(buffer).toFile(path.join(outDir, `favicon-${s}.png`));
    })
  );

  // also write apple-touch-icon
  fs.copyFileSync(path.join(outDir, 'favicon-180.png'), path.join(outDir, 'apple-touch-icon.png'));

  console.log('Generating favicon.ico from PNG buffers...');
  const icoBuffer = buildIco(pngBuffers.sort((a, b) => a.width - b.width));
  fs.writeFileSync(path.join(outDir, 'favicon.ico'), icoBuffer);

  console.log('Favicons generated in', outDir);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
