import { useColorMode } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IconType } from 'react-icons';
import { BsCodeSlash } from 'react-icons/bs';
import { PiArrowBendDownRight } from 'react-icons/pi';
import { RxCube } from 'react-icons/rx';
import { TbBrandCoinbase } from 'react-icons/tb';

import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { TransactionType } from '@stacks/stacks-blockchain-api-types/generated';

import { Circle } from '../../ui/Circle';
import { IconProps } from '../../ui/Icon';
import { FunctionIcon, StxIcon } from '../../ui/icons';
import { TransactionStatus } from '../constants/constants';
import { TxStatus } from '../types/tx';
import { ClockIcon } from './icons/clock';
import { FailedIcon } from './icons/failed';
import { MicroblockIcon } from './icons/microblock';

export const getTxTypeIcon = (txType: Transaction['tx_type']): IconType => {
  switch (txType) {
    case 'smart_contract':
      return BsCodeSlash;

    case 'contract_call':
      return FunctionIcon;

    case 'coinbase':
      return TbBrandCoinbase;

    case 'poison_microblock':
      return RxCube;

    case 'tenure_change':
      return PiArrowBendDownRight;

    default:
      return StxIcon;
  }
};

const StatusBubble: React.FC<{ txStatus?: TxStatus }> = ({ txStatus }) => {
  const colorMode = useColorMode().colorMode;
  if (txStatus === TransactionStatus.PENDING) {
    return (
      <Circle size="16px" position="absolute" bottom="-2px" right="-4px">
        <ClockIcon color={`invert.${colorMode}`} fill={`bg.${colorMode}`} />
      </Circle>
    );
  } else if (txStatus === TransactionStatus.FAILED) {
    return (
      <Circle size="16px" position="absolute" bottom="-2px" right="-4px">
        <FailedIcon color={`feedbackError.${colorMode}`} fill={`bg.${colorMode}`} />
      </Circle>
    );
  } else if (txStatus === TransactionStatus.SUCCESS_MICROBLOCK) {
    return (
      <Circle
        bg={`invert.${colorMode}`}
        size="16px"
        position="absolute"
        bottom="-2px"
        right="-4px"
        boxShadow={'none'}
      >
        <MicroblockIcon color={`bg.${colorMode}`} fill={`bg.${colorMode}`} size="10px" />
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

  return (
    <Circle size={'40px'} position={'relative'}>
      {showTxStatusBubble && <StatusBubble txStatus={txStatus} />}
      {TxIcon && <TxIcon color={'textCaption.light'} size="16px" />}
    </Circle>
  );
};
