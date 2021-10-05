import React, { useMemo } from 'react';
import { BoxProps, color, Grid, GridProps, useColorMode } from '@stacks/ui';
import { border } from '@common/utils';
import { CodeIcon } from '@components/icons/code';
import { ContractCallIcon } from '@components/icons/contract-call';
import { StxInline } from '@components/icons/stx-inline';
import { WalletIcon } from '@components/icons/wallet';
import { AnchorBlockIcon } from '@components/icons/anchor-block';
import { MicroblockIcon } from '@components/icons/microblock';
import { ClockIcon } from '@components/icons/clock';
import { FailedIcon } from '@components/icons/failed';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { TransactionStatus } from '@common/constants';
import { getTransactionStatus } from '@common/utils/transactions';
import { TxStatus } from '@common/types/tx';

export const getTxTypeIcon = (txType: Transaction['tx_type']): React.FC<BoxProps> => {
  let Icon = (p: any) => <StxInline {...p} strokeWidth={1.5} />;
  if (txType === 'smart_contract') {
    Icon = CodeIcon as any;
  } else if (txType === 'contract_call') {
    Icon = ContractCallIcon as any;
  }
  return Icon;
};

const ItemCircle: React.FC<GridProps> = props => (
  <Grid
    placeItems="center"
    size="40px"
    borderRadius="50%"
    position="relative"
    border={props.border}
    bg={props.bg}
    color={color('invert')}
    boxShadow="low"
    as="span"
    {...props}
  />
);

interface StatusBubbleProps extends BoxProps {
  txStatus: TxStatus | undefined;
}

const StatusBubble: React.FC<StatusBubbleProps> = ({ txStatus }) => {
  if (txStatus === TransactionStatus.PENDING) {
    return (
      <ItemCircle size="16px" position="absolute" bottom="-2px" right="-4px" zIndex={10}>
        <ClockIcon color={color('invert')} fill={color('bg')} border="none" />
      </ItemCircle>
    );
  } else if (txStatus === TransactionStatus.FAILED) {
    return (
      <ItemCircle size="16px" position="absolute" bottom="-2px" right="-4px" zIndex={10}>
        <FailedIcon color={color('feedback-error')} fill={color('bg')} />
      </ItemCircle>
    );
  } else if (txStatus === TransactionStatus.SUCCESS_MICROBLOCK) {
    return (
      <ItemCircle
        bg={color('invert')}
        size="16px"
        position="absolute"
        bottom="-2px"
        right="-4px"
        zIndex={10}
      >
        <MicroblockIcon color={color('bg')} fill={color('bg')} size="10px" />
      </ItemCircle>
    );
  } else {
    return null;
  }
};

export const ItemIcon = React.memo(
  ({
    type,
    tx,
    opacity,
    ...rest
  }: {
    type: 'tx' | 'microblock' | 'block' | 'principal';
    tx?: Transaction | MempoolTransaction;
  } & GridProps) => {
    const txStatus = tx && useMemo(() => getTransactionStatus(tx), [tx]);
    const { colorMode } = useColorMode();

    const showTxStatusBubble = txStatus !== TransactionStatus.SUCCESS_ANCHOR_BLOCK;

    let Icon;
    if (tx?.tx_type) {
      Icon = getTxTypeIcon(tx?.tx_type);
    }

    if (type === 'microblock') {
      Icon = React.memo((p: any) => (
        <MicroblockIcon
          {...p}
          size="16px"
          color={color('text-caption')}
          fill={color('text-caption')}
        />
      ));
    }
    if (type === 'block') {
      Icon = React.memo((p: any) => <AnchorBlockIcon {...p} size="16px" color={color('bg')} />);
    }
    if (type === 'principal') {
      Icon = React.memo((p: any) => <WalletIcon {...p} size="16px" />);
    }

    return (
      <ItemCircle
        bg={type === 'block' ? color('invert') : color('bg')}
        border={
          type === 'microblock' || type === 'tx'
            ? colorMode === 'light'
              ? border()
              : border('text-caption')
            : 'none'
        }
        {...rest}
      >
        {type === 'tx' && showTxStatusBubble && <StatusBubble txStatus={txStatus} />}
        {Icon && <Icon color={color('text-title')} position="relative" size="16px" />}
      </ItemCircle>
    );
  }
);
