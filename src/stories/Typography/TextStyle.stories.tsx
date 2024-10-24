import type { Meta, StoryObj } from '@storybook/react';

import { Heading } from '../../ui/Heading';
import { Stack } from '../../ui/Stack';
import { Text } from '../../ui/Text';

const TextStyleDemo = () => (
  <Stack align="stretch" spacing={4}>
    <Heading size="md">Text Styles</Heading>

    <Text textStyle="text-regular-xs">
      text-regular-xs: The quick brown fox jumps over the lazy dog
    </Text>
    <Text textStyle="text-regular-sm">
      text-regular-sm: The quick brown fox jumps over the lazy dog
    </Text>
    <Text textStyle="text-regular-md">
      text-regular-md: The quick brown fox jumps over the lazy dog
    </Text>
    <Text textStyle="text-regular-lg">
      text-regular-lg: The quick brown fox jumps over the lazy dog
    </Text>
    <Text textStyle="text-regular-xl">
      text-regular-xl: The quick brown fox jumps over the lazy dog
    </Text>

    <Text textStyle="text-medium-xs">
      text-medium-xs: The quick brown fox jumps over the lazy dog
    </Text>
    <Text textStyle="text-medium-sm">
      text-medium-sm: The quick brown fox jumps over the lazy dog
    </Text>
    <Text textStyle="text-medium-md">
      text-medium-md: The quick brown fox jumps over the lazy dog
    </Text>
    <Text textStyle="text-medium-lg">
      text-medium-lg: The quick brown fox jumps over the lazy dog
    </Text>
    <Text textStyle="text-medium-xl">
      text-medium-xl: The quick brown fox jumps over the lazy dog
    </Text>

    <Text textStyle="text-semibold-xs">
      text-semibold-xs: The quick brown fox jumps over the lazy dog
    </Text>
    <Text textStyle="text-semibold-sm">
      text-semibold-sm: The quick brown fox jumps over the lazy dog
    </Text>
    <Text textStyle="text-semibold-md">
      text-semibold-md: The quick brown fox jumps over the lazy dog
    </Text>
    <Text textStyle="text-semibold-lg">
      text-semibold-lg: The quick brown fox jumps over the lazy dog
    </Text>
    <Text textStyle="text-semibold-xl">
      text-semibold-xl: The quick brown fox jumps over the lazy dog
    </Text>

    <Text textStyle="heading-xs">heading-xs: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="heading-sm">heading-sm: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="heading-md">heading-md: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="heading-lg">heading-lg: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="heading-xl">heading-xl: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="heading-2xl">heading-2xl: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="heading-3xl">heading-3xl: The quick brown fox jumps over the lazy dog</Text>
  </Stack>
);

const meta = {
  title: 'Theme/Typography/Text Styles',
  component: TextStyleDemo,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TextStyleDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextStyles: Story = {
  parameters: {
    docs: {
      source: {
        code: `
const TextStyleDemo = () => (
  <Stack align="stretch" spacing={4}>
    <Heading size="md">Text Styles</Heading>
    
    <Text textStyle="text-regular-xs">text-regular-xs: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="text-regular-sm">text-regular-sm: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="text-regular-md">text-regular-md: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="text-regular-lg">text-regular-lg: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="text-regular-xl">text-regular-xl: The quick brown fox jumps over the lazy dog</Text>
    
    <Text textStyle="text-medium-xs">text-medium-xs: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="text-medium-sm">text-medium-sm: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="text-medium-md">text-medium-md: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="text-medium-lg">text-medium-lg: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="text-medium-xl">text-medium-xl: The quick brown fox jumps over the lazy dog</Text>
    
    <Text textStyle="text-semibold-xs">text-semibold-xs: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="text-semibold-sm">text-semibold-sm: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="text-semibold-md">text-semibold-md: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="text-semibold-lg">text-semibold-lg: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="text-semibold-xl">text-semibold-xl: The quick brown fox jumps over the lazy dog</Text>
    
    <Text textStyle="heading-xs">heading-xs: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="heading-sm">heading-sm: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="heading-md">heading-md: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="heading-lg">heading-lg: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="heading-xl">heading-xl: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="heading-2xl">heading-2xl: The quick brown fox jumps over the lazy dog</Text>
    <Text textStyle="heading-3xl">heading-3xl: The quick brown fox jumps over the lazy dog</Text>
  </Stack>
);
        `,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
};
