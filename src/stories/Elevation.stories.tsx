import { Box } from '@/ui/Box';
import { Flex } from '@/ui/Flex';
import { Text } from '@/ui/Text';
import { useColorMode } from '@/ui/hooks/useColorMode';
import type { Meta, StoryObj } from '@storybook/react';

import { theme } from '../ui/theme/theme';

const ElevationDemo = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex direction="column" gap={8}>
      <Text fontSize="2xl" fontWeight="bold">
        Elevation Showcase
      </Text>
      {Object.entries(theme.semanticTokens.shadows).map(([elevationName, elevationValue]) => (
        <Flex key={elevationName} align="center" gap={4}>
          <Box
            width="200px"
            height="100px"
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            boxShadow={(elevationValue as any)[colorMode === 'light' ? 'default' : '_dark']}
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text>{elevationName}</Text>
          </Box>
          <Text>
            {elevationName}: {(elevationValue as any)[colorMode === 'light' ? 'default' : '_dark']}
          </Text>
        </Flex>
      ))}
    </Flex>
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
