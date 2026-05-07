import sharp from 'sharp';

const width = 1284;
const height = 2778;

const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#0f1a12"/>
  <rect x="${width/2-140}" y="${height/2-180}" width="280" height="280" rx="64" fill="#3B1FA8"/>
  <rect x="${width/2-140}" y="${height/2-180}" width="280" height="280" rx="64" fill="#4C2EC4" opacity="0.5"/>
  <text x="${width/2}" y="${height/2-45}" text-anchor="middle" font-family="Inter, sans-serif"
    font-size="96" font-weight="700" fill="#FFFFFF" letter-spacing="-1">T.AI</text>
  <text x="${width/2}" y="${height/2+40}" text-anchor="middle" font-family="Inter, sans-serif"
    font-size="26" font-weight="400" fill="#C4B5FD" letter-spacing="6">TANGKHUL</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile('./assets/images/splash.png');
console.log('Generated splash.png');