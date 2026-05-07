import sharp from 'sharp';
import { readFileSync } from 'fs';

const svg = readFileSync('./public/icon-tai.svg');
const sizes = [16, 32, 48, 96, 180, 192, 512];

for (const size of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(`./public/icon-${size}x${size}.png`);
  console.log(`Generated ${size}x${size}`);
}

await sharp(svg).resize(32, 32).toFile('./public/favicon.ico');
console.log('Done.');