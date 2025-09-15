import { sbtcContractAddress } from '@/app/token/[tokenId]/consts';
import { TabTriggerComponent, TabsContentContainer } from '@/app/txid/[txId]/redesign/TxTabs';
import {
  PriceSummaryItemValue,
  RowCopyButton,
  SummaryItem,
} from '@/app/txid/[txId]/redesign/tx-summary/SummaryItem';
import { Circle } from '@/common/components/Circle';
import { ScrollIndicator } from '@/common/components/ScrollIndicator';
import { microToStacks } from '@/common/utils/utils';
import { SimpleTag } from '@/ui/Badge';
import { TabsContent, TabsList, TabsRoot } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import StacksIconThin from '@/ui/icons/StacksIconThin';
import SBTCIcon from '@/ui/icons/sBTCIcon';
import { Flex, Grid, Icon, Stack, Table } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';

import { useAddressIdPageData } from '../AddressIdPageContext';

enum AddressIdPageTab {
  Overview = 'overview',
  Transactions = 'transactions',
  Tokens = 'tokens',
  Collectibles = 'collectibles',
}

export const AddressOverview = () => {
  const {
    principal,
    initialAddressBalancesData,
    stxPrice,
    initialAddressLatestNonceData,
    initialAddressBNSNamesData,
  } = useAddressIdPageData();
  const totalFees = initialAddressBalancesData?.stx.total_fees_sent || 0;

  return (
    <Table.Root w="full" h="fit-content">
      <Table.Body h="fit-content">
        <SummaryItem label="Address ID" value={principal} showCopyButton />
        <SummaryItem
          label="Associated BNS Name"
          value={initialAddressBNSNamesData?.names[0]}
          valueRenderer={value => <SimpleTag label={value} />}
          showCopyButton
        />
        <SummaryItem
          label="Total paid in fees"
          value={totalFees.toString()}
          valueRenderer={value => <PriceSummaryItemValue value={value} stxPrice={stxPrice} />}
          showCopyButton
        />
        <SummaryItem
          label="Last executed nonce"
          value={initialAddressLatestNonceData?.last_executed_tx_nonce?.toString() || ''}
          showCopyButton
        />
      </Table.Body>
    </Table.Root>
  );
};

type TokenBalanceType = 'stx' | 'sbtc';

const BalanceItem = ({
  tokenBalance,
  tokenBalanceValue,
  tokenBalanceType,
}: {
  tokenBalance: string;
  tokenBalanceValue: string;
  tokenBalanceType: TokenBalanceType;
}) => {
  return (
    <Stack gap={1.5}>
      <Flex gap={2} alignItems="center">
        <Circle bg="accent.stacks-500" h={6} w={6} border="none">
          <Icon h={3.5} w={3.5} color="colors.neutral.white">
            {tokenBalanceType === 'stx' ? <StacksIconThin /> : <SBTCIcon />}
          </Icon>
        </Circle>
        <Text textStyle="heading-sm" color="textPrimary">
          {tokenBalance} STX
        </Text>
        <RowCopyButton value={tokenBalance} ariaLabel={`copy balance`} />
      </Flex>
      <Flex>
        <SimpleTag label={`$${tokenBalanceValue}`} />
        <RowCopyButton value={tokenBalanceValue} ariaLabel={`copy balance`} />
      </Flex>
    </Stack>
  );
};

const BalanceCard = () => {
  const { initialAddressBalancesData, stxPrice, btcPrice } = useAddressIdPageData();

  const totalBalanceMicroStacks = initialAddressBalancesData?.stx.balance;
  const isStxBalanceDefined = totalBalanceMicroStacks !== undefined;
  const totalBalanceStacks = isStxBalanceDefined ? microToStacks(totalBalanceMicroStacks) : 0;
  const totalBalanceUsdValue = (totalBalanceStacks * stxPrice).toFixed(2);

  const fungibleTokenBalances = initialAddressBalancesData?.fungible_tokens;
  const sbtcBalance = fungibleTokenBalances?.[sbtcContractAddress]?.balance;
  const isSbtcBalanceDefined = sbtcBalance !== undefined;
  const sbtcBalanceNumber = isSbtcBalanceDefined ? parseFloat(sbtcBalance) : 0;
  const sbtcBalanceUsdValue = isSbtcBalanceDefined ? sbtcBalanceNumber * btcPrice : 0;

  return (
    <Stack px={5} py={5} gap={4} bg="surfaceSecondary" borderRadius="redesign.xl" border="1px solid" borderColor="borderSecondary">
      <Text textStyle="text-medium-sm" color="textPrimary">
        Total balance
      </Text>
      <Stack gap={6}>
        <BalanceItem
          tokenBalance={isStxBalanceDefined ? totalBalanceStacks.toString() : '-'}
          tokenBalanceValue={isStxBalanceDefined ? totalBalanceUsdValue : '-'}
          tokenBalanceType="stx"
        />
        {isSbtcBalanceDefined && (
          <BalanceItem
            tokenBalance={sbtcBalance}
            tokenBalanceValue={sbtcBalanceUsdValue.toString()}
            tokenBalanceType="sbtc"
          />
        )}
      </Stack>
    </Stack>
  );
};

