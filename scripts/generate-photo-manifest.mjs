import fs from 'fs';
import path from 'path';

const photosDir = path.join(process.cwd(), 'public/photos');
const outputDir = path.join(process.cwd(), 'app/field');
const outputFile = path.join(outputDir, 'photos.ts');

const photos = fs
  .readdirSync(photosDir)
  .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((file) => ({
    id: file,
    src: `/photos/${file}`,
  }));

const content = `export const photos = ${JSON.stringify(photos, null, 2)};\n`;

fs.writeFileSync(outputFile, content);

console.log(`Generated photo manifest with ${photos.length} photos.`);
