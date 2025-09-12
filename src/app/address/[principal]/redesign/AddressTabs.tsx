
import { ScrollIndicator } from '@/common/components/ScrollIndicator';
import { ValueBasisFilterPopover } from '@/common/components/table/filters/value-basis-filter/ValueBasisFiterPopover';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { Flex, Grid, Stack, StackProps } from '@chakra-ui/react';
import { useState } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { DetailsCard } from './DetailsCard';
import { Events } from './Events';
import { FunctionCalled } from './function-called/FunctionCalled';
import { PostConditions } from './post-conditions/PostConditions';
import { Source } from './source/Source';
import { TxSummary } from './tx-summary/TxSummary';

export const AddressTabs = ({ tx }: { tx: Transaction | MempoolTransaction }) => {
  const [selectedTab, setSelectedTab] = useState(TransactionIdPageTab.Overview);
  return (
    <TabsRoot
      variant="primary"
      size="redesignMd"
      defaultValue={TransactionIdPageTab.Overview}
      gap={2}
      rowGap={2}
      borderRadius="redesign.xl"
      w="full"
    >
      <Flex
        justifyContent={'space-between'}
        w="full"
        gap={2}
        flexDirection={{ base: 'column', sm: 'row' }}
        rowGap={2}
      >
        <ScrollIndicator>
          <TabsList>{getTabsTriggersByTransactionType(tx, selectedTab, setSelectedTab)}</TabsList>
        </ScrollIndicator>

        {tx.tx_type === 'token_transfer' && (
          <Flex alignItems={'center'} gap={2}>
            <Text textStyle="text-regular-sm">Show:</Text>
            <ValueBasisFilterPopover />
          </Flex>
        )}
      </Flex>
      {getTabsContentByTransactionType(tx)}
    </TabsRoot>
  );
};
