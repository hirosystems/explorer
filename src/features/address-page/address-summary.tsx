import { microToStacks } from '@common/utils';
import { Activity } from '@components/activity-row';
import { TokenBalancesRow } from '@components/balances/token-balances-row';
import { Rows } from '@components/rows';
import { Section } from '@components/section';

export const AddressSummary = ({
  principal,
  hasTokenBalances,
  balances,
  transactions,
  lastExecutedTxNonce,
}: any) => {
  return (
    <Section mb={'extra-loose'} title="Summary">
      <Rows
        px="base"
        noTopBorder
        items={[
          {
            label: {
              children: 'Address',
            },
            children: principal,
            copy: principal,
          },
          {
            condition: !!transactions?.results?.length,
            label: {
              children: 'Activity',
            },
            children: <Activity txs={transactions?.results} amount={transactions?.total} />,
          },
          {
            condition: !!hasTokenBalances,
            label: {
              children: 'Holdings',
            },
            children: <TokenBalancesRow balances={balances} />,
          },
          {
            label: {
              children: 'Fees',
            },
            children:
              (balances?.stx?.total_fees_sent &&
                `${microToStacks(balances?.stx?.total_fees_sent)} STX`) ||
              undefined,
          },
          {
            label: {
              children: 'Last executed tx nonce',
            },
            children:
              typeof lastExecutedTxNonce === 'undefined'
                ? undefined
                : lastExecutedTxNonce || "This account hasn't executed a tx yet",
          },
        ]}
      />
    </Section>
  );
};
