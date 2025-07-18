import { Continent } from './SignersMapComponent';

const continentBoundaries: Record<
  Continent,
  { minLat: number; maxLat: number; minLng: number; maxLng: number }
> = {
  Africa: {
    minLat: -34.833333,
    maxLat: 37.348222,
    minLng: -17.625,
    maxLng: 51.272,
  },
  Asia: {
    minLat: -10.0,
    maxLat: 81.858711,
    minLng: 26.0,
    maxLng: 180.0,
  },
  Europe: {
    minLat: 34.0,
    maxLat: 71.0,
    minLng: -25.0,
    maxLng: 40.0,
  },
  'North America': {
    minLat: 5.493,
    maxLat: 83.6341,
    minLng: -168.1195,
    maxLng: -52.233,
  },
  'South America': {
    minLat: -56.05,
    maxLat: 13.5,
    minLng: -81.73,
    maxLng: -34.58,
  },
  Australia: {
    minLat: -47.0,
    maxLat: -10.0,
    minLng: 112.0,
    maxLng: 179.0,
  },
  Antarctica: {
    minLat: -90.0,
    maxLat: -60.0,
    minLng: -180.0,
    maxLng: 180.0,
  },
};

export function getContinent(latitude: number, longitude: number) {
  for (const [continent, bounds] of Object.entries(continentBoundaries)) {
    if (
      latitude >= bounds.minLat &&
      latitude <= bounds.maxLat &&
      longitude >= bounds.minLng &&
      longitude <= bounds.maxLng
    ) {
      return continent as Continent;
    }
  }
  return undefined;
}
