import { FeeSection } from '@/app/_components/FeeSection';
import { MempoolSection } from '@/app/_components/MempoolSection';
import { Flex, Stack } from '@chakra-ui/react';

import { getSampleTxsFeeEstimate } from '../../common/utils/fee-utils';
import { SSRDisabledMessage } from '../_components/SSRDisabledMessage';
import { fetchUIMempoolStats } from '../data';
import MempoolTransactionsTable from './MempoolTransactionsTable';
import { fetchUIMempoolTransactions } from './data';


export default async function (props: { searchParams: Promise<Record<string, string>> }) {
  const searchParams = await props.searchParams;
  const chain = searchParams?.chain || 'mainnet';
  const api = searchParams?.api;
  const isSSRDisabled = searchParams?.ssr === 'false';

  const stacksAPIRequests = isSSRDisabled
    ? []
    : ([
        fetchUIMempoolStats(chain, api),
        fetchUIMempoolTransactions(chain, api),
        getSampleTxsFeeEstimate(chain as 'mainnet' | 'testnet', api),
      ] as const);

  const stacksAPIResults = await Promise.all(stacksAPIRequests);

  const [mempoolStats, initialMempoolTxData, sampleTxsFeeEstimate] = isSSRDisabled
    ? [undefined, undefined, undefined]
    : stacksAPIResults;


  const feeEstimates = sampleTxsFeeEstimate
    ? {
        tokenTransferFees: sampleTxsFeeEstimate.tokenTransferFees,
        contractCallFees: sampleTxsFeeEstimate.contractCallFees,
        contractDeployFees: sampleTxsFeeEstimate.contractDeployFees,
        averageFees: sampleTxsFeeEstimate.averageFees,
      }
    : undefined;

  return (
    <Stack gap={14} mt={[0, 0, 0, 0, 12]}>
      <Flex gap={[6]} flexDirection={['column', 'column', 'column', 'column', 'row']}>
        <Flex flex="1">
          {mempoolStats ? (
            <MempoolSection
              mempoolStats={mempoolStats}
              isSSRDisabled={isSSRDisabled}
              showHeader={false}
              chartWidth={220}
              chartHeight={220}
              chartInnerRadius={90}
            />
          ) : (
            <SSRDisabledMessage sectionName="Mempool statistics" />
          )}
        </Flex>
        <Flex flex="1">
          {feeEstimates ? (
            <FeeSection/>
          ) : (
            <SSRDisabledMessage sectionName="Fee estimates" />
          )}
        </Flex>
      </Flex>
      <MempoolTransactionsTable
        initialMempoolTxData={initialMempoolTxData}
        searchParams={searchParams}
      />
    </Stack>
  );
}
