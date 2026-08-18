import fs from 'fs';
import path from 'path';

const photosDir = path.join(process.cwd(), 'public/photos');
const outputDir = path.join(process.cwd(), 'app/field');
const outputFile = path.join(outputDir, 'photos.ts');

const photos = [];

const albumFolders = fs
  .readdirSync(photosDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory());

for (const album of albumFolders) {
  const albumDir = path.join(photosDir, album.name);

  const files = fs
    .readdirSync(albumDir)
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  for (const file of files) {
    photos.push({
      id: `${album.name}/${file}`,
      album: album.name,
      filename: file,
      src: `/photos/${album.name}/${file}`,
    });
  }
}

const content = `export const photos = ${JSON.stringify(photos, null, 2)};\n`;

fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(outputFile, content);

console.log(`Generated photo manifest with ${photos.length} photos.`);
