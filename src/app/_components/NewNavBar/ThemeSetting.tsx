'use client';

import { useColorMode } from '@/components/ui/color-mode';
import { Text } from '@/ui/Text';
import { Box, ClientOnly, Flex, Icon } from '@chakra-ui/react';
import { Moon, SunDim } from '@phosphor-icons/react';

import { OptionPicker, OptionPickerOption } from './OptionPicker';

const options: OptionPickerOption[] = [
  {
    id: 'light',
    label: 'Light',
    value: 'light',
    icon: props => (
      <Icon {...props}>
        <SunDim />
      </Icon>
    ),
  },
  {
    id: 'dark',
    label: 'Dark',
    value: 'dark',
    icon: props => (
      <Icon {...props}>
        <Moon />
      </Icon>
    ),
  },
];

export const ThemeSettingBase = () => {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Flex alignItems="center" justifyContent="space-between" gap={8}>
      <Box lineHeight="redesign.short">
        <Text color="textPrimary" fontSize={{ base: 'sm', lg: 'xs' }} fontWeight="medium">
          Theme
        </Text>
        <Text color="textSecondary" fontSize={{ base: 'sm', lg: 'xs' }}>
          {options.find(option => option.id === colorMode)?.label}
        </Text>
      </Box>
      <OptionPicker
        options={options}
        optionId={colorMode}
        onSelect={optionId => {
          setColorMode(optionId as 'light' | 'dark');
        }}
        iconSize={{ base: 5, lg: 4 }}
        iconButtonHeight={{ base: 8, lg: 6 }}
        iconButtonWidth={{ base: 12, lg: 8 }}
      />
    </Flex>
  );
};

export const ThemeSetting = () => (
  <ClientOnly>
    <ThemeSettingBase />
  </ClientOnly>
);
