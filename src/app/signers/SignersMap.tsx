import { useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvent } from 'react-leaflet';

import { Box } from '../../ui/Box';
import { Continent } from './SignersMapComponent';

const INITIAL_VIEW = {
  center: [20, 0],
  zoom: 1,
} as {
  center: LatLngTuple;
  zoom: number;
};

const BOUNDS = [
  [85, -180],
  [-85, 180],
] as LatLngTuple[];

const defaultIconLight = new L.Icon({
  iconUrl: '/default-marker-icon-light.svg',
});

const activeIconLight = new L.Icon({
  iconUrl: '/active-marker-icon-light.svg',
});
const defaultIconDark = new L.Icon({
  iconUrl: '/default-marker-icon-dark.svg',
});

const activeIconDark = new L.Icon({
  iconUrl: '/active-marker-icon-dark.svg',
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
    base: { center: [50, -100], zoom: 2 },
    md: { center: [37, -100], zoom: 3 },
    xl: { center: [33, -95], zoom: 3 },
  }) as CenterAndZoom;
  const africaCenterAndZoom = useBreakpointValue({
    // TODO: tune
    base: { center: [9, 18], zoom: 3 },
    md: { center: [9, 18], zoom: 3 },
    xl: { center: [9, 18], zoom: 3 },
  }) as CenterAndZoom;
  const europeCenterAndZoom = useBreakpointValue({
    base: { center: [53, 10], zoom: 3 },
    md: { center: [48, 0], zoom: 4 },
    xl: { center: [46, 12], zoom: 4 },
  }) as CenterAndZoom;
  const australiaCenterAndZoom = useBreakpointValue({
    // TODO: tune
    base: { center: [-25, 133], zoom: 4 },
    md: { center: [-25, 133], zoom: 4 },
    xl: { center: [-25, 133], zoom: 4 },
  }) as CenterAndZoom;
  const southAmericaCenterAndZoom = useBreakpointValue({
    // TODO: tune
    base: { center: [-20, -61], zoom: 3 },
    md: { center: [-20, -61], zoom: 3 },
    xl: { center: [-20, -61], zoom: 3 },
  }) as CenterAndZoom;
  const asiaCenterAndZoom = useBreakpointValue({
    base: { center: [35, 100], zoom: 2 },
    md: { center: [20, 150], zoom: 3 },
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

interface MarkerLatLng {
  lat: number;
  lng: number;
}

const MarkerClickHandler = ({
  markerLatLng,
  markerClicked,
}: {
  markerLatLng: MarkerLatLng | undefined;
  markerClicked: MutableRefObject<boolean>;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!markerLatLng) return;
    const { lat, lng } = markerLatLng;
    markerClicked.current = true;
    map.setView([lat, lng], 4);
  }, [markerLatLng, map, markerClicked]);

  return null;
};

const MapClickHandler = ({ newMarkerClicked }: { newMarkerClicked: MutableRefObject<boolean> }) => {
  const map = useMap();

  useMapEvent('click', event => {
    const target = event?.originalEvent?.target as HTMLElement;
    if (!target.closest('.leaflet-marker-icon') && !newMarkerClicked.current) {
      map.setView(INITIAL_VIEW.center, INITIAL_VIEW.zoom);
    }
    newMarkerClicked.current === false;
  });

  return null;
};

