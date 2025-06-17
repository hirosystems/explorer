'use client';

import { useGlobalContext } from '@/common/context/useGlobalContext';
import { buildUrl } from '@/common/utils/buildUrl';
import { getTxTypeColor, getTxTypeIcon, getTxTypeLabel } from '@/common/utils/transactions';
import { NextLink } from '@/ui/NextLink';
import { Text } from '@/ui/Text';
import {
  Badge as CUIBadge,
  BadgeProps as CUIBadgeProps,
  Flex,
  Icon,
  RecipeVariantProps,
  chakra,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { Transaction } from '@stacks/blockchain-api-client';

import BitcoinCircleIcon from './icons/BitcoinCircleIcon';
import StacksIconBlock from './icons/StacksIconBlock';
import { badgeRecipe } from './theme/recipes/BadgeRecipe';

type BadgeVariantProps = RecipeVariantProps<typeof badgeRecipe>;
export type BadgeProps = CUIBadgeProps & BadgeVariantProps;

export const BadgeBase = forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, variant = 'solid', ...rest }, ref) => {
    return (
      <CUIBadge ref={ref} variant={variant} {...rest}>
        {children}
      </CUIBadge>
    );
  }
);

export const Badge = chakra(BadgeBase, badgeRecipe);

export const BlockHeightBadge = forwardRef<
  HTMLDivElement,
  BadgeProps & { blockType: 'stx' | 'btc'; blockHeight: number }
>(({ children, blockType, blockHeight, ...rest }, ref) => {
  const network = useGlobalContext().activeNetwork;

  return (
    <Badge ref={ref} {...rest} variant="solid">
      <Flex alignItems="center" gap={1.5}>
        <Icon h={3} w={3} color={blockType === 'stx' ? 'accent.stacks-500' : 'accent.bitcoin-500'}>
          {blockType === 'stx' ? <StacksIconBlock /> : <BitcoinCircleIcon />}
        </Icon>
        <NextLink
          href={buildUrl(`${blockType === 'stx' ? '/block/' : '/btcblock'}${blockHeight}`, network)}
          color="textPrimary"
          variant="aTag"
        >
          #{blockHeight}
        </NextLink>
      </Flex>
    </Badge>
  );
});

export const TransactionTypeBadge = forwardRef<
  HTMLDivElement,
  BadgeProps & { txType: Transaction['tx_type']; withLabel?: boolean }
>(({ children, txType, withLabel, ...rest }, ref) => {
  return (
    <Badge ref={ref} {...rest} variant="outline">
      <Flex alignItems="center" gap={1.5}>
        <Flex
          alignItems="center"
          justifyContent="center"
          p={1}
          borderRadius="redesign.sm"
          bg={getTxTypeColor(txType)}
        >
          <Icon h={3} w={3} color="iconPrimary">
            {getTxTypeIcon(txType)}
          </Icon>
        </Flex>
        {withLabel && (
          <Text textStyle="text-medium-xs" color="textPrimary" whiteSpace="nowrap">
            {getTxTypeLabel(txType)}
          </Text>
        )}
      </Flex>
    </Badge>
  );
});

export const SimpleBadge = forwardRef<
  HTMLDivElement,
  BadgeProps & { icon?: React.ReactNode; label?: string }
>(({ children, icon, label, ...rest }, ref) => {
  return (
    <Badge ref={ref} {...rest} variant="solid">
      <Flex alignItems="center" gap={1.5}>
        {icon && (
          <Icon h={3} w={3} color="iconPrimary">
            {icon}
          </Icon>
        )}
        {label && (
          <Text textStyle="text-medium-xs" color="textPrimary" whiteSpace="nowrap">
            {label}
          </Text>
        )}
      </Flex>
    </Badge>
  );
});
