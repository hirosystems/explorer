import { useBreakpointValue } from '@chakra-ui/react';
import { ArrowBendDownRight, Clock, WarningCircle } from '@phosphor-icons/react';
import React, { FC, ReactNode } from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { TransactionType } from '@stacks/stacks-blockchain-api-types/generated';

import { Flex } from '../../ui/Flex';
import { Icon, IconProps } from '../../ui/Icon';
import ClarityIcon from '../../ui/icons/ClarityIcon';
import CubeSparkleIcon from '../../ui/icons/CubeSparkleIcon';
import DiagonalArrowsIcon from '../../ui/icons/DiagonalArrowsIcon';
import FunctionXIcon from '../../ui/icons/FunctionX';
import StxIcon from '../../ui/icons/StxIcon';
import { TransactionStatus } from '../constants/constants';
import { TxStatus } from '../types/tx';

export const getTxTypeIcon = (txType: Transaction['tx_type']): ReactNode => {
  // TODO: upgrade to v3. This may be broken
  switch (txType) {
    case 'token_transfer':
      return DiagonalArrowsIcon as any as ReactNode;

    case 'smart_contract':
      return ClarityIcon as any as ReactNode;

    case 'contract_call':
      return FunctionXIcon as any as ReactNode;

    case 'coinbase':
      return CubeSparkleIcon as any as ReactNode;

    case 'tenure_change':
      return ArrowBendDownRight as any as ReactNode;

    // sBTC-related transaction types
    // case 'tenure_extension':
    //   return ArrowBendDoubleUpRightLight; // mirror over x-axis to get down arrow

    // case 'burn':
    //   return FireLight;

    // case 'mint':
    //   CoinSparkleIcon;

    default:
      return StxIcon as any as ReactNode;
  }
};

const txIconCircleSizeBreakpointConfig = {
  lg: 10,
  md: 4.5,
  sm: 4.5,
  xs: 4.5,
  base: 4.5,
};
const txIconCircleSizeBreakpointConfigOptions = {
  fallback: 'lg',
  ssr: false,
};
const txIconSizeBreakpointConfig = {
  lg: 4,
  md: 2.5,
  sm: 2.5,
  xs: 2.5,
  base: 2.5,
};
const txIconSizeBreakpointConfigOptions = {
  fallback: 'lg',
  ssr: false,
};

function convertFromCUIScaleToPx(cuiScale: number) {
  const remScale = 4;
  const rem = cuiScale / remScale;
  return rem * 16; // parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const StatusBubble: React.FC<{ txStatus?: TxStatus }> = ({ txStatus }) => {
  const txIconCircleSize = useBreakpointValue(
    txIconCircleSizeBreakpointConfig,
    txIconCircleSizeBreakpointConfigOptions
  );
  const txIconSize = useBreakpointValue(
    txIconSizeBreakpointConfig,
    txIconSizeBreakpointConfigOptions
  );
  const txIconCircleToStatusBubbleCircleScaleFactor = 0.6;
  const statusBubbleCircleToIconScaleFactor = 1.2;
  const statusBubbleCircleSize = convertFromCUIScaleToPx(
    (txIconCircleSize as number) * txIconCircleToStatusBubbleCircleScaleFactor
  );
  const statusBubbleIconSize = convertFromCUIScaleToPx(
    (txIconSize as number) *
      txIconCircleToStatusBubbleCircleScaleFactor *
      statusBubbleCircleToIconScaleFactor
  );

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
      height={`${statusBubbleCircleSize}px`}
      width={`${statusBubbleCircleSize}px`}
      position="absolute"
      bottom={'0px'}
      right={'0px'}
      bg="surface"
      transform="translate(35%, 35%)"
      border={'1px'}
      rounded={'full'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Icon
        height={`${statusBubbleIconSize}px`}
        width={`${statusBubbleIconSize}px`}
        color={color}
        bg={'surface'}
      >
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

  const circleSize = useBreakpointValue(
    txIconCircleSizeBreakpointConfig,
    txIconCircleSizeBreakpointConfigOptions
  );

  const iconSize = useBreakpointValue(
    txIconSizeBreakpointConfig,
    txIconSizeBreakpointConfigOptions
  );

  return (
    <Flex
      height={`${convertFromCUIScaleToPx(circleSize as number)}px`}
      width={`${convertFromCUIScaleToPx(circleSize as number)}px`}
      position="relative"
      bottom={'0px'}
      right={'0px'}
      bg="surface"
      border={'1px'}
      rounded={'full'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      {showTxStatusBubble && <StatusBubble txStatus={txStatus} />}
      {TxIcon && (
        <Icon
          height={`${convertFromCUIScaleToPx(iconSize as number)}px`}
          width={`${convertFromCUIScaleToPx(iconSize as number)}px`}
          color={'text'}
        >
          {TxIcon}
        </Icon>
      )}
    </Flex>
  );
};
