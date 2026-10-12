// Run only when updating source assets. Site builds use checked-in local geography.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const source = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';
const response = await fetch(source);
if (!response.ok) throw new Error(`Natural Earth download failed: ${response.status}`);
const original = await response.text();
const countries = ['United States of America', 'Canada', 'Greenland', 'Iceland', 'Mexico', 'Cuba', 'The Bahamas'];
const geography = JSON.parse(original).features.filter((feature) => countries.includes(feature.properties.ADMIN)).map((feature) => ({
  name: feature.properties.ADMIN,
  // Keep polygons intersecting the frame; the SVG viewport clips their outer edges.
  polygons: (feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates)
    .filter((polygon) => polygon[0].some(([lon, lat]) => lon > -100 && lon < -10 && lat > 20 && lat < 72)),
}));
await mkdir('src/assets/travel', { recursive: true });
await writeFile('src/assets/travel/geography.json', JSON.stringify(geography));
console.log(`Geography: ${geography.length} countries, ${JSON.stringify(geography).length} bytes; source SHA256 ${createHash('sha256').update(original).digest('hex')}`);
const { prompt } = JSON.parse(await readFile('.impeccable/assets/hiker-provenance.json', 'utf8'));
await sharp('.impeccable/assets/hiker.png').trim().resize({ height: 168 }).webp({ quality: 82 })
  .withExif({ IFD0: { ImageDescription: prompt } }).toFile('src/assets/travel/hiker.webp');
console.log('Hiker optimized to 168px tall with the exact prompt embedded in EXIF.');
