import { PopoverContent, PopoverRoot, PopoverTrigger } from '@/components/ui/popover';
import { CurvedCornerIcon } from '@/ui/icons/CurvedCornerIcon';
import { Box, Flex, Icon, Separator, Stack } from '@chakra-ui/react';
import { GearFine, X } from '@phosphor-icons/react';
import { useState } from 'react';

import { CurrencySetting } from './CurrencySetting';
import { NetworkSetting } from './NetworkSetting';
import { ThemeSetting } from './ThemeSetting';

export const SettingsPopoverContent = ({ isOpen }: { isOpen?: boolean }) => {
  return (
    <Stack
      w={{ base: 'full', lg: 'fit-content' }}
      p={4}
      borderRadius="redesign.lg"
      borderTopRightRadius={{ base: 'redesign.lg', lg: 'none' }}
      border="none"
      bg="surfacePrimary"
      separator={<Separator borderColor="redesignBorderSecondary" />}
      gap={3}
      fontFamily="var(--font-instrument-sans)"
      boxShadow={{ base: 'none', lg: isOpen ? 'var(--stacks-shadows-elevation2)' : 'none' }}
    >
      <ThemeSetting />
      <CurrencySetting />
      <NetworkSetting />
    </Stack>
  );
};

const gooseNeckHeight = 14; // Increases the height of the popover trigger to meet the lowered popover content
const gooseNeckAdjustment = 8; // Moves the popover content down

export const SettingsPopover = () => {
  const [open, setOpen] = useState(false);

  return (
    <PopoverRoot
      id="settings-popover"
      positioning={{
        placement: 'bottom-end',
        offset: {
          mainAxis: gooseNeckAdjustment,
        },
      }}
      open={open}
      onOpenChange={e => setOpen(e.open)}
      unstyled
    >
      <PopoverTrigger>
        <Box
          position="relative"
          height={open ? gooseNeckHeight : 10}
          transform={open ? `translateY(${gooseNeckAdjustment}px)` : 'none'}
          bg="surfacePrimary"
          borderRadius="redesign.lg"
          borderBottomRadius={open ? 'none' : 'redesign.lg'}
          cursor="pointer"
          className="group"
        >
          <Flex alignItems="center" justifyContent="center" top={0} h={10} w={10}>
            <Icon h={4} w={4} color="iconSecondary" _groupHover={{ color: 'iconPrimary' }}>
              {open ? <X /> : <GearFine />}
            </Icon>
          </Flex>
          {open && (
            <Icon
              color="var(--stacks-colors-surface-primary)"
              position="absolute"
              bottom={'-1px'}
              left={`${-4 * 4 + 1}px`}
              h={4}
              w={4}
            >
              <CurvedCornerIcon />
            </Icon>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent zIndex="docked">
        {/* TODO: needing to set zIndex to docked to fix the issue where the popover is not showing up because the zindex is set to auto is most likely a bug on Chakra UI */}
        <SettingsPopoverContent isOpen={open} />
      </PopoverContent>
    </PopoverRoot>
  );
};
