'use client';

import { OverviewCard } from '@/common/components/OverviewCard';
import { useGlobalContext } from '@/common/context/useGlobalContext';
import { formatDateShort } from '@/common/utils/date-utils';
import { Button } from '@/ui/Button';
import type { ButtonProps } from '@/ui/Button';
import { Text } from '@/ui/Text';
import { ClientOnly, Flex, Grid, Icon } from '@chakra-ui/react';
import { ArrowUpRight } from '@phosphor-icons/react';

import { GlossaryTerm } from './GlossaryTerm';
import { getActiveBondSummary } from './active-bond-summary';
import { STAKING_LINKS } from './consts';
import type { Bond, BondRewards } from './data';
import {
  formatBtc,
  formatRatePercent,
  formatStx,
  formatUsd,
  microStxToStx,
  satsToBtc,
} from './utils';

function Figure({ value, unit }: { value: string; unit?: string }) {
  return (
    <Flex gap={1.5} align="baseline" flexWrap="wrap">
      <Text textStyle="heading-sm" fontWeight="medium" color="textPrimary" whiteSpace="nowrap">
        {value}
      </Text>
      {unit && (
        <Text textStyle="text-regular-sm" color="textSecondary">
          {unit}
        </Text>
      )}
    </Flex>
  );
}

export function HowToParticipateButton(props: ButtonProps) {
  return (
    <Button
      asChild
      variant="redesignPrimary"
      size="big"
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={2}
      {...props}
    >
      <a href={STAKING_LINKS.howToParticipate} target="_blank" rel="noopener noreferrer">
        How to participate
        <Icon w={3.5} h={3.5}>
          <ArrowUpRight weight="bold" />
        </Icon>
      </a>
    </Button>
  );
}

export function StakingStats({
  activeBonds,
  settlementsByBond,
}: {
  activeBonds?: Bond[];
  settlementsByBond?: BondRewards['settlementsByBond'];
}) {
  const { stxPrice, btcPrice } = useGlobalContext().tokenPrice;
  const summary =
    activeBonds === undefined ? undefined : getActiveBondSummary(activeBonds, settlementsByBond);
  const {
    averageTargetRateBps,
    bondedSats,
    pairedMicroStx,
    lastDistributionSats,
    lastDistributionTimestampMs,
  } = summary ?? {};
  const bondedBtc = bondedSats === undefined ? undefined : satsToBtc(bondedSats);
  const pairedStx = pairedMicroStx === undefined ? undefined : microStxToStx(pairedMicroStx);
  const scope = summary
    ? summary.count === 0
      ? 'No active bonds'
      : `Across ${summary.count} active bond${summary.count === 1 ? '' : 's'}`
    : 'Active bond data unavailable';

  const usd = (amount: number | undefined, price?: number) =>
    amount !== undefined && price ? formatUsd(amount * price) : undefined;
  const join = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(' · ') || undefined;

  return (
    <Grid
      templateColumns={{
        base: 'minmax(0, 1fr)',
        sm: 'repeat(2, minmax(0, 1fr))',
        lg: 'repeat(4, minmax(0, 1fr))',
      }}
      gap={3}
    >
      <OverviewCard
        title={<GlossaryTerm entry="targetRewardRate">Average protocol yield target</GlossaryTerm>}
        stat={
          <Figure
            value={
              averageTargetRateBps === undefined ? 'N/A' : formatRatePercent(averageTargetRateBps)
            }
          />
        }
        caption={
          averageTargetRateBps === undefined ? scope : `Simple average · ${scope.toLowerCase()}`
        }
      />
      <OverviewCard
        title="BTC bonded"
        stat={
          <Figure
            value={bondedSats === undefined ? 'N/A' : formatBtc(bondedSats, 1).replace(' BTC', '')}
            unit={bondedSats === undefined ? undefined : 'BTC'}
          />
        }
        caption={
          bondedSats === undefined
            ? 'Bond balance unavailable'
            : join(usd(bondedBtc, btcPrice), scope)
        }
      />
      <OverviewCard
        title="Latest reward distribution"
        stat={
          <Figure
            value={
              lastDistributionSats === undefined
                ? 'N/A'
                : formatBtc(lastDistributionSats, 4).replace(' BTC', '')
            }
            unit={lastDistributionSats === undefined ? undefined : 'sBTC'}
          />
        }
        caption={
          lastDistributionSats === undefined ? (
            'Reward history unavailable'
          ) : (
            <ClientOnly>
              {join(
                usd(satsToBtc(lastDistributionSats), btcPrice),
                lastDistributionTimestampMs === null
                  ? 'No distributions yet'
                  : lastDistributionTimestampMs === undefined
                    ? 'Date unavailable'
                    : formatDateShort(lastDistributionTimestampMs),
                scope
              )}
            </ClientOnly>
          )
        }
      />
      <OverviewCard
        title="STX paired"
        stat={
          <Figure
            value={
              pairedMicroStx === undefined ? 'N/A' : formatStx(pairedMicroStx).replace(' STX', '')
            }
            unit={pairedMicroStx === undefined ? undefined : 'STX'}
          />
        }
        caption={
          pairedMicroStx === undefined
            ? 'Paired balance unavailable'
            : join(usd(pairedStx, stxPrice), scope)
        }
      />
    </Grid>
  );
}
