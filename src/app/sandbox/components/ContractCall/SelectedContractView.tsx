'use client';

import { buildUrl } from '@/app/common/utils/buildUrl';
import { useGlobalContext } from '@/common/context/useAppContext';
import { useAppSelector } from '@/common/state/hooks';
import { ContractWithParsedAbi } from '@/common/types/contract';
import { truncateMiddle } from '@/common/utils';
import { ArrowLeftIcon } from '@/components/icons/arrow-left';
import { FungibleTokenIcon } from '@/components/icons/fungible-token';
import { TxLink } from '@/components/links';
import { PluralizedCaption } from '@/components/pluralized-caption';
import { Section } from '@/components/section';
import { Box, Flex, Grid, Icon, Stack } from '@/ui/components';
import { FunctionIcon } from '@/ui/icons';
import { Caption, Title } from '@/ui/typography';
import NextLink from 'next/link';
import React, { FC } from 'react';
import { BiAtom, BiLinkExternal } from 'react-icons/bi';
import { MdOutlineChecklistRtl } from 'react-icons/md';

import { ClarityAbiFunction } from '@stacks/transactions';

import { TxIcon } from '../../../common/components/TxIcon';
import { selectShowRightPanel } from '../../sandbox-slice';
import { AvailableFunctionsView } from './AvailableFunctionsView';
import { FunctionView } from './FunctionView';

const BackLink: React.FC<{ href: string }> = ({ href }) => {
  return (
    <NextLink href={href} passHref>
      <Flex alignItems="center" mb="16px" _hover={{ cursor: 'pointer' }}>
        <ArrowLeftIcon mr={'8px'} width={18} />
        <Box color={'textBody'} transform={'none'} fontSize="14px">
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
      topRight={
        <TxLink txId={contract_id}>
          <Flex
            as="a"
            target="_blank"
            color={'textCaption'}
            _hover={{ color: 'textBody' }}
            alignItems="center"
          >
            <Caption transform="translateY(1px)" color="currentColor">
              Go to transaction
            </Caption>
            <Icon as={BiLinkExternal} ml="8px" color="currentColor" size="16px" />
          </Flex>
        </TxLink>
      }
      flexShrink={0}
      mb="32px"
      title="Contract details"
    >
      <Box>
        <Flex p="16px" justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <TxIcon size="64px" />
            <Box ml="16px">
              <Title mb="8px" display="block" mt="0" as="h3">
                {contract_id.split('.')[1]}
              </Title>
              <Caption display="block"> {truncateMiddle(contract_id.split('.')[0], 8)}</Caption>
            </Box>
          </Flex>
        </Flex>
        <Stack p="16px">
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <Icon as={FunctionIcon} color={'textCaption'} size="20px" />
            </Box>
            <PluralizedCaption ml="8px" array={abi?.functions} label="function" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <Icon as={BiAtom} color={'textCaption'} size="20px" />
            </Box>
            <PluralizedCaption ml="8px" array={abi?.variables} label="variable" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <Icon as={MdOutlineChecklistRtl} color={'textCaption'} size="20px" />
            </Box>
            <PluralizedCaption ml="8px" array={abi?.maps} label="map" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <Icon as={FungibleTokenIcon} color={'textCaption'} size="20px" />
            </Box>
            <PluralizedCaption
              ml="8px"
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
  const network = useGlobalContext().activeNetwork;
  const showRightPanel = useAppSelector(selectShowRightPanel);
  const activeNetwork = useGlobalContext().activeNetwork;
  return (
    <Grid
      minHeight="600px"
      width={showRightPanel ? 'calc((1142px / 3) * 2)' : '100%'}
      gridTemplateColumns={showRightPanel ? '1fr 1fr' : '1fr 2fr'}
      flexGrow={1}
      flexShrink={1}
    >
      <Box borderRightWidth="1px" p="16px">
        <BackLink href={buildUrl(`/sandbox/contract-call`, network)} />
        <ContractInfo contract={contract} />
      </Box>
      <Box overflow="auto" maxHeight="calc(100vh - 217px)" p="16px">
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
                <Caption _hover={{ cursor: 'pointer', color: 'textTitle' }} mt="16px">
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
  );
};
