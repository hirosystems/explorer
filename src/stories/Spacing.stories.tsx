import { Box, Flex, Stack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import { Text } from '../ui/Text';
import { system } from '../ui/theme/theme';

const SpacingDemo = ({ space, value }: { space: string; value: string }) => (
  <Stack align="start" gap={2}>
    <Flex gap={4} align="center">
      <Box w={value} h="24px" bg="blue.500" />
      <Text fontSize="sm" fontWeight="bold">
        {space}
      </Text>
      <Text fontSize="sm">{value}</Text>
    </Flex>
  </Stack>
);

const SpacingShowcase = () => {
  return (
    <Stack align="stretch" gap={8}>
      <Text fontSize="2xl" fontWeight="bold">
        Theme Spacing
      </Text>
      {Object.entries(system._config.theme?.tokens?.spacing ?? {}).map(([space, value]) => (
        <SpacingDemo key={space} space={space} value={value.value.toString()} />
      ))}
    </Stack>
  );
};

const meta = {
  title: 'Theme/Spacing',
  component: SpacingShowcase,
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        code: `
  // Example SpacingDemo for spacing 4. See w={4}
  <Stack align="start" gap={2}>
    <Flex gap={4} align="center">
      <Box w={4} h="24px" bg="blue.500" />
      <Text fontSize="sm" fontWeight="bold">
        4
      </Text>
      <Text fontSize="sm">1rem</Text>
    </Flex>
  </Stack>
              `,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SpacingShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSpacing: Story = {};
