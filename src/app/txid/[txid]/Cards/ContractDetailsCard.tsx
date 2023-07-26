import { getContractName, truncateMiddle } from '@/common/utils';
import { TxLink } from '@/components/links';
import { Section } from '@/components/section';
import { TransactionQueryKeys, transactionQK } from '@/features/transaction/query-keys';
import { useTransactionQueries } from '@/features/transaction/use-transaction-queries';
import { Box, Circle, Flex, Grid, Icon, Stack } from '@/ui/components';
import { FunctionIcon } from '@/ui/icons';
import { Caption, Text, TextProps, Title } from '@/ui/typography';
import pluralize from 'pluralize';
import * as React from 'react';
import { BiAtom, BiLinkExternal } from 'react-icons/bi';
import { BsCodeSlash } from 'react-icons/bs';
import { MdOutlineChecklistRtl } from 'react-icons/md';
import { RxTokens } from 'react-icons/rx';
import { useQuery } from 'react-query';

const PluralizedItem: React.FC<TextProps & { array: any[]; label: string }> = ({
  array,
  label,
  ...rest
}) => (
  <Text color={'textBody'} fontSize="14px" {...rest}>
    {array.length} {pluralize(label, array.length)}
  </Text>
);

export const ContractDetailsCard: React.FC<{ contractId: string }> = ({ contractId }) => {
  const queries = useTransactionQueries();

  const { data: contract } = useQuery(
    transactionQK(TransactionQueryKeys.contract, contractId),
    queries.fetchContract(contractId),
    { enabled: !!contractId, suspense: false }
  );

  if (!contract) return null;

  return (
    <Section flexShrink={0} minWidth="200px" title="Contract details">
      <Box px="16px">
        <Flex borderBottomWidth="1px" py="16px" justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Circle>
              <Icon as={BsCodeSlash} color={'textTitle'} position="relative" size="16px" />
            </Circle>
            <Box ml="16px">
              <Title mb="8px" display="block" mt="0" as="h4">
                {getContractName(contractId)}
              </Title>
              <Caption display="block">{truncateMiddle(contract?.tx_id, 8)}</Caption>
            </Box>
          </Flex>
        </Flex>
        <Stack spacing="8px" py="16px">
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <FunctionIcon color={'textCaption'} size="20px" />
            </Box>
            <PluralizedItem ml="8px" array={contract?.abi?.functions || []} label="function" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <BiAtom color={'textCaption'} size="20px" />
            </Box>
            <PluralizedItem ml="8px" array={contract?.abi?.variables || []} label="variable" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <MdOutlineChecklistRtl color={'textCaption'} size="20px" />
            </Box>
            <PluralizedItem ml="8px" array={contract?.abi?.maps || []} label="map" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <RxTokens color={'textCaption'} size="20px" />
            </Box>
            <PluralizedItem
              ml="8px"
              array={[
                ...(contract?.abi?.fungible_tokens || []),
                ...(contract?.abi?.non_fungible_tokens || []),
              ]}
              label="token"
            />
          </Flex>
        </Stack>
        <Grid borderTopWidth="1px" placeItems="center" py="16px">
          <TxLink txId={contractId}>
            <Flex
              as="a"
              target="_blank"
              color={'accent'}
              textDecoration="none"
              _hover={{ textDecoration: 'underline' }}
              alignItems="center"
              gap={'8px'}
            >
              <Caption transform="translateY(1px)" color="currentColor">
                View deployment
              </Caption>
              <BiLinkExternal color={'textCaption'} size="16px" />
            </Flex>
          </TxLink>
        </Grid>
      </Box>
    </Section>
  );
};
