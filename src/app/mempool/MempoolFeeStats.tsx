'use client';

import { Grid } from '@chakra-ui/react';
import { useState } from 'react';

import { Card } from '../../common/components/Card';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { FeeEstimates } from '../context';
import { MempoolFeePieChartSection } from './MempoolFeePieChartSection';
import { MempoolFeePriorityCardsSection } from './MempoolFeePriorityCardsSection';
import { TransactionTypeFilterTypes } from './TransactionTypeFilterMenu';

export function MempoolFeeStatsLayout({
  mempoolFeePieChartSection,
  mempoolFeePriorityCardsSection,
}: {
  mempoolFeePieChartSection: React.ReactNode;
  mempoolFeePriorityCardsSection: React.ReactNode;
}) {
  return (
    <Card>
      <Grid
        alignItems="flex-start"
        gridColumnStart={'1'}
        gridColumnEnd={['2', '2', '3']}
        gridTemplateColumns={['100%', '100%', '260px 1fr']}
        width="100%"
      >
        {mempoolFeePieChartSection}
        {mempoolFeePriorityCardsSection}
      </Grid>
    </Card>
  );
}

export function MempoolFeeStatsBase({ feeEstimates }: { feeEstimates: FeeEstimates }) {
  const [transactionType, setTransactionType] = useState<TransactionTypeFilterTypes>(
    TransactionTypeFilterTypes.AverageForAllTransactions
  );

  return (
    <MempoolFeeStatsLayout
      mempoolFeePieChartSection={<MempoolFeePieChartSection transactionType={transactionType} />}
      mempoolFeePriorityCardsSection={
        <MempoolFeePriorityCardsSection
          feeEstimates={feeEstimates}
          transactionType={transactionType}
          setTransactionType={setTransactionType}
        />
      }
    />
  );
}

export function MempoolFeeStats({ feeEstimates }: { feeEstimates: FeeEstimates }) {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <MempoolFeeStatsBase feeEstimates={feeEstimates} />
    </ExplorerErrorBoundary>
  );
}
