import { Box, Stack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import { Text } from '../ui/Text';

// TODO: This story will not work until the new breakpoints are turned on in theme.ts
const BreakpointDemo = () => (
  <Stack gap={4} align="stretch">
    <Box bg="blue.500" p={4}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        Base (All screens)
      </Text>
    </Box>
    <Box bg="red.500" p={4} display={{ base: 'none', sm: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        sm and up (≥480px)
      </Text>
    </Box>
    <Box bg="pink.500" p={4} display={{ base: 'none', md: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        md and up (≥768px)
      </Text>
    </Box>
    <Box bg="purple.500" p={4} display={{ base: 'none', lg: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        lg and up (≥1024px)
      </Text>
    </Box>
    <Box bg="purple.700" p={4} display={{ base: 'none', xl: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        xl and up (≥1280px)
      </Text>
    </Box>
    <Box bg="purple.700" p={4} display={{ base: 'none', '2xl': 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        2xl and up (≥1536px)
      </Text>
    </Box>
  </Stack>
);

const meta = {
  title: 'Theme/Breakpoints',
  component: BreakpointDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        code: `
 <Stack gap={4} align="stretch">
    <Box bg="blue.500" p={4}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        Base (All screens)
      </Text>
    </Box>
    <Box bg="red.500" p={4} display={{ base: 'none', sm: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        sm and up (≥480px)
      </Text>
    </Box>
    <Box bg="pink.500" p={4} display={{ base: 'none', md: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        md and up (≥768px)
      </Text>
    </Box>
    <Box bg="purple.500" p={4} display={{ base: 'none', lg: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        lg and up (≥1024px)
      </Text>
    </Box>
    <Box bg="purple.700" p={4} display={{ base: 'none', xl: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        xl and up (≥1280px)
      </Text>
    </Box>
    <Box bg="purple.700" p={4} display={{ base: 'none', '2xl': 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        2xl and up (≥1536px)
      </Text>
    </Box>
  </Stack>
            `,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreakpointDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
