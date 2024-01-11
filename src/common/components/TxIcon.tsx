import React, { FC } from 'react';
import { BsCodeSlash } from 'react-icons/bs';
import { PiArrowBendDownRight, PiClock, PiWarningCircle } from 'react-icons/pi';
import { RxCube } from 'react-icons/rx';

import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { TransactionType } from '@stacks/stacks-blockchain-api-types/generated';

import { Icon, IconProps } from '../../ui/Icon';
import { useBreakpointValue } from '../../ui/hooks/useBreakpointValue';
import { FunctionIcon, StxIcon } from '../../ui/icons';
import { CubeSparkleIcon } from '../../ui/icons/CubeSparkleIcon';
import { TransactionStatus } from '../constants/constants';
import { TxStatus } from '../types/tx';
import { Circle } from './Circle';

export const getTxTypeIcon = (txType: Transaction['tx_type']): FC => {
  switch (txType) {
    case 'smart_contract':
      return BsCodeSlash;

    case 'contract_call':
      return FunctionIcon;

    case 'coinbase':
      return CubeSparkleIcon;

    case 'poison_microblock':
      return RxCube;

    case 'tenure_change':
      return PiArrowBendDownRight;

    default:
      return StxIcon;
  }
};

const StatusBubble: React.FC<{ txStatus?: TxStatus }> = ({ txStatus }) => {
  if (txStatus === TransactionStatus.PENDING) {
    return (
      <Circle size="4" position="absolute" bottom="-2px" right="-4px">
        <Icon as={PiClock} color={'text'} bg={'bg'} />
      </Circle>
    );
  } else if (txStatus === TransactionStatus.FAILED) {
    return (
      <Circle size="4" position="absolute" bottom="-2px" right="-4px">
        <Icon as={PiWarningCircle} color={'error'} bg={'bg'} />
      </Circle>
    );
  } else {
    return null;
  }
};

export const TxIcon: FC<
  {
    txType?: TransactionType;
    txStatus?: TxStatus;
  } & IconProps
> = ({ txType, txStatus, ...rest }) => {
  const showTxStatusBubble = txStatus !== TransactionStatus.SUCCESS_ANCHOR_BLOCK;

  const TxIcon = txType ? getTxTypeIcon(txType) : null;

  const circleSize = useBreakpointValue(
    {
      lg: '10',
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
      lg: '4',
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

  return (
    <Circle size={circleSize} position={'relative'} border={'1px'}>
      {showTxStatusBubble && <StatusBubble txStatus={txStatus} />}
      {TxIcon && <Icon size={iconSize} as={TxIcon} color={'text'} />}
    </Circle>
  );
};
