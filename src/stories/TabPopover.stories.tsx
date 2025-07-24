import { PopoverRootProps } from '@ark-ui/react';
import { Box, Flex, Text } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';

import {
  TabPopoverContent,
  TabPopoverRoot,
  TabPopoverTrigger,
} from '../common/components/TabPopover';

let id = 0;

// Define the component for the story
const TabPopoverExample = ({
  placement,
  triggerContent = 'Click me',
  content = (
    <Flex p={3} alignItems="center">
      <Text whiteSpace="nowrap">Popover content</Text>
    </Flex>
  ),
  mainAxisOffset = 0,
  crossAxisOffset = 0,
  sameWidth = true,
}: {
  placement: string;
  triggerContent?: string;
  content?: React.ReactNode;
  mainAxisOffset?: number;
  crossAxisOffset?: number;
  sameWidth?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const uniqueId = useMemo(() => `tab-popover-${id++}`, []);

  const positioning = {
    placement,
    offset: { mainAxis: mainAxisOffset, crossAxis: crossAxisOffset },
    sameWidth,
  } as PopoverRootProps['positioning'];

  return (
    <TabPopoverRoot
      id={uniqueId}
      positioning={positioning}
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <TabPopoverTrigger open={open} positioning={positioning}>
        <Box
          px={3}
          py={1}
          bgColor="surfacePrimary"
          borderRadius="redesign.lg"
          borderBottomRadius={open ? 'none' : 'redesign.lg'}
          cursor="pointer"
        >
          <Text>{triggerContent}</Text>
        </Box>
      </TabPopoverTrigger>

      <TabPopoverContent positioning={positioning}>{content}</TabPopoverContent>
    </TabPopoverRoot>
  );
};

const meta = {
  title: 'Components/TabPopover',
  component: TabPopoverExample,
  parameters: {
    layout: 'centered',
    docs: {
      parameters: {
        id: 'tab-popover-example',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end'],
      description: 'Placement of the popover relative to the trigger',
    },
    mainAxisOffset: {
      control: 'number',
      defaultValue: 0,
      description: 'Offset on the main axis (vertical distance between trigger and content)',
    },
    crossAxisOffset: {
      control: 'number',
      defaultValue: 0,
      description: 'Offset on the cross axis (horizontal distance between trigger and content)',
    },
    sameWidth: {
      control: 'boolean',
      defaultValue: true,
      description: 'Whether the content should have the same width as the trigger',
    },
  },
} satisfies Meta<typeof TabPopoverExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BottomStart: Story = {
  args: {
    placement: 'bottom-start',
    mainAxisOffset: 4,
    sameWidth: true,
  },
};

export const BottomEnd: Story = {
  args: {
    placement: 'bottom-end',
    mainAxisOffset: 4,
    crossAxisOffset: -24,
    sameWidth: true,
  },
};
