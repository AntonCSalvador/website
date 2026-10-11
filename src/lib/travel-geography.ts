// Equirectangular frame at ~40 degrees standard parallel; pins share this projection.
export function project(longitude: number, latitude: number): [number, number] {
  return [(longitude + 100) / 90 * 1000, (72 - latitude) / 52 * 760];
}

export function polygonPath(polygons: number[][][][]): string {
  return polygons.map((polygon) => polygon.map((ring) =>
    ring.map(([longitude, latitude], index) => {
      const [x, y] = project(longitude, latitude);
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join('') + 'Z',
  ).join('')).join('');
}
