import {
  PositioningOptions,
  TabPopoverContent,
  TabPopoverRoot,
  TabPopoverTrigger,
} from '@/common/components/TabPopover';
import { Flex, Icon, PopoverContentProps, PopoverTriggerProps } from '@chakra-ui/react';
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
  offset: { mainAxis: 0 },
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
      positioning={positioning ?? DEFAULT_POSITIONING}
      open={open}
      onOpenChange={e => {
        setOpen(e.open);
      }}
    >
      <TabPopoverTrigger
        open={open}
        positioning={positioning ?? DEFAULT_POSITIONING}
        {...triggerProps}
      >
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
        placement={positioning?.placement ?? DEFAULT_POSITIONING.placement}
        w="fit-content"
        {...contentProps}
      >
        {content(open, setOpen)}
      </TabPopoverContent>
    </TabPopoverRoot>
  );
}
