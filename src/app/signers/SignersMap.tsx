import { useBreakpointValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

import { Box } from '../../ui/Box';
import { Continent } from './SignersMapComponent';

const defaultIcon = new L.Icon({
  iconUrl: '/default-marker-icon.svg',
});

const activeIcon = new L.Icon({
  iconUrl: '/active-marker-icon.svg',
});

interface CenterAndZoom {
  center: [number, number];
  zoom: number;
}

const StyledContainer = styled(Box)`
  height: 100%;
  width: 100%;
  
  .leaflet-marker-icon {
    cursor: default;
  }
`;

const MapUpdater = ({ activeContinent }: { activeContinent: Continent | null }) => {
  const map = useMap();

  const northAmericaCenterAndZoom = useBreakpointValue({
    base: { center: [37, -100], zoom: 3 },
    xl: { center: [33, -95], zoom: 3 },
  }) as CenterAndZoom;
  const africaCenterAndZoom = useBreakpointValue({
    base: { center: [9, 18], zoom: 3 },
    xl: { center: [9, 18], zoom: 3 },
  }) as CenterAndZoom;
  const europeCenterAndZoom = useBreakpointValue({
    base: { center: [48, 0], zoom: 4 },
    xl: { center: [46, 12], zoom: 4 },
  }) as CenterAndZoom;
  const australiaCenterAndZoom = useBreakpointValue({
    base: { center: [-25, 133], zoom: 4 },
    xl: { center: [-25, 133], zoom: 4 },
  }) as CenterAndZoom;
  const southAmericaCenterAndZoom = useBreakpointValue({
    base: { center: [-20, -61], zoom: 3 },
    xl: { center: [-20, -61], zoom: 3 },
  }) as CenterAndZoom;
  const asiaCenterAndZoom = useBreakpointValue({
    base: { center: [20, 150], zoom: 3 },
    xl: { center: [17, 115], zoom: 3 },
  }) as CenterAndZoom;

  const getContinetCenterAndZoom = useCallback(
    (continent: Continent | null): CenterAndZoom => {
      switch (continent) {
        case Continent.NorthAmerica:
          return northAmericaCenterAndZoom;
        case Continent.Africa:
          return africaCenterAndZoom;
        case Continent.Europe:
          return europeCenterAndZoom;
        case Continent.Australia:
          return australiaCenterAndZoom;
        case Continent.SouthAmerica:
          return southAmericaCenterAndZoom;
        case Continent.Asia:
          return asiaCenterAndZoom;
        default:
          return { center: [20, 0], zoom: 1 };
      }
    },
    [
      northAmericaCenterAndZoom,
      africaCenterAndZoom,
      europeCenterAndZoom,
      australiaCenterAndZoom,
      southAmericaCenterAndZoom,
      asiaCenterAndZoom,
    ]
  );

  useEffect(() => {
    const { center, zoom } = getContinetCenterAndZoom(activeContinent);
    map.setView(center, zoom);
  }, [map, activeContinent, getContinetCenterAndZoom]);

  return null;
};

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
  // Antarctica: {
  //   minLat: -90.0,
  //   maxLat: -60.0,
  //   minLng: -180.0,
  //   maxLng: 180.0,
  // },
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

export function SignersMap({
  signersLocation,
  activeContinent,
}: {
  signersLocation: {
    lat: number;
    lng: number;
  }[];
  activeContinent: Continent | null;
}) {
  return (
    <StyledContainer>
      <MapContainer
        center={[0, 0]}
        zoom={1}
        minZoom={1}
        maxZoom={4}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
        dragging={false}
        attributionControl={false}
        className="roberto"
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'var(--stacks-colors-slate-100)',
          borderRadius: '0.75rem',
        }}
        bounds={[
          [85, -180],
          [-85, 180],
        ]}
        maxBoundsViscosity={1.0}
        maxBounds={[
          [85, -180],
          [-85, 180],
        ]}
      >
        <TileLayer
          // url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          // url="https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png"
          url="https://api.mapbox.com/styles/v1/nbarnett26/clx1zj9jn07iw01nx9hqm4f7r/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibmJhcm5ldHQyNiIsImEiOiJjbHgxend0NjcwY2JoMnJxMWVoMzc5aXE2In0.ZYDrw3nKDZ4qK673fAxk_Q"
          noWrap={true}
          minZoom={1}
          maxZoom={4}
          bounds={[
            [85, -180],
            [-85, 180],
          ]} // Setting the bounds to prevent wrapping
        />
        {signersLocation.map((node, index) => (
          <Marker
            key={index}
            position={[node.lat, node.lng]}
            icon={activeContinent === getContinent(node.lat, node.lng) ? activeIcon : defaultIcon}
            style={{}}
          />
        ))}
        <MapUpdater activeContinent={activeContinent} />
      </MapContainer>
    </StyledContainer>
  );
}

export default SignersMap;
