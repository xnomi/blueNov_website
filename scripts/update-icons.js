const sharp = require('sharp');
const fs = require('fs');

async function makeSvgFavicon() {
  const iconPng = await sharp('public/favicon-48.png').png().toBuffer();
  const b64 = iconPng.toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><image href="data:image/png;base64,${b64}" width="48" height="48"/></svg>`;
  fs.writeFileSync('public/favicon.svg', svg);
  console.log('Updated public/favicon.svg successfully');
}
makeSvgFavicon();
