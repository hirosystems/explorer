// @ts-nocheck
import React from 'react';

import { Box, BoxProps, color, Flex, Grid, Stack } from '@stacks/ui';

import { border, getContractName, truncateMiddle } from '@common/utils';
import { Caption, Title, Text } from '@components/typography';
import { Section } from '@components/section';
import pluralize from 'pluralize';
import { ItemIcon } from '@components/item-icon';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { AtomIcon } from '@components/icons/atom';
import ListStatusIcon from 'mdi-react/ListStatusIcon';
import { FungibleTokenIcon } from '@components/icons/fungible-token';
import { ExternalLinkIcon } from '@components/icons/external-link';
import { TxLink } from '@components/links';

const PluralizedItem: React.FC<BoxProps & { array: any[]; label: string }> = ({
  array,
  label,
  ...rest
}) => (
  <Text color={color('text-body')} fontSize="14px" {...rest}>
    {array.length} {pluralize(label, array.length)}
  </Text>
);

export const ContractDetails = ({ contractId, contractInterface }) => {
  return (
    <Section flexShrink={0} mb="extra-loose" minWidth="200px" title="Contract details">
      <Box px="base">
        <Flex borderBottom={border()} py="base" justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <ItemIcon size="48px" type="tx" txType="smart_contract" status="success" />
            <Box ml="base">
              <Title mb="tight" display="block" mt="0" as="h4">
                {getContractName(contractId)}
              </Title>
              <Caption display="block">{truncateMiddle(contractInterface?.tx_id, 8)}</Caption>
            </Box>
          </Flex>
        </Flex>
        <Stack spacing="tight" py="base">
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <FunctionIcon color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedItem ml="tight" array={contractInterface?.abi?.functions} label="function" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <AtomIcon color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedItem ml="tight" array={contractInterface?.abi?.variables} label="variable" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <ListStatusIcon color={color('text-caption')} size="20px" />
            </Box>
            <PluralizedItem ml="tight" array={contractInterface?.abi?.maps} label="map" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <FungibleTokenIcon color={color('text-caption')} strokeWidth={2} size="20px" />
            </Box>
            <PluralizedItem
              ml="tight"
              array={[
                ...contractInterface?.abi?.fungible_tokens,
                ...contractInterface?.abi?.non_fungible_tokens,
              ]}
              label="token"
            />
          </Flex>
        </Stack>
        <Grid borderTop={border()} placeItems="center" py="base">
          <TxLink txid={contractId}>
            <Flex
              as="a"
              target="_blank"
              color={color('text-caption')}
              _hover={{ color: color('text-body') }}
              alignItems="center"
            >
              <Caption transform="translateY(1px)" color="currentColor">
                View deployment
              </Caption>
              <ExternalLinkIcon ml="tight" color="currentColor" size="16px" />
            </Flex>
          </TxLink>
        </Grid>
      </Box>
    </Section>
  );
};
