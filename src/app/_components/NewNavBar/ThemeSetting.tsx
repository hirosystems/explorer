'use client';

import { PopoverContent, PopoverRoot, PopoverTrigger } from '@/components/ui/popover';
import { Text } from '@/ui/Text';
import { Box, Flex, Icon, Separator, Stack } from '@chakra-ui/react';
import { GearFine } from '@phosphor-icons/react';
import { useState } from 'react';
import { MobileColorModeButton } from './UniversalColorModeButton';
import { useColorMode } from '@/components/ui/color-mode';

export const ThemeSetting = () => {
    // const { colorMode } = useColorMode();
    return  <Flex justifyContent="space-between">
    <Box>
      <Text>Theme</Text>
      {/* <Text>{colorMode}</Text> */}
    </Box>
    <Box border="1px solid" borderColor="borderSecondary" borderRadius="lg" p={1}>
<Flex gap={1}>

    <MobileColorModeButton
      colorMode="light"
      aria-label={'Change color mode'}
      color="invert"
      borderWidth={'1px'}
      borderRadius="xl"
    />
    <MobileColorModeButton
      colorMode="dark"
      aria-label={'Change color mode'}
      color="invert"
      borderWidth={'1px'}
      borderRadius="xl"
    />
</Flex>

    </Box>

  </Flex>
}