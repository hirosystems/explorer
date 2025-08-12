'use client';

import BitcoinCircleIcon from '@/ui/icons/BitcoinCircleIcon';
import StacksIconBlock from '@/ui/icons/StacksIconBlock';
import { HStack, Icon, IconProps, StackProps, Text, TextProps } from '@chakra-ui/react';

interface BitcoinBlockChipProps extends Omit<StackProps, 'children'> {
  value: number | string;
  iconColor?: string;
  iconProps?: Omit<IconProps, 'children'>;
  textProps?: Omit<TextProps, 'children'>;
}

interface StacksBlockChipProps extends Omit<StackProps, 'children'> {
  value: number | string;
  iconColor?: string;
  iconProps?: Omit<IconProps, 'children'>;
  textProps?: Omit<TextProps, 'children'>;
}

export function BitcoinBlockChip({
  value,
  iconColor = 'accent.bitcoin-500',
  iconProps,
  textProps,
  ...stackProps
}: BitcoinBlockChipProps) {
  return (
    <HStack
      gap={1.5}
      px={1.5}
      py={1}
      borderRadius="redesign.sm"
      bg="surfaceSecondary"
      minW="0"
      {...stackProps}
    >
      <Icon w={4} h={4} aria-hidden="true" color={iconColor} flexShrink={0} {...iconProps}>
        <BitcoinCircleIcon />
      </Icon>
      <Text
        textStyle="text-mono-sm"
        color="textPrimary"
        whiteSpace="nowrap"
        minW="0"
        {...textProps}
      >
        #{value}
      </Text>
    </HStack>
  );
}

export function StacksBlockChip({
  value,
  iconColor = 'iconPrimary',
  iconProps,
  textProps,
  ...stackProps
}: StacksBlockChipProps) {
  return (
    <HStack
      gap={1.5}
      px={1.5}
      py={1}
      borderRadius="redesign.sm"
      bg="surfaceSecondary"
      minW="0"
      {...stackProps}
    >
      <Icon w={4} h={4} aria-hidden="true" color={iconColor} flexShrink={0} {...iconProps}>
        <StacksIconBlock color={iconColor} />
      </Icon>
      <Text
        textStyle="text-mono-sm"
        color="textPrimary"
        whiteSpace="nowrap"
        minW="0"
        {...textProps}
      >
        #{value}
      </Text>
    </HStack>
  );
}
