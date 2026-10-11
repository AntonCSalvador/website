// Rebuild responsive landscape variants while retaining the embedded generation prompt.
import sharp from 'sharp';
import { copyFile } from 'node:fs/promises';
for (const width of [640, 960, 1280]) {
  await sharp('src/assets/hero/basecamp.webp').resize({ width }).keepMetadata().webp({ quality: 83 })
    .toFile(`src/assets/hero/basecamp-${width}.webp`);
  await copyFile('src/assets/hero/basecamp.webp.json', `src/assets/hero/basecamp-${width}.webp.json`);
}
