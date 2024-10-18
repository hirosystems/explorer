import { Box } from '@/ui/Box';
import { Flex } from '@/ui/Flex';
import { Heading } from '@/ui/Heading';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import type { Meta, StoryObj } from '@storybook/react';

import { NEW_COLORS } from '../ui/theme/new-colors';

const ColorSwatch = ({ colorName, colorValue }: { colorName: string; colorValue: string }) => (
  <Stack align="start" spacing={1}>
    <Box w="100px" h="100px" bg={colorValue} borderRadius="md" border="1px solid black" />
    <Text fontSize="sm" fontWeight="bold">
      {colorName}
    </Text>
    <Text fontSize="xs">{colorValue}</Text>
  </Stack>
);

const ColorSection = ({ title, colors }: { title: string; colors: Record<string, string> }) => (
  <Box mb={8}>
    <Heading size="md" mb={4}>
      {title}
    </Heading>
    <Flex gap={4} flexWrap="wrap">
      {Object.entries(colors).map(([name, value]) => (
        <ColorSwatch key={name} colorName={name} colorValue={value} />
      ))}
    </Flex>
  </Box>
);

const ColorPalette = () => (
  <Stack align="stretch" spacing={8}>
    {Object.entries(NEW_COLORS).map(([section, colors]) => (
      <ColorSection key={section} title={section} colors={colors} />
    ))}
  </Stack>
);

const meta = {
  title: 'Theme/Colors',
  component: ColorPalette,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllColors: Story = {};