const StackingCardItem = ({ label, value }: { label: string; value: ReactNode }) => {
  return (
    <Stack gap={0.5}>
      <Text textStyle="text-medium-sm" color="textSecondary">
        {label}
      </Text>
      {value}
    </Stack>
  );
};

const StackingCard = () => {
  const { initialAddressBalancesData } = useAddressIdPageData();
  const burnChainLockHeight = initialAddressBalancesData?.stx.burnchain_lock_height;
  const burnChainUnlockHeight = initialAddressBalancesData?.stx.burnchain_unlock_height;
  const lockedSTX = initialAddressBalancesData?.stx.locked;
  return (
    <Stack px={5} py={5} gap={4} bg="surfaceSecondary" borderRadius="redesign.xl" border="1px solid" borderColor="borderSecondary">
      <Text textStyle="text-medium-sm" color="textPrimary">
        Stacking
      </Text>
      <Stack gap={4}>
        <StackingCardItem label="Locked" value={<Text textStyle="text-regular-sm" color="textPrimary">0 STX</Text>} />
        <StackingCardItem label="BTC Rewards" value={<Text textStyle="text-regular-sm" color="textPrimary">0 STX</Text>} />
        <StackingCardItem label="Stacking start cycle" value={<Text textStyle="text-regular-sm" color="textPrimary">0 STX</Text>} />
        <StackingCardItem label="Current cycle" value={<Text textStyle="text-regular-sm" color="textPrimary">0 STX</Text>} />
        <StackingCardItem label="Method" value={<Text textStyle="text-regular-sm" color="textPrimary">0 STX</Text>} />
        <StackingCardItem label="Pool" value={<Text textStyle="text-regular-sm" color="textPrimary">0 STX</Text>} />
        <StackingCardItem label="Type" value={<Text textStyle="text-regular-sm" color="textPrimary">0 STX</Text>} />
      </Stack>
    </Stack>
  );
};

export const AddressTabs = ({ principal }: { principal: string }) => {
  const [selectedTab, setSelectedTab] = useState(AddressIdPageTab.Overview);
  const { initialAddressBalancesData, initialAddressLatestNonceData } = useAddressIdPageData();
  console.log('AddressTabs', { initialAddressBalancesData, initialAddressLatestNonceData });
  return (
    <TabsRoot
      variant="primary"
      size="redesignMd"
      defaultValue={AddressIdPageTab.Overview}
      gap={2}
      rowGap={2}
      borderRadius="redesign.xl"
      w="full"
    >
      <ScrollIndicator>
        <TabsList>
          <TabTriggerComponent
            key={AddressIdPageTab.Overview}
            label="Overview"
            value={AddressIdPageTab.Overview}
            isActive={selectedTab === AddressIdPageTab.Overview}
            onClick={() => setSelectedTab(AddressIdPageTab.Overview)}
          />
          <TabTriggerComponent
            key={AddressIdPageTab.Transactions}
            label={'Transactions'}
            value={AddressIdPageTab.Transactions}
            isActive={selectedTab === AddressIdPageTab.Transactions}
            onClick={() => setSelectedTab(AddressIdPageTab.Transactions)}
          />
          <TabTriggerComponent
            key={AddressIdPageTab.Tokens}
            label={`Tokens`}
            // secondaryLabel={numPostConditions > 0 ? `(${numPostConditions})` : ''}
            value={AddressIdPageTab.Tokens}
            isActive={selectedTab === AddressIdPageTab.Tokens}
            onClick={() => setSelectedTab(AddressIdPageTab.Tokens)}
          />
          <TabTriggerComponent
            key={AddressIdPageTab.Collectibles}
            label={`Collectibles`}
            // secondaryLabel={numTxEvents > 0 ? `(${numTxEvents})` : ''}
            value={AddressIdPageTab.Collectibles}
            isActive={selectedTab === AddressIdPageTab.Collectibles}
            onClick={() => setSelectedTab(AddressIdPageTab.Collectibles)}
          />
        </TabsList>
      </ScrollIndicator>
      <TabsContent key={AddressIdPageTab.Overview} value={AddressIdPageTab.Overview} w="100%">
        <Grid templateColumns={{ base: '1fr', md: '75% 25%' }} gap={2}>
          <TabsContentContainer h="fit-content">
            <AddressOverview />
          </TabsContentContainer>
          <Stack gap={2}>
            <BalanceCard />
            <StackingCard />
          </Stack>
        </Grid>
      </TabsContent>
    </TabsRoot>
  );
};
