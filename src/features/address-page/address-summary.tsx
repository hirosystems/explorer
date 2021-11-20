import * as React from 'react';
import { Section } from '@components/section';
import { Rows } from '@components/rows';
import { Activity } from '@components/activity-row';
import { TokenBalancesRow } from '@components/balances/token-balances-row';
import { microToStacks } from '@common/utils';
import { Box, color, Stack, StxInline } from '@stacks/ui';
import { Badge } from '@components/badge';
import { truncateMiddle } from '@stacks/ui-utils';

export const AddressSummary = ({
  principal,
  name,
  hasTokenBalances,
  balances,
  transactions,
  nonce,
}: any) => {
  // @note If we return undefined, the code can't check if an initial value was provided.
  if (name === 'undefined') name = undefined;

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
            children: (
              <>
                {name ? (
                  <Stack isInline spacing={'base'}>
                    <span>{name}</span>
                    <Badge
                      color={color('text-body')}
                      labelProps={{ display: 'flex', alignItems: 'center' }}
                      alignItems="center"
                      bg={color('bg-alt')}
                      my={0}
                    >
                      <Box ml={'extra-tight'}>{truncateMiddle(principal, 5)}</Box>
                    </Badge>
                  </Stack>
                ) : (
                  principal
                )}
              </>
            ),
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
            children: `${microToStacks(balances?.stx?.total_fees_sent || 0)} STX`,
          },
          {
            label: {
              children: 'Nonce',
            },
            children: nonce,
          },
        ]}
      />
    </Section>
  );
};
