export interface TripPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface Trip {
  id: string;
  name: string;
  year: number;
  longitude: number;
  latitude: number;
  photos: TripPhoto[];
  note?: string;
}

// Representative markers, not visited addresses. Sources: travel/PROVENANCE.md.
export const trips: Trip[] = [
  { id: 'boston', name: 'Boston', year: 2026, longitude: -71.0636, latitude: 42.3581, photos: [] },
  { id: 'cincinnati', name: 'Cincinnati', year: 2026, longitude: -84.5060260, latitude: 39.1412561, photos: [] },
  { id: 'orlando', name: 'Orlando', year: 2026, longitude: -81.3368558, latitude: 28.4772289, photos: [] },
  { id: 'toronto', name: 'Toronto', year: 2026, longitude: -79.3833333, latitude: 43.65, photos: [] },
  { id: 'iceland', name: 'Iceland', year: 2026, longitude: -18.673711, latitude: 64.779286, photos: [] },
];
