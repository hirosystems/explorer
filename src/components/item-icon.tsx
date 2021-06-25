import React from 'react';
import { Box, BoxProps, color, Grid, GridProps } from '@stacks/ui';
import { border } from '@common/utils';
import { CodeIcon } from '@components/icons/code';
import { Transaction } from '@models/transaction.interface';
import { ContractCallIcon } from '@components/icons/contract-call';
import { StxInline } from '@components/icons/stx-inline';
import { WalletIcon } from '@components/icons/wallet';
import { AnchorBlockIcon } from '@components/icons/anchor-block';
import { MicroblockIcon } from '@components/icons/mircroblock';
import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { ClockIcon } from './icons/clock';

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

const StatusBubble: React.FC<any> = ({ status }) => {
  return (
    <ClockIcon
      color="white"
      fill="#757B83"
      size="20px"
      position="absolute"
      bottom="-2px"
      right="-4px"
      zIndex={9}
    />
  );
};

export const ItemIcon = React.memo(
  ({
    type,
    txType,
    opacity,
    status,
    ...rest
  }: {
    type: 'tx' | 'microblock' | 'block' | 'principal';
    txType?: Transaction['tx_type'] | MempoolTransaction['tx_type'];
    status?: Transaction['tx_status'] | MempoolTransaction['tx_status'];
  } & GridProps) => {
    let Icon;
    if (txType) {
      Icon = getTxTypeIcon(txType);
    }
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
        {status && status !== 'success' ? <StatusBubble status={status} /> : null}
        {Icon && (
          <Icon
            color={color('text-title')}
            position="relative"
            size={txType === 'token_transfer' ? '18px' : '21px'}
          />
        )}
      </ItemCircle>
    );
  }
);
