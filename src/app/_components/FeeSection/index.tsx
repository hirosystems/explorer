'use client';

import { useHomePageData } from '@/app/context';
import { TokenPrice } from '@/common/types/tokenPrice';
import { getTxTypeIcon, getTxTypeLabel } from '@/common/utils/transactions';
import { MICROSTACKS_IN_STACKS } from '@/common/utils/utils';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import StxThinIcon from '@/ui/icons/StacksThinIcon';
import { Flex, HStack, Icon, Stack } from '@chakra-ui/react';
import { Info, Lightning, PlusMinus } from '@phosphor-icons/react';
import { ReactNode } from 'react';

import { MempoolFeePriorities } from '@stacks/stacks-blockchain-api-types';

function SectionHeader({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <HStack align="center" justify={'space-between'} gap={2} flexWrap={'wrap'}>
      <HStack align="center" gap={2}>
        <Text textStyle="heading-sm" color="textPrimary">
          Current transaction fees
        </Text>
        <Tooltip
          variant="redesignPrimary"
          size="lg"
          content="Higher fees increase the chances of a transaction being confirmed faster than others."
        >
          <Icon color="iconSecondary" h={3.5} w={3.5}>
            <Info />
          </Icon>
        </Tooltip>
      </HStack>
      <HStack
        align="center"
        gap={0.5}
        px="2"
        py="1.5"
        bg="surfacePrimary"
        borderRadius={'xs'}
        width="fit-content"
      >
        <Icon h={3} w={3} color="iconPrimary">
          <StxThinIcon />
        </Icon>
        <Text textStyle="text-mono-xs" color="textPrimary">
          1 STX = ${tokenPrice?.stxPrice?.toFixed(2)}
        </Text>
      </HStack>
    </HStack>
  );
}

function TabIcon({ children }: { children: ReactNode }) {
  return (
    <Icon w="3.5" h="3.5" color="iconPrimary">
      {children}
    </Icon>
  );
}

function FeeData({
  title,
  ustxValue,
  tokenPrice,
}: {
  title: ReactNode;
  ustxValue?: number;
  tokenPrice: TokenPrice;
}) {
  const stxValue =
    ustxValue !== undefined ? Number((ustxValue / MICROSTACKS_IN_STACKS).toFixed(4)) : undefined;
  const formattedStxValue = stxValue !== undefined && stxValue < 0.0001 ? '<0.0001' : stxValue;

  const dollarValue = stxValue !== undefined ? stxValue * tokenPrice.stxPrice : undefined;

  return (
    <Stack
      gap={2}
      px={4}
      pt={3}
      pb={2}
      borderRadius={'redesign.md'}
      border="1px solid"
      borderColor="redesignBorderSecondary"
      flex="1"
      minWidth="fit-content"
    >
      <Text textStyle="text-medium-lg" color="textPrimary">
        {title}
      </Text>
      <HStack align="center" gap={1} whiteSpace={'nowrap'}>
        <Text textStyle="text-mono-sm" color="textPrimary">
          {formattedStxValue === undefined ? 'N/A' : `${formattedStxValue} STX`}
        </Text>
        <Text textStyle="text-mono-sm" color="textSecondary">
          /
        </Text>
        <Text textStyle="text-mono-sm" color="textSecondary">
          {dollarValue === undefined
            ? 'N/A'
            : dollarValue < 0.01
              ? '<$0.01'
              : `$${dollarValue.toFixed(2)}`}
        </Text>
      </HStack>
    </Stack>
  );
}

function getFeeDescription(txType: keyof MempoolFeePriorities) {
  switch (txType) {
    case 'all':
      return 'Current average fee rates for all transaction types.';
    case 'smart_contract':
      return 'Current fee rates for smart contract deployments.';
    case 'token_transfer':
      return 'Current fee rates for token and NFT transfers.';
    case 'contract_call':
      return 'Current fee rates for contract calls (i.e: swapping, minting, or buying tokens and NFTs).';
    default:
      return 'Current fee rates for all transaction types.';
  }
}

const txTypeFees = ['all', 'smart_contract', 'token_transfer', 'contract_call'] as Array<
  keyof MempoolFeePriorities | 'all'
>;

function FeeTabs({ tokenPrice }: { tokenPrice: TokenPrice }) {
  const { feeEstimates } = useHomePageData();

  const feeEstimatesMap = {
    all: feeEstimates.averageFees,
    smart_contract: feeEstimates.contractDeployFees,
    token_transfer: feeEstimates.tokenTransferFees,
    contract_call: feeEstimates.contractCallFees,
  };

  return (
    <TabsRoot variant={'primary'} size={'redesignMd'} defaultValue={'all'} gap="4">
      <Stack gap={4} w="100%">
        <Stack gap={3}>
          <TabsList flexWrap={'wrap'} rowGap={2}>
            {txTypeFees.map(txType => (
              <TabsTrigger key={txType} value={txType} gap={1}>
                <TabIcon>{txType === 'all' ? <PlusMinus /> : getTxTypeIcon(txType)}</TabIcon>
                <Text textStyle={'text-medium-sm'} color="textPrimary">
                  {txType === 'all' ? 'Average' : getTxTypeLabel(txType)}
                </Text>
              </TabsTrigger>
            ))}
          </TabsList>
          <Flex>
            {txTypeFees.map(txType => (
              <TabsContent key={txType} value={txType}>
                <Stack gap={4}>
                  <Flex gap={2} flexWrap={'wrap'}>
                    <FeeData
                      title="Low"
                      ustxValue={feeEstimatesMap[txType]?.low_priority}
                      tokenPrice={tokenPrice}
                    />
                    <FeeData
                      title="Standard"
                      ustxValue={feeEstimatesMap[txType]?.medium_priority}
                      tokenPrice={tokenPrice}
                    />
                    <FeeData
                      title={
                        <Flex align={'center'} gap={0.5}>
                          High{' '}
                          <Icon w="4" h="4" color="iconTertiary">
                            <Lightning weight="fill" />
                          </Icon>
                        </Flex>
                      }
                      ustxValue={feeEstimatesMap[txType]?.high_priority}
                      tokenPrice={tokenPrice}
                    />
                  </Flex>
                  <Text textStyle="text-regular-xs" color="textSecondary">
                    {getFeeDescription(txType)}
                  </Text>
                </Stack>
              </TabsContent>
            ))}
          </Flex>
        </Stack>
      </Stack>
    </TabsRoot>
  );
}

export function FeeSection({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <Stack align="space-between" bg="surfaceSecondary" borderRadius={'xl'} p="6" gap="4">
      <SectionHeader tokenPrice={tokenPrice} />
      <FeeTabs tokenPrice={tokenPrice} />
    </Stack>
  );
}
