import { useColorMode } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';
import { BsCodeSlash } from 'react-icons/bs';
import { TbBrandCoinbase } from 'react-icons/tb';
import { RxCube } from 'react-icons/rx';
import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { TransactionType } from '@stacks/stacks-blockchain-api-types/generated';
import { TransactionStatus } from '@/common/constants';
import { TxStatus } from '@/common/types/tx';
import { ClockIcon } from '@/components/icons/clock';
import { FailedIcon } from '@/components/icons/failed';
import { MicroblockIcon } from '@/components/icons/microblock';
import { Circle, IconProps } from '@/ui/components';
import { FunctionIcon } from '@/ui/icons';
import { StxIcon } from '@/ui/icons/StxIcon';

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

    default:
      return StxIcon;
  }
};

function StatusBubble({ txStatus }: { txStatus?: TxStatus }) {
  const { colorMode } = useColorMode();
  if (txStatus === TransactionStatus.PENDING) {
    return (
      <Circle size="16px" position="absolute" bottom="-2px" right="-4px">
        <ClockIcon color={`invert.${colorMode}`} fill={`bg.${colorMode}`} />
      </Circle>
    );
  }
  if (txStatus === TransactionStatus.FAILED) {
    return (
      <Circle size="16px" position="absolute" bottom="-2px" right="-4px">
        <FailedIcon color={`feedbackError.${colorMode}`} fill={`bg.${colorMode}`} />
      </Circle>
    );
  }
  if (txStatus === TransactionStatus.SUCCESS_MICROBLOCK) {
    return (
      <Circle
        bg={`invert.${colorMode}`}
        size="16px"
        position="absolute"
        bottom="-2px"
        right="-4px"
        boxShadow="none"
      >
        <MicroblockIcon color={`bg.${colorMode}`} fill={`bg.${colorMode}`} size="10px" />
      </Circle>
    );
  }
  return null;
}

export function TxIcon({
  txType,
  txStatus,
  ...rest
}: {
  txType?: TransactionType;
  txStatus?: TxStatus;
} & IconProps) {
  const showTxStatusBubble = txStatus !== TransactionStatus.SUCCESS_ANCHOR_BLOCK;

  const TxIcon = txType ? getTxTypeIcon(txType) : null;

  return (
    <Circle size="40px" position="relative">
      {showTxStatusBubble && <StatusBubble txStatus={txStatus} />}
      {TxIcon && <TxIcon color="textCaption.light" size="16px" />}
    </Circle>
  );
}
