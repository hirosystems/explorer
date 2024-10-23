import { ReactNode, Suspense } from 'react';

import { ExplorerErrorBoundary } from '../../../app/_components/ErrorBoundary';
import { formatSignerLatency, formatSignerProposalMetric } from '../../../app/signers/SignersTable';
import { useSignerMetricsSignerForCycle } from '../../../app/signers/data/signer-metrics-hooks';
import { Section } from '../../../common/components/Section';
import { Box } from '../../../ui/Box';
import { Stack } from '../../../ui/Stack';
import { Caption } from '../../../ui/typography';
import { useSuspenseCurrentStackingCycle } from '../../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { SignerKeyStatsSkeleton } from './skeleton';

interface SignerStatsProps {
  signerKey: string;
}

export const SignerStatsLayout = ({ children }: { children: ReactNode }) => {
  return <Section title={'Stats'}>{children}</Section>;
};

export const SignerKeyStat = ({
  label,
  value,
}: {
  label: string | ReactNode;
  value: string | ReactNode;
}) => {
  return (
    <Stack gap={2} py={4}>
      <Caption>{label}</Caption>
      <Box>{value}</Box>
    </Stack>
  );
};

function SignerStatsBase({ signerKey }: SignerStatsProps) {
  const { currentCycleId } = useSuspenseCurrentStackingCycle();
  const { data: signerMetrics } = useSignerMetricsSignerForCycle(currentCycleId, signerKey);
  const totalProposals =
    signerMetrics?.proposals_accepted_count +
    signerMetrics?.proposals_rejected_count +
    signerMetrics?.proposals_missed_count;

  return (
    <SignerStatsLayout>
      <SignerKeyStat
        label="Latency"
        value={formatSignerLatency(
          signerMetrics?.average_response_time_ms,
          signerMetrics?.proposals_missed_count
        )}
      />
      <SignerKeyStat
        label="Accepted proposals %"
        value={formatSignerProposalMetric(signerMetrics?.proposals_accepted_count / totalProposals)}
      />
      <SignerKeyStat
        label="Rejected proposals %"
        value={formatSignerProposalMetric(signerMetrics?.proposals_rejected_count / totalProposals)}
      />
      <SignerKeyStat
        label="Missed proposals %"
        value={formatSignerProposalMetric(signerMetrics?.proposals_missed_count / totalProposals)}
      />
    </SignerStatsLayout>
  );
}

export function SignerStats(props: SignerStatsProps) {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        title: 'Signer Stats',
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <Suspense fallback={<SignerKeyStatsSkeleton />}>
        <SignerStatsBase {...props} />
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
