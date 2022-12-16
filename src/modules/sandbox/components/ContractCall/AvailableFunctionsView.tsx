import { mdiApi, mdiFunction } from '@mdi/js';
import Icon from '@mdi/react';
import React, { FC } from 'react';

import { Flex, Grid, IconButton, color } from '@stacks/ui';

import { ContractWithParsedAbi } from '@common/types/contract';
import { border } from '@common/utils';

import { Badge } from '@components/badge';
import { ArrowRightIcon } from '@components/icons/arrow-right';
import { ExplorerLink } from '@components/links';
import { Section } from '@components/section';
import { Text } from '@components/typography';

export const AbiFunction: FC<{ abiFn: { access: string; name: string }; onClick?: () => void }> = ({
  abiFn,
  onClick,
}) => (
  <Flex
    justifyContent="space-between"
    p="base"
    borderBottom={border()}
    _hover={{
      cursor: 'pointer',
      bg: color('bg-alt'),
    }}
    onClick={onClick}
  >
    <Flex alignItems="center">
      <Flex alignItems="center">
        <Grid
          placeItems="center"
          border={border()}
          borderRadius="100%"
          size="32px"
          color={color('text-caption')}
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
          ml="base"
          fontWeight="500"
          color={color('text-body')}
        >
          {abiFn.name}
        </Text>
      </Flex>
      {abiFn.access === 'read_only' && (
        <Badge ml="base" bg={color('bg')} border={border()} color={color('text-caption')}>
          {abiFn.access}
        </Badge>
      )}
    </Flex>
    <IconButton icon={ArrowRightIcon} />
  </Flex>
);

export const AvailableFunctionsView: FC<{
  contract: ContractWithParsedAbi;
  contractId: string;
}> = ({ contractId, contract }) => (
  <Section overflowY="auto" flexGrow={1} title="Available functions">
    {contract?.abi?.functions.map(
      (abiFn: any) =>
        abiFn.access !== 'private' && (
          <ExplorerLink
            path={`/sandbox/contract-call/${contractId}/${abiFn.name}`}
            key={abiFn.name}
          >
            <AbiFunction abiFn={abiFn} />
          </ExplorerLink>
        )
    )}
  </Section>
);
