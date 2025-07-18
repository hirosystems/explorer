'use client';

import { ClientOnly } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

import { Continent } from './SignersMapComponent';
import { SignersMapSkeleton } from './skeleton';

interface SignersMapProps {
  signersLocation: {
    lat: number;
    lng: number;
  }[];
  activeContinent: Continent | null;
  setActiveContinent: (continent: Continent | null) => void;
}

const SignersMapInternal = dynamic(() => import('./SignersMapClient'), {
  ssr: false,
  loading: () => <SignersMapSkeleton />,
});

export function SignersMap({
  signersLocation,
  activeContinent,
  setActiveContinent,
}: SignersMapProps) {
  return (
    <ClientOnly fallback={<SignersMapSkeleton />}>
      <SignersMapInternal
        signersLocation={signersLocation}
        activeContinent={activeContinent}
        setActiveContinent={setActiveContinent}
      />
    </ClientOnly>
  );
}

export default SignersMap;
