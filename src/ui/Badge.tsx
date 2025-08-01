'use client';

import { useGlobalContext } from '@/common/context/useGlobalContext';
import { buildUrl } from '@/common/utils/buildUrl';
import {
  getTxStatusBgColor,
  getTxStatusIcon,
  getTxStatusIconColor,
  getTxStatusLabel,
  getTxTypeColor,
  getTxTypeIcon,
  getTxTypeLabel,
} from '@/common/utils/transactions';
import { NextLink } from '@/ui/NextLink';
import { Text, TextProps } from '@/ui/Text';
import {
  Badge as CUIBadge,
  BadgeProps as CUIBadgeProps,
  Flex,
  Icon,
  RecipeVariantProps,
  chakra,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import BitcoinCircleIcon from './icons/BitcoinCircleIcon';
import StacksIconBlock from './icons/StacksIconBlock';
import { badgeRecipe } from './theme/recipes/BadgeRecipe';

type BadgeVariantProps = RecipeVariantProps<typeof badgeRecipe>;
export type BadgeProps = CUIBadgeProps & BadgeVariantProps;

export const BadgeBase = forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, variant, content, ...rest }, ref) => {
    return (
      <CUIBadge ref={ref} variant={variant} content={content} {...rest}>
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
    <Badge ref={ref} {...rest} variant="solid" content="iconAndLabel">
      <Flex alignItems="center" gap={1.5}>
        <DefaultBadgeIcon
          icon={blockType === 'stx' ? <StacksIconBlock /> : <BitcoinCircleIcon />}
          color={blockType === 'stx' ? 'accent.stacks-500' : 'accent.bitcoin-500'}
        />
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
  BadgeProps & { tx: Transaction | MempoolTransaction; withoutLabel?: boolean }
>(({ children, tx, withoutLabel, ...rest }, ref) => {
  return (
    <Badge
      ref={ref}
      {...rest}
      variant="outline"
      content={withoutLabel ? 'iconOnly' : 'iconAndLabel'}
    >
      <Flex alignItems="center" gap={1.5}>
        <DefaultBadgeIcon
          icon={getTxTypeIcon(tx.tx_type)}
          color="iconPrimary"
          bg={getTxTypeColor(tx.tx_type)}
        />
        {withoutLabel ? null : <DefaultBadgeLabel label={getTxTypeLabel(tx.tx_type)} />}
      </Flex>
    </Badge>
  );
});

export const TransactionStatusBadge = forwardRef<
  HTMLDivElement,
  BadgeProps & { tx: Transaction | MempoolTransaction; withoutLabel?: boolean }
>(({ children, tx, withoutLabel, ...rest }, ref) => {
  return (
    <Badge
      ref={ref}
      {...rest}
      bg={getTxStatusBgColor(tx)}
      content={withoutLabel ? 'iconOnly' : 'iconAndLabel'}
    >
      <Flex alignItems="center" gap={1.5}>
        <DefaultBadgeIcon icon={getTxStatusIcon(tx)} color={getTxStatusIconColor(tx)} />
        {withoutLabel ? null : <DefaultBadgeLabel label={getTxStatusLabel(tx)} />}
      </Flex>
    </Badge>
  );
});

export const DefaultBadgeIcon = ({
  icon,
  color = 'iconPrimary',
  bg,
}: {
  icon: React.ReactNode;
  color?: string;
  bg?: string;
}) => {
  return bg ? (
    <Flex alignItems="center" justifyContent="center" p={0.5} borderRadius="redesign.sm" bg={bg}>
      <Icon h={3} w={3} color={color}>
        {icon}
      </Icon>
    </Flex>
  ) : (
    <Icon h={4} w={4} color={color}>
      {icon}
    </Icon>
  );
};

export const DefaultBadgeLabel = ({ label, ...rest }: { label: string } & TextProps) => {
  return (
    <Text textStyle="text-medium-xs" color={'textPrimary'} whiteSpace="nowrap" {...rest}>
      {label}
    </Text>
  );
};

export const DefaultBadge = forwardRef<
  HTMLDivElement,
  BadgeProps & {
    icon: React.ReactElement<typeof DefaultBadgeIcon>;
    label: React.ReactElement<typeof DefaultBadgeLabel>;
  }
>(({ children, icon, label, ...rest }, ref) => {
  return (
    <Badge ref={ref} {...rest} variant="outline" content={label ? 'iconAndLabel' : 'iconOnly'}>
      <Flex alignItems="center" gap={1.5}>
        {icon}
        {label}
      </Flex>
    </Badge>
  );
});
