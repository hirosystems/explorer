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
    <Badge ref={ref} {...rest} variant="solid" type="blockHeight">
      <Flex alignItems="center" gap={1}>
        <DefaultBadgeIcon
          icon={blockType === 'stx' ? <StacksIconBlock /> : <BitcoinCircleIcon />}
          color={blockType === 'stx' ? 'accent.stacks-500' : 'accent.bitcoin-500'}
        />
        <NextLink
          href={buildUrl(
            `${blockType === 'stx' ? '/block/' : '/btcblock/'}${blockHeight}`,
            network
          )}
          variant="tableLink"
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
      type="transactionType"
    >
      <Flex alignItems="center" gap={1}>
        <DefaultBadgeIcon icon={getTxTypeIcon(tx.tx_type)} bg={getTxTypeColor(tx.tx_type)} />
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
      type="transactionStatus"
      content={withoutLabel ? 'iconOnly' : 'iconAndLabel'}
    >
      <Flex alignItems="center" gap={1}>
        <DefaultBadgeIcon icon={getTxStatusIcon(tx, true)} color={getTxStatusIconColor(tx)} />
        {withoutLabel ? null : <DefaultBadgeLabel label={getTxStatusLabel(tx)} />}
      </Flex>
    </Badge>
  );
});

export const DefaultBadgeIcon = ({
  icon,
  color = 'var(--stacks-colors-neutral-sand-1000)',
  bg,
  size,
}: {
  icon: React.ReactNode;
  color?: string;
  bg?: string;
  size?: number;
}) => {
  const iconSize = size ?? (bg ? 3 : 3.5);

  return bg ? (
    <Flex
      alignItems="center"
      justifyContent="center"
      p={0.5}
      borderRadius="redesign.sm"
      bg={bg}
      h={4.5}
      w={4.5}
    >
      <Icon h={iconSize} w={iconSize} color={color}>
        {icon}
      </Icon>
    </Flex>
  ) : (
    <Icon h={iconSize} w={iconSize} color={color}>
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
    <Badge
      ref={ref}
      variant="outline"
      {...rest}
      content={label ? 'iconAndLabel' : 'iconOnly'}
      w="fit-content"
    >
      <Flex alignItems="center" gap={1.5} w="fit-content">
        {icon}
        {label}
      </Flex>
    </Badge>
  );
});
