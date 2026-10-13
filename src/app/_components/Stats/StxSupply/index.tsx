'use client';

import { Box, Flex, Icon, StackProps } from '@chakra-ui/react';
import { Info } from '@phosphor-icons/react';

import { useGlobalContext } from '../../../../common/context/useGlobalContext';
import { useSuspenseStxSupply } from '../../../../common/queries/useStxSupply';
import { MICROSTACKS_IN_STACKS, abbreviateNumber } from '../../../../common/utils/utils';
import { Tooltip } from '../../../../ui/Tooltip';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { StatSection } from '../StatSection';

function StxSupplyBase(props: StackProps) {
  const {
    data: { total, projected_total_2050 },
  } = useSuspenseStxSupply();
  // All STX is unlocked, so the circulating supply is the total supply.
  const totalSupplyNumber = total ? Number(total) / MICROSTACKS_IN_STACKS : 0;
  const totalSupplyFormatted = abbreviateNumber(totalSupplyNumber);
  const maxSupplyBy2050Number = projected_total_2050
    ? Number(projected_total_2050) / MICROSTACKS_IN_STACKS
    : 0;
  const maxSupplyBy2050Formatted = abbreviateNumber(maxSupplyBy2050Number);
  const isMainnet = useGlobalContext().activeNetwork.mode === 'mainnet';

  return (
    <StatSection
      title={
        <Flex alignItems={'center'} gap={1}>
          Circulating Supply
          {isMainnet && (
            <Tooltip
              content={`Year 2050 supply is ~${maxSupplyBy2050Formatted}, STX supply grows approx 0.3% annually thereafter in perpetuity.`}
            >
              <Flex alignItems={'center'}>
                &nbsp;
                <Icon h={4} w={4}>
                  <Info />
                </Icon>
              </Flex>
            </Tooltip>
          )}
        </Flex>
      }
      bodyMainText={totalSupplyFormatted}
      bodySecondaryText={
        <Flex alignItems={'center'} gap={1}>
          <span>/</span>
          <span>{totalSupplyFormatted}</span>
        </Flex>
      }
      caption={
        <>
          <b>100%</b> of total supply is circulating
        </>
      }
      {...props}
    />
  );
}

export function StxSupply(props: StackProps) {
  return (
    <ExplorerErrorBoundary
      Wrapper={Box}
      wrapperProps={{ borderRightWidth: ['0px', '0px', '1px', '1px'] }}
      tryAgainButton
    >
      <StxSupplyBase {...props} />
    </ExplorerErrorBoundary>
  );
}
