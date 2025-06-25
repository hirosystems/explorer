import {
  CURVED_CORNER_SIZE,
  TabPopoverContent,
  TabPopoverRoot,
  TabPopoverTrigger,
} from '@/common/components/TabPopover';
import { PopoverRootProps } from '@ark-ui/react';
import { Box, FlexProps, PopoverContentProps, PopoverTriggerProps } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';

interface FilterTabPopoverProps {
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

export const getFilterTabPopoverContainerProps = (open: boolean): FlexProps => ({
  px: 3,
  py: 1,
  bgColor: 'surfacePrimary',
  borderRadius: 'redesign.lg',
  borderTopRadius: 'redesign.lg',
  borderBottomRadius: open ? 'none' : 'redesign.lg',
  w: 'fit-content',
});

export function FilterTabPopover({
  id,
  positioning = DEFAULT_POSITIONING,
  trigger,
  content,
  triggerProps,
  contentProps,
}: FilterTabPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <TabPopoverRoot
      id={id}
      positioning={positioning}
      open={open}
      variant="redesignPrimary"
      onOpenChange={e => {
        setOpen(e.open);
      }}
    >
      <TabPopoverTrigger open={open} positioning={positioning} {...triggerProps}>
        {trigger(open, setOpen)}
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
