import type { Meta, StoryObj } from '@storybook/react';

import { Box } from '../ui/Box';
import { Stack } from '../ui/Stack';
import { Text } from '../ui/Text';

const BreakpointDemo = () => (
  <Stack spacing={4} align="stretch">
    <Box bg="blue.500" p={4}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        Base (All screens)
      </Text>
    </Box>
    <Box bg="green.500" p={4} display={{ base: 'none', 'mobile-xs': 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        mobile-xs and up (≥320px)
      </Text>
    </Box>
    <Box bg="teal.500" p={4} display={{ base: 'none', 'mobile-sm': 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        mobile-sm and up (≥375px)
      </Text>
    </Box>
    <Box bg="cyan.500" p={4} display={{ base: 'none', 'mobile-md': 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        mobile-md and up (≥480px)
      </Text>
    </Box>
    <Box bg="yellow.500" p={4} display={{ base: 'none', 'mobile-lg': 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        mobile-lg and up (≥768px)
      </Text>
    </Box>
    <Box bg="orange.500" p={4} display={{ base: 'none', xs: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        xs and up (≥1024px)
      </Text>
    </Box>
    <Box bg="red.500" p={4} display={{ base: 'none', sm: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        sm and up (≥1280px)
      </Text>
    </Box>
    <Box bg="pink.500" p={4} display={{ base: 'none', md: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        md and up (≥1440px)
      </Text>
    </Box>
    <Box bg="purple.500" p={4} display={{ base: 'none', lg: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        lg and up (≥1680px)
      </Text>
    </Box>
    <Box bg="purple.700" p={4} display={{ base: 'none', xl: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        xl and up (≥1920px)
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
 <Stack spacing={4} align="stretch">
    <Box bg="blue.500" p={4}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        Base (All screens)
      </Text>
    </Box>
    <Box bg="green.500" p={4} display={{ base: 'none', 'mobile-xs': 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        mobile-xs and up (≥320px)
      </Text>
    </Box>
    <Box bg="teal.500" p={4} display={{ base: 'none', 'mobile-sm': 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        mobile-sm and up (≥375px)
      </Text>
    </Box>
    <Box bg="cyan.500" p={4} display={{ base: 'none', 'mobile-md': 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        mobile-md and up (≥480px)
      </Text>
    </Box>
    <Box bg="yellow.500" p={4} display={{ base: 'none', 'mobile-lg': 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        mobile-lg and up (≥768px)
      </Text>
    </Box>
    <Box bg="orange.500" p={4} display={{ base: 'none', xs: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        xs and up (≥1024px)
      </Text>
    </Box>
    <Box bg="red.500" p={4} display={{ base: 'none', sm: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        sm and up (≥1280px)
      </Text>
    </Box>
    <Box bg="pink.500" p={4} display={{ base: 'none', md: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        md and up (≥1440px)
      </Text>
    </Box>
    <Box bg="purple.500" p={4} display={{ base: 'none', lg: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        lg and up (≥1680px)
      </Text>
    </Box>
    <Box bg="purple.700" p={4} display={{ base: 'none', xl: 'block' }}>
      <Text color="white" fontSize="xl" fontWeight="bold">
        xl and up (≥1920px)
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