const ResetActiveMarkerHandler = ({
  setActiveMarkerLatLng,
  setActiveContinent,
}: {
  setActiveMarkerLatLng: (marketLatLng: MarkerLatLng | undefined) => void;
  setActiveContinent: (continent: Continent | null) => void;
}) => {
  const map = useMap();
  const zoom = map.getZoom();
  const prevZoomRef = useRef(map.getZoom());

  useEffect(() => {
    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      if (prevZoomRef.current !== currentZoom && currentZoom === 1) {
        setActiveMarkerLatLng(undefined);
        setActiveContinent(null);
      }
      prevZoomRef.current = currentZoom;
    };

    map.on('zoomend', handleZoomEnd);
    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [zoom, setActiveMarkerLatLng, setActiveContinent, map]);

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
  setActiveContinent,
}: {
  signersLocation: {
    lat: number;
    lng: number;
  }[];
  activeContinent: Continent | null;
  setActiveContinent: (continent: Continent | null) => void;
}) {
  const [activeMarkerLatLng, setActiveMarkerLatLng] = useState<MarkerLatLng | undefined>(undefined);
  const markerClicked = useRef(false);
  const prevMarkerLatLng = useRef(activeMarkerLatLng);
  const newMarkerClicked = useRef(false);

  useEffect(() => {
    if (prevMarkerLatLng.current && activeMarkerLatLng) {
      const { lat: prevLat, lng: prevLng } = prevMarkerLatLng.current;
      const { lat: currLat, lng: currLng } = activeMarkerLatLng;
      if (prevLat !== currLat || prevLng !== currLng) {
        newMarkerClicked.current = true;
      }
    }
    prevMarkerLatLng.current = activeMarkerLatLng;
  }, [activeMarkerLatLng]);

  const handleMarkerClick = useCallback(
    (lat: number, lng: number) => {
      setActiveMarkerLatLng({ lat, lng });
    },
    [setActiveMarkerLatLng]
  );

  const mapUrl = useColorModeValue(
    'https://api.mapbox.com/styles/v1/nbarnett26/clx1zj9jn07iw01nx9hqm4f7r/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibmJhcm5ldHQyNiIsImEiOiJjbHgxend0NjcwY2JoMnJxMWVoMzc5aXE2In0.ZYDrw3nKDZ4qK673fAxk_Q',
    'https://api.mapbox.com/styles/v1/nbarnett26/clx2d7zbu02ex01qmd80k5nmi/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibmJhcm5ldHQyNiIsImEiOiJjbHgxend0NjcwY2JoMnJxMWVoMzc5aXE2In0.ZYDrw3nKDZ4qK673fAxk_Q'
  );
  const mapContainerBackgroundColor = useColorModeValue(
    'var(--stacks-colors-slate-100)',
    'var(--stacks-colors-slate-900)'
  );
  const activeIcon = useColorModeValue(activeIconLight, activeIconDark);
  const defaultIcon = useColorModeValue(defaultIconLight, defaultIconDark);

  return (
    <StyledContainer>
      <MapContainer
        center={INITIAL_VIEW.center}
        zoom={INITIAL_VIEW.zoom}
        minZoom={1}
        maxZoom={4}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
        dragging={false}
        attributionControl={false}
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: mapContainerBackgroundColor,
          borderRadius: '0.75rem',
        }}
        bounds={BOUNDS}
        maxBoundsViscosity={1.0}
        maxBounds={BOUNDS}
      >
        <TileLayer
          // url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          // url="https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png"
          url={mapUrl}
          noWrap={true}
          minZoom={1}
          maxZoom={4}
          bounds={BOUNDS}
        />
        {signersLocation.map((node, index) => (
          <Marker
            key={index}
            position={[node.lat, node.lng]}
            icon={
              activeContinent === getContinent(node.lat, node.lng) ||
              (activeMarkerLatLng?.lat === node.lat && activeMarkerLatLng.lng === node.lng)
                ? activeIcon
                : defaultIcon
            }
            eventHandlers={{
              click: () => handleMarkerClick(node.lat, node.lng),
            }}
          />
        ))}
        <MapUpdater activeContinent={activeContinent} />
        <MarkerClickHandler markerLatLng={activeMarkerLatLng} markerClicked={markerClicked} />
        <MapClickHandler newMarkerClicked={newMarkerClicked} />
        <ResetActiveMarkerHandler
          setActiveMarkerLatLng={setActiveMarkerLatLng}
          setActiveContinent={setActiveContinent}
        />
      </MapContainer>
    </StyledContainer>
  );
}

export default SignersMap;
