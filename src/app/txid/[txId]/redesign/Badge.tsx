import { getTxStatusBgColor, getTxStatusIcon, getTxStatusIconColor, getTxStatusLabel, getTxTypeColor, getTxTypeIcon, getTxTypeLabel } from '@/common/utils/transactions';
import { Text } from '@/ui/Text';
import { Flex, FlexProps, Icon } from '@chakra-ui/react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

export const TransactionTypeBadge = ({ tx, ...rest }: { tx: Transaction } & FlexProps) => {
  return (
    <Badge
      icon={
        <Flex
          p={1}
          alignItems="center"
          justifyContent="center"
          bg={getTxTypeColor(tx.tx_type)}
          borderRadius="redesign.sm"
        >
          <Icon h={3} w={3}>
            {getTxTypeIcon(tx.tx_type)}
          </Icon>
        </Flex>
      }
      label={getTxTypeLabel(tx.tx_type)}
      {...rest}
    />
  );
};

export const TransactionStatusBadge = ({ tx, ...rest }: { tx: Transaction } & FlexProps) => {
  return (
    <Badge
      icon={<Icon h={3.5} w={3.5} color={getTxStatusIconColor(tx)}>{getTxStatusIcon(tx)}</Icon>}
      label={getTxStatusLabel(tx)}
      bg={getTxStatusBgColor(tx)}
      {...rest}
    />
  );
};

export const Badge = ({
  icon,
  label,
  ...rest
}: { icon: React.ReactNode; label: string } & FlexProps) => {
  return (
    <Flex
      py={1}
      pl={1}
      pr={1.5}
      borderRadius="redesign.md"
      border="1px solid"
      borderColor="redesignBorderSecondary"
      gap={1}
      alignItems="center"
      {...rest}
    >
      {icon}
      <Text textStyle="text-medium-xs" color="textPrimary">
        {label}
      </Text>
    </Flex>
  );
};
