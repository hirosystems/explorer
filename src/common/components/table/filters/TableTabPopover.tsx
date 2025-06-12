import {
  CURVED_CORNER_SIZE,
  TabPopoverContent,
  TabPopoverRoot,
  TabPopoverTrigger,
} from '@/common/components/TabPopover';
import { PopoverRootProps } from '@ark-ui/react';
import { Box, Flex, PopoverContentProps, PopoverTriggerProps } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';

interface TableTabPopoverProps {
  id: string;
  positioning?: PopoverRootProps['positioning'];
  trigger: (open: boolean, setOpen: (open: boolean) => void) => ReactNode;
  content: (open: boolean, setOpen: (open: boolean) => void) => ReactNode;
  triggerProps?: PopoverTriggerProps;
  contentProps?: PopoverContentProps;
}

const DEFAULT_POSITIONING: PopoverRootProps['positioning'] = {
  placement: 'bottom-start',
  offset: { mainAxis: 0, crossAxis: 0 },
  sameWidth: true,
};

export function TableTabPopover({
  id,
  positioning = DEFAULT_POSITIONING,
  trigger,
  content,
  triggerProps,
  contentProps,
}: TableTabPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <TabPopoverRoot
      id={id}
      positioning={positioning}
      open={open}
      onOpenChange={e => {
        setOpen(e.open);
      }}
      variant="redesignPrimary"
    >
      <TabPopoverTrigger open={open} positioning={positioning} {...triggerProps} onClick={() => {}}>
        <Flex
          alignItems={'center'}
          // gap={1}
          bgColor={'surfacePrimary'}
          py={1}
          px={3}
          borderRadius="redesign.lg"
          borderTopRadius="redesign.lg"
          borderBottomRadius={open ? 'none' : 'redesign.lg'}
          className="group"
          cursor="pointer"
          w="fit-content"
          role="button"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          {trigger(open, setOpen)}
        </Flex>
      </TabPopoverTrigger>
      <TabPopoverContent
        bgColor={'surfacePrimary'}
        minWidth={'fit-content'}
        marginRight={-(CURVED_CORNER_SIZE + 1)}
        positioning={positioning ?? DEFAULT_POSITIONING}
        {...contentProps}
      >
        <>
          <Box tabIndex={0} h={0} w={0} outline="none" />
          {/* This div is used to steal the focus from the content when the popover is opened */}
          {content(open, setOpen)}
        </>
      </TabPopoverContent>
    </TabPopoverRoot>
  );
}
