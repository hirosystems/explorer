import { Card } from '@/common/components/Card';
import { Box } from '@/ui/Box';
import { Button } from '@/ui/Button';
import { Flex } from '@/ui/Flex';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { useState } from 'react';

import SignersMap, { getContinent } from './SignersMap';
import { useSignersLocation } from './useSignerLocations';

export enum Continent {
  NorthAmerica = 'North America',
  SouthAmerica = 'South America',
  Europe = 'Europe',
  Africa = 'Africa',
  Asia = 'Asia',
  Australia = 'Australia',
  //   Antarctica = 'Antarctica',
}

export function ContinentPill({
  name,
  numNodes,
  percentageNodes,
  onClick,
  activeContinent = null,
}: {
  name: string;
  numNodes: number;
  percentageNodes: number;
  onClick: () => void;
  activeContinent?: Continent | null;
}) {
  const isActive = activeContinent === name;
  return (
    <Button
      borderRadius="full"
      border={`1px solid ${
        isActive ? 'var(--stacks-colors-purple-300)' : 'var(--stacks-colors-borderSecondary)'
      }`}
      backgroundColor={isActive ? 'purple.100' : 'surface'}
      onClick={onClick}
    >
      <Flex gap={2} alignItems="center">
        <Box
          backgroundColor={isActive ? 'purple.600' : 'slate.400'}
          height={2}
          width={2}
          borderRadius="50%"
        />
        <Flex alignItems="center">
          <Text color={isActive ? 'purple.600' : 'textSubdued'} fontWeight="medium">
            {name}
          </Text>
          &nbsp;
          <Text
            color={isActive ? 'purple.600' : 'textSubdued'}
            fontWeight="normal"
          >{`${numNodes} nodes (${percentageNodes.toFixed(2)}%)`}</Text>
        </Flex>
      </Flex>
    </Button>
  );
}

export function SignersMapCard() {
  const [activeContinent, setActiveContinent] = useState<Continent | null>(null);
  const { data: signersLocations } = useSignersLocation();
  const signersLocationData = signersLocations.map(({ ll }) => ({ lat: ll[0], lng: ll[1] }));
  const continentSignersCount: Record<Continent, number> = {
    [Continent.NorthAmerica]: 0,
    [Continent.SouthAmerica]: 0,
    [Continent.Europe]: 0,
    [Continent.Africa]: 0,
    [Continent.Asia]: 0,
    [Continent.Australia]: 0,
  };
  signersLocationData.forEach(({ lat, lng }) => {
    const continent = getContinent(lat, lng);
    if (!continent) return;
    continentSignersCount[continent] += 1;
  });
  return (
    <Card height="100%" width="100%" p={6}>
      <Stack height="100%" width="100%" gap={6}>
        <Box flex="1" minHeight={0} width="100%" borderRadius="xl">
          <SignersMap signersLocation={signersLocationData} activeContinent={activeContinent} />
        </Box>
        <Flex flexWrap="wrap" gap={3}>
          {Object.values(Continent).map(
            continent =>
              continentSignersCount[continent] > 0 && (
                <ContinentPill
                  key={continent}
                  name={continent}
                  numNodes={continentSignersCount[continent]}
                  percentageNodes={
                    (continentSignersCount[continent] / signersLocationData.length) * 100
                  }
                  onClick={() =>
                    setActiveContinent(activeContinent === continent ? null : continent)
                  }
                  activeContinent={activeContinent}
                />
              )
          )}
        </Flex>
      </Stack>
    </Card>
  );
}
