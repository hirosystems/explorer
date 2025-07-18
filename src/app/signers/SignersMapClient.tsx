'use client';

import { Box, useBreakpointValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvent } from 'react-leaflet';

import { useColorMode, useColorModeValue } from '../../components/ui/color-mode';
import { Continent } from './SignersMapComponent';
import { getContinent } from './continentUtils';

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

const activeMarkerSvgDark = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <circle cx="10" cy="10" r="10" fill="#7F97F1" opacity="0.3"/>
  <circle cx="10" cy="10" r="4" fill="#7F97F1"/>
</svg>
`;

const activeMarkerSvgLight = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <circle cx="10" cy="10" r="10" fill="#5546FF" opacity="0.3"/>
  <circle cx="10" cy="10" r="4" fill="#5546FF"/>
</svg>
`;

const defaultMarkerSvgLight = `
<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
  <circle cx="4" cy="4" r="4" fill="#7F97F1"/>
</svg>
`;

const defaultMarkerSvgDark = `
<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
  <circle cx="4" cy="4" r="4" fill="#4446FF"/>
</svg>
`;

const defaultMarkerIconLight = new L.DivIcon({
  html: defaultMarkerSvgLight,
  className: 'custom-div-icon',
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

const defaultMarkerIconDark = new L.DivIcon({
  html: defaultMarkerSvgDark,
  className: 'custom-div-icon',
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

const activeMarkerIconLight = new L.DivIcon({
  html: activeMarkerSvgLight,
  className: 'custom-div-icon',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});
const activeMarkerIconDark = new L.DivIcon({
  html: activeMarkerSvgDark,
  className: 'custom-div-icon',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface CenterAndZoom {
  center: [number, number];
  zoom: number;
}

const StyledContainer = styled(Box)`
  height: 100%;
  width: 100%;

  .custom-div-icon {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
  }
`;

const ContinentZoomHandler = ({
  activeContinent,
  setActiveMarkerLatLng,
}: {
  activeContinent: Continent | null;
  setActiveMarkerLatLng: (marketLatLng: MarkerLatLng | undefined) => void;
}) => {
  const map = useMap();
  const prevActiveContinent = useRef<Continent | null>(activeContinent);

  const northAmericaCenterAndZoom = useBreakpointValue({
    base: { center: [50, -100], zoom: 2 },
    md: { center: [37, -100], zoom: 3 },
    xl: { center: [33, -95], zoom: 3 },
  }) as CenterAndZoom;
  const africaCenterAndZoom = useBreakpointValue({
    // TODO: tune coordinates
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
    // TODO: tune coordinates
    base: { center: [-25, 133], zoom: 4 },
    md: { center: [-25, 133], zoom: 4 },
    xl: { center: [-25, 133], zoom: 4 },
  }) as CenterAndZoom;
  const southAmericaCenterAndZoom = useBreakpointValue({
    // TODO: tune coordinates
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
          return { center: INITIAL_VIEW.center, zoom: INITIAL_VIEW.zoom } as CenterAndZoom;
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
    if (prevActiveContinent.current === activeContinent) return;
    prevActiveContinent.current = activeContinent;
    const centerAndZoom = getContinetCenterAndZoom(activeContinent);
    const { center, zoom } = centerAndZoom;
    map.setView(center, zoom);
    if (activeContinent === null) {
      setActiveMarkerLatLng(undefined);
    }
  }, [map, activeContinent, getContinetCenterAndZoom, setActiveMarkerLatLng]);

  return null;
};

interface MarkerLatLng {
  lat: number;
  lng: number;
}

const MarkerClickHandler = ({ markerLatLng }: { markerLatLng: MarkerLatLng | undefined }) => {
  const map = useMap();

  const prevMarkerLatLng = useRef<MarkerLatLng | undefined>(markerLatLng);

  useEffect(() => {
    prevMarkerLatLng.current = markerLatLng;
  }, [markerLatLng]);

  // A new marker is clicked if the previous marker is undefined and the current marker is defined, or if the lat/lng of the current marker is different from the previous marker
  const newMarkerClicked =
    (prevMarkerLatLng.current === undefined && markerLatLng !== undefined) ||
    (prevMarkerLatLng.current &&
      markerLatLng &&
      prevMarkerLatLng.current.lat !== markerLatLng.lat) ||
    (prevMarkerLatLng.current && markerLatLng && prevMarkerLatLng.current.lng !== markerLatLng.lng);

  useEffect(() => {
    if (!newMarkerClicked) return;
    const { lat, lng } = markerLatLng;
    map.setView([lat, lng], 4);
  }, [markerLatLng, map, newMarkerClicked]);

  return null;
};

const MapClickHandler = ({
  setActiveMarkerLatLng,
  setActiveContinent,
}: {
  setActiveMarkerLatLng: (marketLatLng: MarkerLatLng | undefined) => void;
  setActiveContinent: (continent: Continent | null) => void;
}) => {
  const map = useMap();

  useMapEvent('click', event => {
    const target = event?.originalEvent?.target as HTMLElement;
    if (!target.closest('.leaflet-marker-icon')) {
      map.setView(INITIAL_VIEW.center, INITIAL_VIEW.zoom);
      setActiveMarkerLatLng(undefined);
      setActiveContinent(null);
    }
  });

  return null;
};

export function SignersMapInternal({
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
  const { colorMode } = useColorMode();
  const [mapKey, setMapKey] = useState(0);
  useEffect(() => {
    setMapKey(prevKey => prevKey + 1);
  }, [colorMode]);

  const handleMarkerClick = useCallback(
    (lat: number, lng: number) => {
      setActiveMarkerLatLng({ lat, lng });
    },
    [setActiveMarkerLatLng]
  );

  const mapUrl = useColorModeValue(
    'https://api.mapbox.com/styles/v1/hirodevops/clxdkx7fd005q01qm005n87ce/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaGlyb2Rldm9wcyIsImEiOiJjbHhka3pjcnEwNzN5MnBwb2V5OThmZnI1In0.heTDCQlm2ukAytME9J0CRA',
    'https://api.mapbox.com/styles/v1/hirodevops/clxdkyqza004k01qk4ogagsvj/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaGlyb2Rldm9wcyIsImEiOiJjbHhka3pjcnEwNzN5MnBwb2V5OThmZnI1In0.heTDCQlm2ukAytME9J0CRA'
  );
  const mapContainerBackgroundColor = useColorModeValue(
    'var(--stacks-colors-slate-100)',
    'var(--stacks-colors-slate-900)'
  );
  const activeIcon = useColorModeValue(activeMarkerIconLight, activeMarkerIconDark);
  const defaultIcon = useColorModeValue(defaultMarkerIconLight, defaultMarkerIconDark);

  return (
    <StyledContainer>
      <MapContainer
        key={mapKey}
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
          zIndex: 0,
        }}
        bounds={BOUNDS}
        maxBoundsViscosity={1.0}
        maxBounds={BOUNDS}
      >
        <TileLayer url={mapUrl} noWrap={true} minZoom={1} maxZoom={4} bounds={BOUNDS} />
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
        <ContinentZoomHandler
          activeContinent={activeContinent}
          setActiveMarkerLatLng={setActiveMarkerLatLng}
        />
        <MarkerClickHandler markerLatLng={activeMarkerLatLng} />
        <MapClickHandler
          setActiveMarkerLatLng={setActiveMarkerLatLng}
          setActiveContinent={setActiveContinent}
        />
      </MapContainer>
    </StyledContainer>
  );
}

// Default export for dynamic import
export default SignersMapInternal;
