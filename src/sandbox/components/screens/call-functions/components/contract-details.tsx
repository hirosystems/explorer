import { Section } from '@components/section';
import { TxLink } from '@components/links';
import { Box, color, Flex, Grid, Stack } from '@stacks/ui';
import { Caption, Title } from '@components/typography';
import { ExternalLinkIcon } from '@components/icons/external-link';
import { ItemIcon } from '@components/item-icon';
import { truncateMiddle } from '@common/utils';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { AtomIcon } from '@components/icons/atom';
import ListStatusIcon from 'mdi-react/ListStatusIcon';
import { FungibleTokenIcon } from '@components/icons/fungible-token';
import React from 'react';
import { useContractInterface } from '@sandbox/components/screens/call-functions/components/use-contract-interface';
import { PluralizedCaption } from '@components/pluralized-caption';

export const CalledContractDetails = () => {
  const [contractInterface, contractId] = useContractInterface();
  return contractInterface ? (
    <Section
      topRight={() => (
        <TxLink txid={contractId}>
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
            <ItemIcon size="64px" type="tx" txType="smart_contract" status="success" />
            <Box ml="base">
              <Title mb="tight" display="block" mt="0" as="h3">
                {contractId.split('.')[1]}
              </Title>
              <Caption display="block"> {truncateMiddle(contractId.split('.')[0], 8)}</Caption>
            </Box>
          </Flex>
        </Flex>
        <Stack p="base">
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <FunctionIcon color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedCaption
              ml="tight"
              array={contractInterface?.abi?.functions}
              label="function"
            />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <AtomIcon color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedCaption
              ml="tight"
              array={contractInterface?.abi?.variables}
              label="variable"
            />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <ListStatusIcon color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedCaption ml="tight" array={contractInterface?.abi?.maps} label="map" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <FungibleTokenIcon color={color('text-caption')} strokeWidth={2} size="20px" />
            </Box>
            <PluralizedCaption
              ml="tight"
              array={[
                ...(contractInterface?.abi?.fungible_tokens || []),
                ...(contractInterface?.abi?.non_fungible_tokens || []),
              ]}
              label="token"
            />
          </Flex>
        </Stack>
      </Box>
    </Section>
  ) : null;
};
