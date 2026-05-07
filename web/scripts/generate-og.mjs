import sharp from 'sharp';

const width = 1200;
const height = 630;

const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#0f1a12"/>
  <rect x="80" y="215" width="200" height="200" rx="44" fill="#3B1FA8"/>
  <rect x="80" y="215" width="200" height="200" rx="44" fill="#4C2EC4" opacity="0.5"/>
  <text x="180" y="310" text-anchor="middle" font-family="Inter, sans-serif"
    font-size="68" font-weight="700" fill="#FFFFFF" letter-spacing="-1">T.AI</text>
  <text x="180" y="380" text-anchor="middle" font-family="Inter, sans-serif"
    font-size="18" font-weight="400" fill="#C4B5FD" letter-spacing="4">TANGKHUL</text>
  <text x="340" y="280" font-family="Inter, sans-serif"
    font-size="52" font-weight="700" fill="#f0ead8" letter-spacing="-0.5">Tangkhul AI</text>
  <text x="340" y="340" font-family="Inter, sans-serif"
    font-size="22" font-weight="400" fill="#a89f85" letter-spacing="0.2">
    <tspan x="340" dy="0">Preserve. Teach. Evolve.</tspan>
    <tspan x="340" dy="32" font-size="16" fill="#c9a84c">A community-powered language preservation platform</tspan>
  </text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile('./public/og-image.png');
console.log('Generated og-image.png');