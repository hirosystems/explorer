import { Flex, Icon, IconProps } from '@chakra-ui/react';
import { ArrowBendDownRight, Clock, WarningCircle } from '@phosphor-icons/react';
import React, { FC, ReactNode } from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { TransactionType } from '@stacks/stacks-blockchain-api-types/generated';

import ClarityIcon from '../../ui/icons/ClarityIcon';
import CubeSparkleIcon from '../../ui/icons/CubeSparkleIcon';
import DiagonalArrowsIcon from '../../ui/icons/DiagonalArrowsIcon';
import FunctionXIcon from '../../ui/icons/FunctionX';
import StxIcon from '../../ui/icons/StxIcon';
import { TransactionStatus } from '../constants/constants';
import { TxStatus } from '../types/tx';

export const getTxTypeIcon = (txType: Transaction['tx_type']): ReactNode => {
  switch (txType) {
    case 'token_transfer':
      return <DiagonalArrowsIcon />;

    case 'smart_contract':
      return <ClarityIcon />;

    case 'contract_call':
      return <FunctionXIcon />;

    case 'coinbase':
      return <CubeSparkleIcon />;

    case 'tenure_change':
      return <ArrowBendDownRight />;

    // sBTC-related transaction types
    // case 'tenure_extension':
    //   return ArrowBendDoubleUpRightLight; // mirror over x-axis to get down arrow

    // case 'burn':
    //   return FireLight;

    // case 'mint':
    //   CoinSparkleIcon;

    default:
      return <StxIcon />;
  }
};

const txIconCircleSize = {
  lg: 10,
  base: 4.5,
};
const txIconSize = {
  lg: 4,
  base: 2.5,
};

function convertFromCUIScaleToPx(cuiScale: number) {
  const remScale = 4;
  const rem = cuiScale / remScale;
  return rem * 16; // parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const txIconCircleToStatusBubbleCircleScaleFactor = 0.6;
const statusBubbleCircleToIconScaleFactor = 1.2;
const statusBubbleCircleSize = Object.fromEntries(
  Object.entries(txIconCircleSize).map(([key, value]) => [
    key,
    `${convertFromCUIScaleToPx(value * txIconCircleToStatusBubbleCircleScaleFactor)}px`,
  ])
);
const statusBubbleIconSize = Object.fromEntries(
  Object.entries(txIconSize).map(([key, value]) => [
    key,
    `${convertFromCUIScaleToPx(value * txIconCircleToStatusBubbleCircleScaleFactor * statusBubbleCircleToIconScaleFactor)}px`,
  ])
);

const StatusBubble: React.FC<{ txStatus?: TxStatus }> = ({ txStatus }) => {
  // Only show the status bubble if the transaction is pending or failed
  if (txStatus !== TransactionStatus.PENDING && txStatus !== TransactionStatus.FAILED) {
    return null;
  }

  const icon =
    txStatus === TransactionStatus.PENDING ? (
      <Clock />
    ) : txStatus === TransactionStatus.FAILED ? (
      <WarningCircle />
    ) : null;
  const color =
    txStatus === TransactionStatus.PENDING
      ? 'text'
      : txStatus === TransactionStatus.FAILED
        ? 'error'
        : undefined;

  return (
    <Flex
      h={statusBubbleCircleSize}
      w={statusBubbleCircleSize}
      position="absolute"
      bottom={0}
      right={0}
      bg="surface"
      transform="translate(35%, 35%)"
      border="normal"
      rounded={'full'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Icon h={statusBubbleIconSize} w={statusBubbleIconSize} color={color} bg={'surface'}>
        {icon}
      </Icon>
    </Flex>
  );
};

export const TxIcon: FC<
  {
    txType?: TransactionType;
    txStatus?: TxStatus;
  } & IconProps
> = ({ txType, txStatus }) => {
  const showTxStatusBubble = txStatus !== TransactionStatus.SUCCESS_ANCHOR_BLOCK;

  const TxIcon = txType ? getTxTypeIcon(txType) : null;

  return (
    <Flex
      h={txIconCircleSize}
      w={txIconCircleSize}
      position="relative"
      bottom={0}
      right={0}
      bg="surface"
      border="1px solid var(--stacks-colors-border-secondary)"
      rounded={'full'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      {showTxStatusBubble && <StatusBubble txStatus={txStatus} />}
      {TxIcon && (
        <Icon h={txIconSize} w={txIconSize} color={'text'}>
          {TxIcon}
        </Icon>
      )}
    </Flex>
  );
};
