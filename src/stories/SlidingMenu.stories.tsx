import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import { SlidingMenu } from '../common/components/SlidingMenu';

const meta = {
  title: 'Components/SlidingMenu',
  component: SlidingMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'number' },
    menuTrigger: { control: 'text' },
    menuContent: { control: 'text' },
  },
  decorators: [
    Story => (
      <Flex justifyContent="center" pt={5} minH="300px" w="400px" bg="gray.50">
        <Story />
      </Flex>
    ),
  ],
} satisfies Meta<typeof SlidingMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    height: 10,
    width: 200,
    menuTrigger: 'Hover me',
    menuTriggerProps: {
      display: 'flex',
      alignItems: 'center',
      px: 5,
    },
    menuContent: (
      <Stack p={4} gap={2}>
        <Box p={2} _hover={{ bg: 'gray.100' }} cursor="pointer">
          <Text>Menu Item 1</Text>
        </Box>
        <Box p={2} _hover={{ bg: 'gray.100' }} cursor="pointer">
          <Text>Menu Item 2</Text>
        </Box>
        <Box p={2} _hover={{ bg: 'gray.100' }} cursor="pointer">
          <Text>Menu Item 3</Text>
        </Box>
      </Stack>
    ),
  },
};
