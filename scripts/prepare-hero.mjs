// Optional preparation: normal builds use committed character data, never originals.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const sources = [
  ['27.jpg', 'Beach portrait'], ['IMG_0662.jpg', 'Canyon group photo'],
  ['IMG_0764.jpg', 'Waterfall group photo'],
  ['5EB7DC21-B211-4EBC-9AA3-BE69C84A108C.png', 'Teacup photo'],
  ['9E0E4F11-21EE-4C16-8ED9-EA3F9D5915DB.png', 'Night portrait'],
  ['CIMG5501.jpg', 'Apple bobbing'], ['CIMG5029.jpg', 'Friends with apples'],
];
const frames = await Promise.all(sources.map(async ([file, label]) => {
  const {data, info} = await sharp(fileURLToPath(new URL('../incoming/hero-photos/'+file, import.meta.url)))
    .rotate().resize(144,108,{fit:'contain',background:'#faf9f6',kernel:'cubic'})
    .removeAlpha().toColourspace('srgb').raw().toBuffer({resolveWithObject:true});
  let tones='';
  for(let i=0;i<data.length;i+=info.channels) {
    const luminance=(.2126*data[i]+.7152*data[i+1]+.0722*data[i+2])/255;
    tones+=Math.min(9,Math.floor(Math.max(0,Math.min(1,(luminance-.08)/.86))*10));
  }
  return {label,tones};
}));
await writeFile(new URL('../src/data/hero-frames.json',import.meta.url), JSON.stringify(frames)+'\n');
console.log(`Prepared ${frames.length} ASCII frames, 144 × 108 each; no original photos copied.`);
