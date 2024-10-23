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
              <Text color="black">{elevationName}</Text>
            </Box>
            <Text>{(elevationValue as any)[colorMode === 'light' ? 'default' : '_dark']}</Text>
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
              <Text color="white">{elevationName}</Text>
            </Box>
            <Text color="white">{(elevationValue as any)._dark}</Text>
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
    docs: {
      source: {
        code: `
          //Showing ElevationDemo for light mode. For dark mode, use _dark instead of default.
   const ElevationDemo = () => (
  <Stack spacing={8}>
    <Text fontSize="2xl" fontWeight="bold">Elevation Showcase</Text>
    
    <Flex direction="column" gap={4}>
      <Text fontSize="xl" fontWeight="semibold">elevation1</Text>
      <Box 
        boxShadow="elevation1" 
        p={4} 
        borderRadius="md" 
        bg="surface"
        width="200px"
        height="100px"
      >
        <Text color='white'>elevation1</Text>
        <Text fontSize="sm" color="textSubdued">
            0 2px 6px rgba(183, 180, 176, 0.2)
        </Text>
      </Box>
    </Flex>

    <Flex direction="column" gap={4}>
      <Text fontSize="xl" fontWeight="semibold">elevation2</Text>
      <Box 
        boxShadow="elevation2" 
        p={4} 
        borderRadius="md" 
        bg="surface"
        width="200px"
        height="100px"
      >
        <Text color='white'>elevation2</Text>
        <Text fontSize="sm" color="textSubdued">
            0 2px 6px rgba(183, 180, 176, 0.2)
        </Text>
      </Box>
    </Flex>

    <Flex direction="column" gap={4}>
      <Text fontSize="xl" fontWeight="semibold">elevation3</Text>
      <Box 
        boxShadow="elevation3" 
        p={4} 
        borderRadius="md" 
        bg="surface"
        width="200px"
        height="100px"
      >
        <Text color='white'>elevation3</Text>
        <Text fontSize="sm" color="textSubdued">
            0 2px 6px rgba(183, 180, 176, 0.2)
        </Text>
      </Box>
    </Flex>
  </Stack>
);
              `,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ElevationDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllElevations: Story = {};
