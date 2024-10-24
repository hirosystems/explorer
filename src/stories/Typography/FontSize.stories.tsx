import type { Meta, StoryObj } from '@storybook/react';

import { Heading } from '../../ui/Heading';
import { Stack } from '../../ui/Stack';
import { Text } from '../../ui/Text';

const FontSizeDemo = () => (
  <Stack align="stretch" spacing={4}>
    <Heading size="md">Font Sizes</Heading>
    <Text fontSize="2xs">2xs (0.625rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="xs">xs (0.75rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="sm">sm (0.875rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="md">md (1rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="lg">lg (1.125rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="xl">xl (1.25rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="2xl">2xl (1.5rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="3xl">3xl (1.875rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="3.5xl">3.5xl (2rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="4xl">4xl (2.25rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="4.5xl">4.5xl (2.5rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="5xl">5xl (3rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="6xl">6xl (4rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="6.5xl">6.5xl (4.5rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="7xl">7xl (5rem): The quick brown fox jumps over the lazy dog</Text>
  </Stack>
);

const meta = {
  title: 'Theme/Typography/Font Sizes',
  component: FontSizeDemo,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FontSizeDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FontSizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `
const FontSizeDemo = () => (
  <Stack align="stretch" spacing={4}>
    <Heading size="md">Font Sizes</Heading>
    <Text fontSize="2xs">2xs (0.625rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="xs">xs (0.75rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="sm">sm (0.875rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="md">md (1rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="lg">lg (1.125rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="xl">xl (1.25rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="2xl">2xl (1.5rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="3xl">3xl (1.875rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="3.5xl">3.5xl (2rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="4xl">4xl (2.25rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="4.5xl">4.5xl (2.5rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="5xl">5xl (3rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="6xl">6xl (4rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="6.5xl">6.5xl (4.5rem): The quick brown fox jumps over the lazy dog</Text>
    <Text fontSize="7xl">7xl (5rem): The quick brown fox jumps over the lazy dog</Text>
  </Stack>
);
        `,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
};
