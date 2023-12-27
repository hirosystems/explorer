import pluralize from 'pluralize';
import * as React from 'react';
import { BiAtom, BiLinkExternal } from 'react-icons/bi';
import { BsCodeSlash } from 'react-icons/bs';
import { MdOutlineChecklistRtl } from 'react-icons/md';
import { RxTokens } from 'react-icons/rx';

import { Circle } from '../../../../common/components/Circle';
import { TxLink } from '../../../../common/components/ExplorerLinks';
import { Section } from '../../../../common/components/Section';
import { useSuspenseContractById } from '../../../../common/queries/useContractById';
import { getContractName, truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Grid } from '../../../../ui/Grid';
import { Icon } from '../../../../ui/Icon';
import { Stack } from '../../../../ui/Stack';
import { Text, TextProps } from '../../../../ui/Text';
import { FunctionIcon } from '../../../../ui/icons';
import { Caption, Title } from '../../../../ui/typography';
import { ExplorerErrorBoundary } from '../../../_components/ErrorBoundary';

const PluralizedItem: React.FC<TextProps & { array: any[]; label: string }> = ({
  array,
  label,
  ...rest
}) => (
  <Text fontSize="14px" {...rest}>
    {array.length} {pluralize(label, array.length)}
  </Text>
);

interface ContractDetailsCardProps {
  contractId: string;
}

function ContractDetailsCardBase({ contractId }: ContractDetailsCardProps) {
  const { data: contract } = useSuspenseContractById(contractId);

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
        <Stack gap={2} py="16px">
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <FunctionIcon size="20px" />
            </Box>
            <PluralizedItem ml="8px" array={contract?.abi?.functions || []} label="function" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <BiAtom size="20px" />
            </Box>
            <PluralizedItem ml="8px" array={contract?.abi?.variables || []} label="variable" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <MdOutlineChecklistRtl size="20px" />
            </Box>
            <PluralizedItem ml="8px" array={contract?.abi?.maps || []} label="map" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <RxTokens size="20px" />
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
          <TxLink txId={contractId} target="_blank" color={'accent'}>
            <Flex alignItems="center" gap={'8px'}>
              <Caption transform="translateY(1px)" color="currentColor">
                View deployment
              </Caption>
              <BiLinkExternal size="16px" />
            </Flex>
          </TxLink>
        </Grid>
      </Box>
    </Section>
  );
}

export function ContractDetailsCard(props: ContractDetailsCardProps) {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{ title: 'Contract details', flexShrink: 0, minWidth: '200px' }}
      tryAgainButton
    >
      <ContractDetailsCardBase {...props} />
    </ExplorerErrorBoundary>
  );
}
