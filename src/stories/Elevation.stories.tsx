import type { Meta, StoryObj } from '@storybook/react';

import { Box } from '../ui/Box';
import { Flex } from '../ui/Flex';
import { Stack } from '../ui/Stack';
import { Text } from '../ui/Text';
import { useColorMode } from '../ui/hooks/useColorMode';
import { theme } from '../ui/theme/theme';

const ElevationDemo = () => {
  const { colorMode } = useColorMode();

  return (
    <Stack gap={8}>
      <Flex direction="column" gap={8} p={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Elevation Showcase
        </Text>
        {Object.entries(theme.semanticTokens.shadows).map(([elevationName, elevationValue]) => (
          <Flex key={elevationName} align="center" gap={4}>
            <Box
              width="200px"
              height="100px"
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              boxShadow={(elevationValue as any).default}
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text>{elevationName}</Text>
            </Box>
            <Text>
              {elevationName}:{' '}
              {(elevationValue as any)[colorMode === 'light' ? 'default' : '_dark']}
            </Text>
          </Flex>
        ))}
      </Flex>
      <Flex direction="column" gap={8} bg="#211F1F" p={4}>
        {Object.entries(theme.semanticTokens.shadows).map(([elevationName, elevationValue]) => (
          <Flex key={elevationName} align="center" gap={4}>
            <Box
              width="200px"
              height="100px"
              bg={'#211F1F'}
              boxShadow={(elevationValue as any)._dark}
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text>{elevationName}</Text>
            </Box>
            <Text color="white">
              {elevationName}: {(elevationValue as any)._dark}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Stack>
  );
};

const meta = {
  title: 'Theme/Elevation',
  component: ElevationDemo,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ElevationDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllElevations: Story = {};
