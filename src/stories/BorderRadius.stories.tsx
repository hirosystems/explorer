import type { Meta, StoryObj } from '@storybook/react';

import { Box } from '../ui/Box';
import { Flex } from '../ui/Flex';
import { Text } from '../ui/Text';
import { theme } from '../ui/theme/theme';

const BorderRadiusDemo = () => {
  return (
    <Flex direction="column" gap={8}>
      <Text fontSize="2xl" fontWeight="bold">
        Border Radius Showcase
      </Text>
      {Object.entries(theme.radii).map(([size, value]) => (
        <Flex key={size} align="center" gap={4}>
          <Box width="100px" height="100px" bg="blue.500" borderRadius={size} />
          <Text>
            {size}: {value as string}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

const meta = {
  title: 'Theme/Border Radius',
  component: BorderRadiusDemo,
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        code: `
const BorderRadiusDemo = () => (
 <Flex direction="column" gap={8}>
      <Text fontSize="2xl" fontWeight="bold">
        Border Radius Showcase
      </Text>

        <Flex key='none' align="center" gap={4}>
          <Box width="100px" height="100px" bg="blue.500" borderRadius='none' />
          <Text>
            none: 0
          </Text>
        </Flex>

          <Flex key='small' align="center" gap={4}>
          <Box width="100px" height="100px" bg="blue.500" borderRadius='small' />
          <Text>
            sm: 0.125rem
          </Text>
        </Flex>

          <Flex key='base' align="center" gap={4}>
          <Box width="100px" height="100px" bg="blue.500" borderRadius='base' />
          <Text>
            base: 0.25rem
          </Text>
        </Flex>

          <Flex key='md' align="center" gap={4}>
          <Box width="100px" height="100px" bg="blue.500" borderRadius='md' />
          <Text>
            md: 0.375rem
          </Text>
        </Flex>

          <Flex key='lg' align="center" gap={4}>
          <Box width="100px" height="100px" bg="blue.500" borderRadius='lg' />
          <Text>
            lg: 0.5rem
          </Text>
        </Flex>

          <Flex key='xl' align="center" gap={4}>
          <Box width="100px" height="100px" bg="blue.500" borderRadius='xl' />
          <Text>
            xl: 0.75rem
          </Text>
        </Flex>

          <Flex key='2xl' align="center" gap={4}>
          <Box width="100px" height="100px" bg="blue.500" borderRadius='2xl' />
          <Text>
            2xl: 1rem
          </Text>
        </Flex>

          <Flex key='3xl' align="center" gap={4}>
          <Box width="100px" height="100px" bg="blue.500" borderRadius='3xl' />
          <Text>
            3xl: 1.5rem
          </Text>
        </Flex>

          <Flex key='full' align="center" gap={4}>
          <Box width="100px" height="100px" bg="blue.500" borderRadius='full' />
          <Text>
            full: 9999px
          </Text>
        </Flex>
    </Flex>
);
                `,
        language: 'tsx',
        type: 'auto',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BorderRadiusDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllBorderRadii: Story = {};
