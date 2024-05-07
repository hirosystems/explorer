import { ArrowSquareOut, Atom, CirclesFour, Code, ListChecks } from '@phosphor-icons/react';
import pluralize from 'pluralize';
import { FC } from 'react';

import { Circle } from '../../../../common/components/Circle';
import { TxLink } from '../../../../common/components/ExplorerLinks';
import { Section } from '../../../../common/components/Section';
import { RightBoxSkeleton } from '../../../../common/components/loaders/RightBox';
import { useContractById } from '../../../../common/queries/useContractById';
import { getContractName, truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Grid } from '../../../../ui/Grid';
import { Icon } from '../../../../ui/Icon';
import { Stack } from '../../../../ui/Stack';
import { Text, TextProps } from '../../../../ui/Text';
import FunctionXIcon from '../../../../ui/icons/FunctionX';
import { Caption, Title } from '../../../../ui/typography';
import { ExplorerErrorBoundary } from '../../../_components/ErrorBoundary';

const PluralizedItem: FC<TextProps & { array: any[]; label: string }> = ({
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
  const { data: contract, isLoading } = useContractById(contractId);

  if (isLoading) return <RightBoxSkeleton />;

  if (!contract) return null;

  return (
    <Section flexShrink={0} minWidth="200px" title="Contract details">
      <Box px="16px">
        <Flex borderBottomWidth="1px" py="16px" justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Circle>
              <Icon as={Code} color={'textTitle'} position="relative" size={4} />
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
              <Icon as={FunctionXIcon} size={5} />
            </Box>
            <PluralizedItem ml="8px" array={contract?.abi?.functions || []} label="function" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <Atom size={5} />
            </Box>
            <PluralizedItem ml="8px" array={contract?.abi?.variables || []} label="variable" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <ListChecks size={5} />
            </Box>
            <PluralizedItem ml="8px" array={contract?.abi?.maps || []} label="map" />
          </Flex>
          <Flex alignItems="center">
            <Box opacity={0.6} size="20px">
              <CirclesFour size={5} />
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
              <ArrowSquareOut size={4} />
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
