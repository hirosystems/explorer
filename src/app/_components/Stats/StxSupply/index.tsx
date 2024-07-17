'use client';

import { useColorMode } from '@chakra-ui/react';
import { Infinity, Info } from '@phosphor-icons/react';
import * as React from 'react';

import { useGlobalContext } from '../../../../common/context/useGlobalContext';
import { useSuspenseStxSupply } from '../../../../common/queries/useStxSupply';
import { numberToString } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { GridProps } from '../../../../ui/Grid';
import { Icon } from '../../../../ui/Icon';
import { Tooltip } from '../../../../ui/Tooltip';
import { useStxSupply } from '../../../signers/data/useStxSupply';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { StatSection } from '../StatSection';

function StxSupplyBase(props: GridProps) {
  const {
    data: { total_stx, unlocked_stx },
  } = useSuspenseStxSupply();
  const { circulatingSupply } = useStxSupply();
  const circulatingSupplyNumber = circulatingSupply ? Number(circulatingSupply) : 0;
  const circulatingSupplyFormatted = numberToString(circulatingSupplyNumber);
  const totalSupplyNumber = unlocked_stx ? Number(unlocked_stx) : 0;
  const totalSupplyFormatted = numberToString(totalSupplyNumber);
  const maxSupplyBy2050Number = total_stx ? Number(total_stx) : 0;
  const maxSupplyBy2050Formatted = numberToString(maxSupplyBy2050Number);
  const percentageUnlocked = ((circulatingSupplyNumber / totalSupplyNumber) * 100).toFixed(1);
  const isMainnet = useGlobalContext().activeNetwork.mode === 'mainnet';

  return (
    <StatSection
      title={
        <Flex alignItems={'center'} gap={1}>
          Circulating Supply
          {isMainnet && (
            <Tooltip
              label={`Year 2050 supply is ~${maxSupplyBy2050Formatted}, STX supply grows approx 0.3% annually thereafter in perpetuity.`}
            >
              <Flex alignItems={'center'}>
                &nbsp;
                <Icon as={Info} size={4} />
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

export function StxSupply(props: GridProps) {
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
