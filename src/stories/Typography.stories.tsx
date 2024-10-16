import type { Meta, StoryObj } from '@storybook/react';

import { Heading } from '../ui/Heading';
import { Stack } from '../ui/Stack';
import { Text } from '../ui/Text';
import { theme } from '../ui/theme/theme';

const FontSizeDemo = () => (
  <Stack align="stretch" spacing={4}>
    <Heading size="md">Font Sizes</Heading>
    {Object.entries(theme.fontSizes).map(([size, value]) => (
      <Text key={size} fontSize={size}>
        {size}: {value as string} - The quick brown fox jumps over the lazy dog
      </Text>
    ))}
  </Stack>
);

const FontWeightDemo = () => (
  <Stack align="stretch" spacing={4}>
    <Heading size="md">Font Weights</Heading>
    {Object.entries(theme.fontWeights).map(([weight, value]) => (
      <Text key={weight} fontWeight={weight}>
        {weight} ({value as string}): The quick brown fox jumps over the lazy dog
      </Text>
    ))}
  </Stack>
);

const TextStyleDemo = () => (
  <Stack align="stretch" spacing={4}>
    <Heading size="md">Text Styles</Heading>
    {Object.entries(theme.textStyles).map(([styleName, style]) => (
      <Text key={styleName} sx={style as any}>
        {styleName}: The quick brown fox jumps over the lazy dog
      </Text>
    ))}
  </Stack>
);

const FontFamilyDemo = () => (
  <Stack align="stretch" spacing={4}>
    <Heading size="md">Font Families</Heading>
    <Text fontFamily="inter">
      Inter (Body): Stacks Explorer
    </Text>
    <Text fontFamily="openSauce">
      Open Sauce (Heading): Stacks Explorer
    </Text>
    <Text fontFamily="matter">
      Matter Regular: Stacks Explorer
    </Text>
    <Text fontFamily="matterMono">
      Matter Mono Regular: Stacks Explorer
    </Text>
    <Text fontFamily="instrument">
      Instrument Sans: Stacks Explorer
    </Text>
  </Stack>
);

const TypographyShowcase = () => (
  <Stack align="stretch" spacing={12}>
    <FontFamilyDemo />
    <FontSizeDemo />
    <FontWeightDemo />
    <TextStyleDemo />
  </Stack>
);

const meta = {
  title: 'Theme/Typography',
  component: TypographyShowcase,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TypographyShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllTypography: Story = {};
