import { AddressLink } from '@/common/components/ExplorerLinks';
import { getContractName, truncateStxAddress } from '@/common/utils/utils';
import { DefaultBadge, DefaultBadgeIcon, DefaultBadgeLabel } from '@/ui/Badge';
import { Text, TextProps } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import ClarityIcon from '@/ui/icons/ClarityIcon';
import StacksIconThin from '@/ui/icons/StacksIconThin';
import { Flex, Icon } from '@chakra-ui/react';

import { TransactionEventAssetType } from '@stacks/stacks-blockchain-api-types';

import { EventsTableAddressColumnData } from './EventsTable';
import { getAssetEventTypeIcon, getAssetEventTypeLabel } from './utils';

const EllipsisText = ({ children, ...textProps }: { children: React.ReactNode } & TextProps) => {
  return (
    <Text
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      fontSize="sm"
      {...textProps}
    >
      {children}
    </Text>
  );
};

export const AssetEventTypeCellRenderer = ({
  assetEventType,
}: {
  assetEventType: TransactionEventAssetType;
}) => {
  return (
    <DefaultBadge
      icon={
        <DefaultBadgeIcon
          icon={getAssetEventTypeIcon(assetEventType)}
          bg="surfaceFifth"
          color="iconPrimary"
        />
      }
      label={<DefaultBadgeLabel label={getAssetEventTypeLabel(assetEventType)} />}
    />
  );
};

export const IndexCellRenderer = ({ index }: { index: number }) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      p={1.5}
      borderRadius="redesign.sm"
      bg="surfacePrimary"
      _groupHover={{
        bg: 'surfaceTertiary',
      }}
      w="fit-content"
      h="fit-content"
    >
      <Text
        textStyle="text-medium-xs"
        color={'textPrimary'}
        whiteSpace="nowrap"
        fontFamily="var(--font-matter-mono)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="full"
        w="full"
        aspectRatio={1}
      >
        {index}
      </Text>
    </Flex>
  );
};

export const AmountCellRenderer = (value: number) => {
  return (
    <Flex alignItems="center" gap={1}>
      <Icon h={3} w={3} color="textSecondary">
        <StacksIconThin />
      </Icon>
      <EllipsisText fontSize="sm">{value} STX</EllipsisText>
    </Flex>
  );
};

export const TimeStampCellRenderer = (value: string, tooltip?: string) => {
  const content = (
    <Flex
      alignItems="center"
      bg="surfacePrimary"
      borderRadius="md"
      py={0.5}
      px={1}
      w="fit-content"
      _groupHover={{
        bg: 'surfaceTertiary',
      }}
    >
      <EllipsisText
        fontSize="xs"
        fontFamily="var(--font-matter-mono)"
        suppressHydrationWarning={true}
      >
        {value}
      </EllipsisText>
    </Flex>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{content}</Tooltip>;
  }

  return content;
};
