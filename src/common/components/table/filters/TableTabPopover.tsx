import {
  PositioningOptions,
  TabPopoverContent,
  TabPopoverRoot,
  TabPopoverTrigger,
} from '@/common/components/TabPopover';
import { Box, Flex, Icon, PopoverContentProps, PopoverTriggerProps } from '@chakra-ui/react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { ReactNode, useState } from 'react';

interface TableTabPopoverProps {
  id: string;
  positioning?: PositioningOptions;
  trigger: (open: boolean, setOpen: (open: boolean) => void) => ReactNode;
  content: (open: boolean, setOpen: (open: boolean) => void) => ReactNode;
  triggerProps?: PopoverTriggerProps;
  contentProps?: PopoverContentProps;
}

const DEFAULT_POSITIONING: PositioningOptions = {
  placement: 'bottom-start',
  offset: { mainAxis: 0, crossAxis: 0 },
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
      <TabPopoverTrigger open={open} positioning={positioning} {...triggerProps}>
        <Flex
          alignItems={'center'}
          gap={1}
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

          <Icon
            color={open ? 'iconPrimary' : 'iconSecondary'}
            _groupHover={{ color: 'iconPrimary' }}
            h={3}
            w={3}
          >
            {open ? <CaretUp /> : <CaretDown />}
          </Icon>
        </Flex>
      </TabPopoverTrigger>
      <TabPopoverContent
        bgColor={'surfacePrimary'}
        positioning={positioning ?? DEFAULT_POSITIONING}
        w="fit-content"
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
