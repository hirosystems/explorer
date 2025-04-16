'use client';

import { useHomePageData } from '@/app/home-redesign/context';
import { useMempoolFee } from '@/common/queries/useMempoolFee';
import { getTxTypeIcon, getTxTypeLabel } from '@/common/utils/transactions';
import { MICROSTACKS_IN_STACKS } from '@/common/utils/utils';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import StxThinIcon from '@/ui/icons/StacksThinIcon';
import { Flex, HStack, Icon, Stack } from '@chakra-ui/react';
import { Info, Lightning } from '@phosphor-icons/react';
import { ReactNode } from 'react';

import { MempoolFeePriorities } from '@stacks/stacks-blockchain-api-types';

type MempoolFeeResponseKey = Exclude<keyof MempoolFeePriorities, 'all'>;

function SectionHeader() {
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
          1 STX = $1.84
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

function FeeData({ title, ustxValue }: { title: ReactNode; ustxValue?: number }) {
  const stxValue =
    ustxValue !== undefined ? Number((ustxValue / MICROSTACKS_IN_STACKS).toFixed(2)) : undefined;
  const formattedStxValue = stxValue !== undefined && stxValue < 0.01 ? '<0.01' : stxValue;
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
          $0.01
        </Text>
      </HStack>
    </Stack>
  );
}

function FeeTabs() {
  const { mempoolFee } = useHomePageData();
  const availableTxTypeFees = Object.keys(mempoolFee || {}) as MempoolFeeResponseKey[];
  return (
    <TabsRoot variant={'primary'} size={'redesignMd'} defaultValue={'all'} gap="4">
      <Stack gap={4} w="100%">
        <Stack gap={3}>
          <TabsList flexWrap={'wrap'} rowGap={2}>
            {availableTxTypeFees.map(txType => (
              <TabsTrigger key={txType} value={txType} gap={1}>
                <TabIcon>{getTxTypeIcon(txType)}</TabIcon>
                <Text textStyle={'text-medium-sm'} color="textPrimary">
                  {getTxTypeLabel(txType)}
                </Text>
              </TabsTrigger>
            ))}
          </TabsList>
          <Flex>
            {availableTxTypeFees.map(txType => (
              <TabsContent key={txType} value={txType}>
                <Flex gap={2} flexWrap={'wrap'}>
                  <FeeData title="Low" ustxValue={mempoolFee?.[txType]?.low_priority} />
                  <FeeData title="Standard" ustxValue={mempoolFee?.[txType]?.medium_priority} />
                  <FeeData
                    title={
                      <Flex align={'center'} gap={0.5}>
                        High{' '}
                        <Icon w="4" h="4" color="iconTertiary">
                          <Lightning weight="fill" />
                        </Icon>
                      </Flex>
                    }
                    ustxValue={mempoolFee?.[txType]?.high_priority}
                  />
                </Flex>
              </TabsContent>
            ))}
          </Flex>
        </Stack>
        <Text textStyle="text-regular-xs" color="textSecondary">
          Current average fee rates for all transaction types.
        </Text>
      </Stack>
    </TabsRoot>
  );
}

export function FeeSection() {
  return (
    <Stack align="space-between" bg="surfaceSecondary" borderRadius={'xl'} p="6" gap="4">
      <SectionHeader />
      <FeeTabs />
    </Stack>
  );
}
