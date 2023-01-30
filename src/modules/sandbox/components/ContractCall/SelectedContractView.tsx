import { mdiFunction, mdiListStatus } from '@mdi/js';
import Icon from '@mdi/react';
import NextLink from 'next/link';
import React, { FC } from 'react';
import { useHover } from 'use-events';

import { ClarityAbiFunction } from '@stacks/transactions';
import { Box, Flex, Grid, IconButton, Stack, color, transition } from '@stacks/ui';

import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { ContractWithParsedAbi } from '@common/types/contract';
import { border, truncateMiddle } from '@common/utils';

import { ArrowLeftIcon } from '@components/icons/arrow-left';
import { AtomIcon } from '@components/icons/atom';
import { ExternalLinkIcon } from '@components/icons/external-link';
import { FungibleTokenIcon } from '@components/icons/fungible-token';
import { ItemIcon } from '@components/item-icon';
import { TxLink, buildUrl } from '@components/links';
import { PluralizedCaption } from '@components/pluralized-caption';
import { Section } from '@components/section';
import { Caption, Title } from '@components/typography';

import { selectShowRightPanel } from '../../sandbox-slice';
import { Layout } from '../Layout';
import { AvailableFunctionsView } from './AvailableFunctionsView';
import { FunctionView } from './FunctionView';

const BackLink: React.FC<{ href: string }> = ({ href }) => {
  const [isHovered, bind] = useHover();
  return (
    <NextLink href={href} passHref>
      <Flex alignItems="center" mb="base" _hover={{ cursor: 'pointer' }} {...bind}>
        <IconButton mr="tight" icon={ArrowLeftIcon} isHovered={isHovered} />
        <Box
          color={isHovered ? color('text-body') : color('text-caption')}
          transform={isHovered ? 'none' : 'translateX(-8px)'}
          transition={transition}
          fontSize="14px"
        >
          Back to search
        </Box>
      </Flex>
    </NextLink>
  );
};

interface ContractInfoProps {
  contract: ContractWithParsedAbi;
}

const ContractInfo: FC<ContractInfoProps> = ({ contract: { contract_id, abi } }) => {
  return (
    <Section
      topRight={() => (
        <TxLink txid={contract_id}>
          <Flex
            as="a"
            target="_blank"
            color={color('text-caption')}
            _hover={{ color: color('text-body') }}
            alignItems="center"
          >
            <Caption transform="translateY(1px)" color="currentColor">
              Go to transaction
            </Caption>
            <ExternalLinkIcon ml="tight" color="currentColor" size="16px" />
          </Flex>
        </TxLink>
      )}
      flexShrink={0}
      mb="extra-loose"
      title="Contract details"
    >
      <Box>
        <Flex p="base" justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <ItemIcon size="64px" type="tx" />
            <Box ml="base">
              <Title mb="tight" display="block" mt="0" as="h3">
                {contract_id.split('.')[1]}
              </Title>
              <Caption display="block"> {truncateMiddle(contract_id.split('.')[0], 8)}</Caption>
            </Box>
          </Flex>
        </Flex>
        <Stack p="base">
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <Icon path={mdiFunction} color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedCaption ml="tight" array={abi?.functions} label="function" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <AtomIcon color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedCaption ml="tight" array={abi?.variables} label="variable" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <Icon path={mdiListStatus} color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedCaption ml="tight" array={abi?.maps} label="map" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <FungibleTokenIcon color={color('text-caption')} strokeWidth={2} size="20px" />
            </Box>
            <PluralizedCaption
              ml="tight"
              array={[...(abi?.fungible_tokens || []), ...(abi?.non_fungible_tokens || [])]}
              label="token"
            />
          </Flex>
        </Stack>
      </Box>
    </Section>
  );
};

export const SelectedContractView: FC<{
  contract: ContractWithParsedAbi;
  functionName?: string;
  contractId: string;
}> = ({ contract, functionName, contractId }) => {
  const network = useAppSelector(selectActiveNetwork);
  const showRightPanel = useAppSelector(selectShowRightPanel);
  const activeNetwork = useAppSelector(selectActiveNetwork);
  return (
    <Layout>
      <Grid
        minHeight="600px"
        width={showRightPanel ? 'calc((1142px / 3) * 2)' : '100%'}
        gridTemplateColumns={showRightPanel ? '1fr 1fr' : '1fr 2fr'}
        flexGrow={1}
        flexShrink={1}
      >
        <Box borderRight={border()} p="base">
          <BackLink href={buildUrl(`/sandbox/contract-call`, network)} />
          <ContractInfo contract={contract} />
        </Box>
        <Box overflow="auto" maxHeight="calc(100vh - 217px)" p="base">
          {functionName ? (
            <FunctionView
              contractId={contractId}
              fn={
                contract?.abi?.functions?.find(
                  (fn: any) => fn.name === functionName
                ) as unknown as ClarityAbiFunction
              }
              cancelButton={
                <NextLink
                  href={buildUrl(`/sandbox/contract-call/${contractId}`, activeNetwork)}
                  passHref
                >
                  <Caption _hover={{ cursor: 'pointer', color: color('text-title') }} mt="base">
                    Cancel
                  </Caption>
                </NextLink>
              }
            />
          ) : (
            <AvailableFunctionsView contract={contract} contractId={contractId} />
          )}
        </Box>
      </Grid>
    </Layout>
  );
};
