import type { Meta, StoryObj } from '@storybook/react';

import { Heading } from '../../ui/Heading';
import { Stack } from '../../ui/Stack';
import { Text } from '../../ui/Text';

const FontWeightDemo = () => (
  <Stack align="stretch" spacing={4}>
    <Heading size="md">Font Weights</Heading>

    <Text fontWeight="thin">Thin (100): The quick brown fox jumps over the lazy dog</Text>
    <Text fontWeight="extralight">
      Extra Light (200): The quick brown fox jumps over the lazy dog
    </Text>
    <Text fontWeight="light">Light (300): The quick brown fox jumps over the lazy dog</Text>
    <Text fontWeight="regular">Regular (400): The quick brown fox jumps over the lazy dog</Text>
    <Text fontWeight="medium">Medium (500): The quick brown fox jumps over the lazy dog</Text>
    <Text fontWeight="semibold">Semibold (600): The quick brown fox jumps over the lazy dog</Text>
    <Text fontWeight="bold">Bold (700): The quick brown fox jumps over the lazy dog</Text>
    <Text fontWeight="extrabold">
      Extra Bold (800): The quick brown fox jumps over the lazy dog
    </Text>
    <Text fontWeight="black">Black (900): The quick brown fox jumps over the lazy dog</Text>
  </Stack>
);

const meta = {
  title: 'Theme/Typography/Font Weights',
  component: FontWeightDemo,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FontWeightDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FontWeights: Story = {
  parameters: {
    docs: {
      source: {
        code: `
const FontWeightDemo = () => (
  <Stack align="stretch" spacing={4}>
    <Heading size="md">Font Weights</Heading>
    
    <Text fontWeight="thin">Thin (100): The quick brown fox jumps over the lazy dog</Text>
    <Text fontWeight="extralight">Extra Light (200): The quick brown fox jumps over the lazy dog</Text>
    <Text fontWeight="light">Light (300): The quick brown fox jumps over the lazy dog</Text>
    <Text fontWeight="regular">Regular (400): The quick brown fox jumps over the lazy dog</Text>
    <Text fontWeight="medium">Medium (500): The quick brown fox jumps over the lazy dog</Text>
    <Text fontWeight="semibold">Semibold (600): The quick brown fox jumps over the lazy dog</Text>
    <Text fontWeight="bold">Bold (700): The quick brown fox jumps over the lazy dog</Text>
    <Text fontWeight="extrabold">Extra Bold (800): The quick brown fox jumps over the lazy dog</Text>
    <Text fontWeight="black">Black (900): The quick brown fox jumps over the lazy dog</Text>
  </Stack>
);
        `,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
};
