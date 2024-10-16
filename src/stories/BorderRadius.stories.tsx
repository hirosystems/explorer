import type { Meta, StoryObj } from '@storybook/react';

import { Box } from '../ui/Box';
import { Flex } from '../ui/Flex';
import { Text } from '../ui/Text';
import { theme } from '../ui/theme/theme';

const BorderRadiusDemo = () => (
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

const meta = {
  title: 'Theme/Border Radius',
  component: BorderRadiusDemo,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BorderRadiusDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllBorderRadii: Story = {};
