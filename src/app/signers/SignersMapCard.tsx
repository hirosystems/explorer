import { Box } from '@/ui/Box';
import { Button } from '@/ui/Button';
import { Flex } from '@/ui/Flex';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { useState } from 'react';

import SignersMap from './SignersMap';

export enum Continent {
  NorthAmerica = 'North America',
  SouthAmerica = 'South America',
  Europe = 'Europe',
  Africa = 'Africa',
  Asia = 'Asia',
  Australia = 'Australia',
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
          >{`${numNodes} nodes (${percentageNodes}%)`}</Text>
        </Flex>
      </Flex>
    </Button>
  );
}

export function SignersMapCard() {
  const [activeContinent, setActiveContinent] = useState<Continent | null>(null);
  return (
    <Box height="100%" width="100%">
      <Stack height="100%" width="100%" gap={6}>
        <Box height="80%">
          <SignersMap activeContinent={activeContinent} />
        </Box>
        <Flex flexWrap="wrap" gap={3}>
          {Object.values(Continent).map(continent => (
            <ContinentPill
              key={continent}
              name={continent}
              numNodes={0}
              percentageNodes={0}
              onClick={() => setActiveContinent(continent)}
              activeContinent={activeContinent}
            />
          ))}{' '}
        </Flex>
      </Stack>
    </Box>
  );
}
