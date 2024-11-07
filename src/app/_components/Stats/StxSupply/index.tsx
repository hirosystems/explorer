'use client';

import { Box, Flex, Icon, StackProps } from '@chakra-ui/react';
import { Info } from '@phosphor-icons/react';

import { useGlobalContext } from '../../../../common/context/useGlobalContext';
import { useSuspenseStxSupply } from '../../../../common/queries/useStxSupply';
import { abbreviateNumber } from '../../../../common/utils/utils';
import { Tooltip } from '../../../../ui/Tooltip';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { StatSection } from '../StatSection';

function StxSupplyBase(props: StackProps) {
  const {
    data: { total_stx, unlocked_stx, total_stx_year_2050 },
  } = useSuspenseStxSupply();
  const circulatingSupplyNumber = unlocked_stx ? Number(unlocked_stx) : 0;
  const circulatingSupplyFormatted = abbreviateNumber(circulatingSupplyNumber);
  const totalSupplyNumber = total_stx ? Number(total_stx) : 0;
  const totalSupplyFormatted = abbreviateNumber(totalSupplyNumber);
  const maxSupplyBy2050Number = total_stx_year_2050 ? Number(total_stx_year_2050) : 0;
  const maxSupplyBy2050Formatted = abbreviateNumber(maxSupplyBy2050Number);
  const percentageUnlocked = ((circulatingSupplyNumber / totalSupplyNumber) * 100).toFixed(1);
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
      bodyMainText={circulatingSupplyFormatted}
      bodySecondaryText={
        <Flex alignItems={'center'} gap={1}>
          <span>/</span>
          <span>{totalSupplyFormatted}</span>
        </Flex>
      }
      caption={
        <>
          <b>{percentageUnlocked}%</b> of total supply is circulating
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
