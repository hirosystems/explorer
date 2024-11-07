import { Stack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import { Heading } from '../../ui/Heading';
import { Text } from '../../ui/Text';

// TODO: The fonts that are downloaded are not being used in the stroybook build
const FontFamilyDemo = () => (
  <Stack align="stretch" gap={4}>
    <Heading size="md">Font Families</Heading>

    <Text fontFamily="inter">Inter (Body): The quick brown fox jumps over the lazy dog</Text>
    <Text fontFamily="openSauce">
      Open Sauce (Heading): The quick brown fox jumps over the lazy dog
    </Text>
    <Text fontFamily="matter">Matter Regular: The quick brown fox jumps over the lazy dog</Text>
    <Text fontFamily="matterMono">
      Matter Mono Regular: The quick brown fox jumps over the lazy dog
    </Text>
    <Text fontFamily="instrument">
      Instrument Sans: The quick brown fox jumps over the lazy dog
    </Text>
  </Stack>
);

const meta = {
  title: 'Theme/Typography/Font Families',
  component: FontFamilyDemo,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FontFamilyDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FontFamilies: Story = {
  parameters: {
    docs: {
      source: {
        code: `
const FontFamilyDemo = () => (
  <Stack align="stretch" gap={4}>
    <Heading size="md">Font Families</Heading>

    <Text fontFamily='inter'>
      Inter (Body): The quick brown fox jumps over the lazy dog
    </Text>
    <Text fontFamily='openSauce'>
      Open Sauce (Heading): The quick brown fox jumps over the lazy dog
    </Text>
    <Text fontFamily='matter'>
      Matter Regular: The quick brown fox jumps over the lazy dog
    </Text>
    <Text fontFamily='matterMono'>
      Matter Mono Regular: The quick brown fox jumps over the lazy dog
    </Text>
    <Text fontFamily='instrument'>
      Instrument Sans: The quick brown fox jumps over the lazy dog
    </Text>
  </Stack>
);
        `,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
};
