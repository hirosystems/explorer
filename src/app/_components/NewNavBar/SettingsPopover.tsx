import { PopoverContent, PopoverRoot, PopoverTrigger } from '@/components/ui/popover';
import { Flex, Icon, Separator, Stack } from '@chakra-ui/react';
import { GearFine } from '@phosphor-icons/react';
import { useState } from 'react';

import { CurrencySetting } from './CurrencySetting';
import { NetworkSetting } from './NetworkSetting';
import { ThemeSetting } from './ThemeSetting';

export const SettingsPopover = () => {
  const [open, setOpen] = useState(false);

  return (
    <PopoverRoot
      id="settings-popover"
      positioning={{
        placement: 'bottom-end',
        gutter: 0,
      }}
      open={open}
      onOpenChange={e => setOpen(e.open)}
      unstyled
    >
      <PopoverTrigger>
        <Flex
          alignItems="center"
          justifyContent="center"
          gap={2}
          py={3}
          px={3}
          bg="surfacePrimary"
          borderRadius="lg"
          borderBottomRadius={open ? 'none' : 'lg'}
        >
          <Icon h={4} w={4} color="iconSecondary">
            <GearFine />
          </Icon>
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        w="fit-content"
        p={4}
        borderRadius="xl"
        borderTopRightRadius="none"
        border="none"
        bg="surfacePrimary"
      >
        <Stack separator={<Separator my={3} borderColor="newBorderSecondary" />}>
          <ThemeSetting />
          <CurrencySetting />
          <NetworkSetting />
        </Stack>
      </PopoverContent>
    </PopoverRoot>
  );
};
