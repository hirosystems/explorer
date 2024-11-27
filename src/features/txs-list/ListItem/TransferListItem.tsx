import { useColorModeValue } from '@chakra-ui/react';
import { ArrowDown, ArrowUp } from '@phosphor-icons/react';
import * as React from 'react';
import { FC, memo, useMemo } from 'react';

import { AddressTransactionWithTransfers } from '@stacks/blockchain-api-client/lib/types';

import { getTicker } from '../../../app/txid/[txId]/Events';
import { Circle } from '../../../common/components/Circle';
import { TwoColsListItem } from '../../../common/components/TwoColumnsListItem';
import { PrincipalLink } from '../../../common/components/transaction-item';
import { useFtMetadata } from '../../../common/queries/useFtMetadata';
import { ftDecimals, getAssetNameParts } from '../../../common/utils/utils';
import { HStack } from '../../../ui/HStack';
import { Icon } from '../../../ui/Icon';
import { useBreakpointValue } from '../../../ui/hooks/useBreakpointValue';
import { Caption } from '../../../ui/typography';

interface TransferListItemProps {
  title: string;
  sender?: string;
  recipient?: string;
  amount: string;
  isOriginator: boolean;
  type: string;
  index: number;
}

export const TransferListItem: FC<TransferListItemProps> = memo(
  ({ title, sender, recipient, amount, isOriginator, type, index }) => {
    const circleSize = useBreakpointValue(
      {
        lg: '6',
        md: '4.5',
        sm: '4.5',
        xs: '4.5',
        base: '4.5',
      },
      {
        fallback: 'lg',
        ssr: false,
      }
    );

    const iconSize = useBreakpointValue(
      {
        lg: '2.5',
        md: '2.5',
        sm: '2.5',
        xs: '2.5',
        base: '2.5',
      },
      {
        fallback: 'lg',
        ssr: false,
      }
    );

    const iconBg = useColorModeValue('slate.150', 'slate.900');
    const iconColor = useColorModeValue('slate.900', 'slate.50');

    const icon = useMemo(
      () =>
        isOriginator ? (
          <Circle bg={iconBg} size={circleSize}>
            <Icon as={ArrowUp} size={iconSize} color={iconColor} />
          </Circle>
        ) : (
          <Circle bg={iconBg} size={circleSize}>
            <Icon as={ArrowDown} size={iconSize} color={iconColor} />
          </Circle>
        ),
      [iconBg, iconColor, circleSize, iconSize, isOriginator]
    );

    const leftSubtitle = useMemo(
      () => (
        <HStack
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          divider={<Caption>&nbsp;∙&nbsp;</Caption>}
        >
          <Caption>Transfer</Caption>
          <Caption>{type}</Caption>
          {isOriginator && recipient && (
            <Caption>
              to <PrincipalLink principal={recipient} />
            </Caption>
          )}
          {!isOriginator && sender && (
            <Caption>
              from <PrincipalLink principal={sender} />
            </Caption>
          )}
          <Caption>Event index: {index}</Caption>
        </HStack>
      ),
      [type, isOriginator, recipient, sender, index]
    );

    return (
      <TwoColsListItem
        icon={icon}
        leftContent={{ title, subtitle: leftSubtitle }}
        rightContent={{ title: amount, subtitle: null }}
        hoverEffect={false}
      />
    );
  }
);

export const TransferListItemWithMetaSymbol: FC<{
  ftTransfer: NonNullable<AddressTransactionWithTransfers['ft_transfers']>[number];
  sender?: string;
  recipient?: string;
  isOriginator: boolean;
  type: string;
  index: number;
}> = ({ ftTransfer, sender, recipient, isOriginator, type, index }) => {
  const { asset, address, contract } = getAssetNameParts(ftTransfer?.asset_identifier);
  const contractId = `${address}.${contract}`;
  const { data: ftMetadata } = useFtMetadata(contractId);
  const symbol = ftMetadata?.symbol || getTicker(asset).toUpperCase();
  return (
    <TransferListItem
      title={`${symbol || 'Token'} transfer`}
      sender={sender}
      recipient={recipient}
      amount={`${
        ftTransfer.amount ? ftDecimals(ftTransfer.amount, ftMetadata?.decimals || 0) : '-'
      } ${symbol}`}
      isOriginator={isOriginator}
      type={type}
      index={index}
    />
  );
};
