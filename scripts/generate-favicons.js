const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

async function generate() {
  const src = path.join(__dirname, '..', 'public', 'it-del-logo.jpg');
  if (!fs.existsSync(src)) {
    console.error('Source image not found at', src);
    process.exit(1);
  }

  const outDir = path.join(__dirname, '..', 'public');
  const sizes = [16, 32, 180];

  console.log('Generating PNG favicons...');
  await Promise.all(
    sizes.map((s) => sharp(src).resize(s, s, { fit: 'cover' }).png().toFile(path.join(outDir, `favicon-${s}.png`)))
  );

  // also write apple-touch-icon
  fs.copyFileSync(path.join(outDir, 'favicon-180.png'), path.join(outDir, 'apple-touch-icon.png'));

  console.log('Generating favicon.ico from PNGs...');
  const icoBuffer = await pngToIco([
    path.join(outDir, 'favicon-16.png'),
    path.join(outDir, 'favicon-32.png'),
    path.join(outDir, 'favicon-180.png')
  ]);
  fs.writeFileSync(path.join(outDir, 'favicon.ico'), icoBuffer);

  console.log('Favicons generated in', outDir);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
