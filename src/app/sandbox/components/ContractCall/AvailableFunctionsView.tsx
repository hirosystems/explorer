'use client';

import { Badge } from '@/common/components/Badge';
import { ContractWithParsedAbi } from '@/common/types/contract';
import { ArrowRightIcon } from '@/components/icons/arrow-right';
import { ExplorerLink } from '@/components/links';
import { Section } from '@/components/section';
import { Flex, Grid } from '@/ui/components';
import { Text } from '@/ui/typography';
import { forwardRef, useColorMode } from '@chakra-ui/react';
import { mdiApi, mdiFunction } from '@mdi/js';
import Icon from '@mdi/react';
import React, { FC } from 'react';

export const AbiFunction = forwardRef<
  {
    abiFn: { access: string; name: string };
    onClick?: () => void;
  },
  'div'
>(({ abiFn, onClick }, ref) => {
  const colorMode = useColorMode().colorMode;
  return (
    <Flex
      ref={ref}
      justifyContent="space-between"
      p="16px"
      _hover={{
        cursor: 'pointer',
        bg: `bgAlt.${useColorMode().colorMode}`,
      }}
      onClick={onClick}
    >
      <Flex alignItems="center">
        <Flex alignItems="center">
          <Grid
            placeItems="center"
            borderWidth="1px"
            borderRadius="100%"
            size="32px"
            color={'textCaption'}
          >
            {abiFn.access === 'read_only' ? (
              <Icon path={mdiApi} size="20px" />
            ) : (
              <Icon path={mdiFunction} size="20px" />
            )}
          </Grid>
          <Text
            fontSize="14px"
            fontFamily={`"Fira Code", monospace`}
            ml="16px"
            fontWeight="500"
            color={'textBody'}
          >
            {abiFn.name}
          </Text>
        </Flex>
        {abiFn.access === 'read_only' && (
          <Badge ml="16px" bg={`bg.${colorMode}`} color={`textCaption.${colorMode}`}>
            {abiFn.access}
          </Badge>
        )}
      </Flex>
      <ArrowRightIcon width={'18px'} />
    </Flex>
  );
});

function showFn(contractId: string, abiFn: any) {
  return (
    abiFn.access !== 'private' &&
    abiFn.name !== 'stack-increase' &&
    contractId !== 'SP000000000000000000002Q6VF78.pox-2' &&
    contractId !== 'ST000000000000000000002AMW42H.pox-2'
  );
}

export const AvailableFunctionsView: FC<{
  contract: ContractWithParsedAbi;
  contractId: string;
}> = ({ contractId, contract }) => (
  <Section overflowY="auto" flexGrow={1} title="Available functions">
    {contract?.abi?.functions.map(
      (abiFn: any) =>
        hideFn(contractId, abiFn) && (
          <ExplorerLink
            href={`/sandbox/contract-call/${contractId}/${abiFn.name}`}
            key={abiFn.name}
          >
            <AbiFunction abiFn={abiFn} />
          </ExplorerLink>
        )
    )}
  </Section>
);
