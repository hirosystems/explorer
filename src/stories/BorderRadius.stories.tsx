import type { Meta, StoryObj } from '@storybook/react';

import { Box } from '../ui/Box';
import { Flex } from '../ui/Flex';
import { Text } from '../ui/Text';
import { theme } from '../ui/theme/theme';

const BorderRadiusDemo = () => {
  console.log(theme.borderRadius);
  return (
    <Flex direction="column" gap={8}>
      <Text fontSize="2xl" fontWeight="bold">
        Border Radius Showcase
      </Text>
      {Object.entries(theme.borderRadius).map(([size, value]) => (
        <Flex key={size} align="center" gap={4}>
          <Box width="100px" height="100px" bg="blue.500" borderRadius={size} />
          <Text>
            {size}: {value as string}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

const meta = {
  title: 'Theme/Border Radius',
  component: BorderRadiusDemo,
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        code: `
const BorderRadiusDemo = () => (
  <Stack spacing={8}>
    <Text fontSize="2xl" fontWeight="bold">Border Radius Showcase</Text>
    
    <Flex direction="column" gap={4}>
      <Text fontSize="xl" fontWeight="semibold">xxs (2px)</Text>
      <Box 
        width="100px" 
        height="100px" 
        bg="blue.500" 
        borderRadius="xxs"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
      >
        xxs
      </Box>
    </Flex>

    <Flex direction="column" gap={4}>
      <Text fontSize="xl" fontWeight="semibold">xs (4px)</Text>
      <Box 
        width="100px" 
        height="100px" 
        bg="blue.500" 
        borderRadius="xs"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
      >
        xs
      </Box>
    </Flex>

    <Flex direction="column" gap={4}>
      <Text fontSize="xl" fontWeight="semibold">sm (6px)</Text>
      <Box 
        width="100px" 
        height="100px" 
        bg="blue.500" 
        borderRadius="sm"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
      >
        sm
      </Box>
    </Flex>

    <Flex direction="column" gap={4}>
      <Text fontSize="xl" fontWeight="semibold">md (8px)</Text>
      <Box 
        width="100px" 
        height="100px" 
        bg="blue.500" 
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
      >
        md
      </Box>
    </Flex>

    <Flex direction="column" gap={4}>
      <Text fontSize="xl" fontWeight="semibold">lg (12px)</Text>
      <Box 
        width="100px" 
        height="100px" 
        bg="blue.500" 
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
      >
        lg
      </Box>
    </Flex>

    <Flex direction="column" gap={4}>
      <Text fontSize="xl" fontWeight="semibold">xl (16px)</Text>
      <Box 
        width="100px" 
        height="100px" 
        bg="blue.500" 
        borderRadius="xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
      >
        xl
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
} satisfies Meta<typeof BorderRadiusDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllBorderRadii: Story = {};
