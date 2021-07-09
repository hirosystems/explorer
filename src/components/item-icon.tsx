import React from 'react';
import { BoxProps, color, Grid, GridProps } from '@stacks/ui';
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
    size="48px"
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

const StatusBubble: React.FC<any> = ({ tx }) => {
  if (tx?.tx_status === 'pending') {
    return (
      <ClockIcon
        color="white"
        fill="#757B83"
        size="20px"
        position="absolute"
        bottom="-2px"
        right="-4px"
        zIndex={10}
      />
    );
  } else if (tx?.tx_status !== 'success' && tx?.tx_status !== 'pending') {
    return (
      <FailedIcon
        color={color('feedback-error')}
        fill="white"
        size="16px"
        position="absolute"
        bottom="-2px"
        right="-2px"
        zIndex={10}
      />
    );
  } else if (tx?.tx_status === 'success' && !!tx?.microblock_hash) {
    return (
      <ItemCircle
        bg={color('invert')}
        size="16px"
        position="absolute"
        bottom="-2px"
        right="-2px"
        zIndex={10}
      >
        <MicroblockIcon color="white" fill="white" size="12px" />
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
    let Icon;
    if (tx?.tx_type) {
      Icon = getTxTypeIcon(tx?.tx_type);
    }
    const showTxStatusBubble =
      tx?.tx_status !== 'success' || (tx?.tx_status === 'success' && !!tx?.microblock_hash);

    if (type === 'microblock') {
      Icon = React.memo((p: any) => (
        <MicroblockIcon {...p} size="22px" color="#74777D" fill="#74777D" />
      ));
    }
    if (type === 'block') {
      Icon = React.memo((p: any) => <AnchorBlockIcon {...p} size="22px" color="#FFFFFF" />);
    }
    if (type === 'principal') {
      Icon = React.memo((p: any) => <WalletIcon {...p} size="22px" />);
    }
    return (
      <ItemCircle
        bg={type === 'block' ? '#242629' : color('bg')}
        border={type === 'block' ? 'none' : border()}
        {...rest}
      >
        {type === 'tx' && showTxStatusBubble && <StatusBubble tx={tx} />}
        {Icon && (
          <Icon
            color={color('text-title')}
            position="relative"
            size={tx?.tx_type === 'token_transfer' ? '18px' : '21px'}
          />
        )}
      </ItemCircle>
    );
  }
);
