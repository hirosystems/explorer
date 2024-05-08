import { useColorModeValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { UseQueryResult, useQueries, useQueryClient } from '@tanstack/react-query';
import { ReactNode, useMemo, useState } from 'react';

import { AddressLink } from '../../common/components/ExplorerLinks';
import { Section } from '../../common/components/Section';
import { ApiResponseWithResultsOffset } from '../../common/types/api';
import { truncateMiddle } from '../../common/utils/utils';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { HStack } from '../../ui/HStack';
import { Show } from '../../ui/Show';
import { Table } from '../../ui/Table';
import { Tbody } from '../../ui/Tbody';
import { Td } from '../../ui/Td';
import { Text } from '../../ui/Text';
import { Th } from '../../ui/Th';
import { Thead } from '../../ui/Thead';
import { Tr } from '../../ui/Tr';
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { ProgressBar } from './ProgressBar';
import { SortByVotingPowerFilter, VotingPowerSortOrder } from './SortByVotingPowerFilter';
import { SignersStackersData, useGetStackersBySignerQuery } from './data/UseSignerAddresses';
import { SignerInfo, useSuspensePoxSigners } from './data/useSigners';

const StyledTable = styled(Table)`
  th {
    border: none;
  }

  tr:last-child td {
    border: none;
  }
`;

export const SignersTableHeader = ({ headerTitle }: { headerTitle: string }) => (
  <Th py={3} px={6} border="none">
    <Flex
      bg="dropdownBgHover"
      px={2.5}
      py={2}
      borderRadius="md"
      justifyContent="center"
      alignItems="center"
      width="fit-content"
    >
      <Text
        fontWeight="medium"
        whiteSpace="nowrap"
        fontSize="xs"
        color={useColorModeValue('slate.700', 'slate.250')}
        textTransform="none"
        letterSpacing="normal"
      >
        {headerTitle}
      </Text>
    </Flex>
  </Th>
);

export const signersTableHeaders = [
  '#',
  'Signer key',
  'Associated address',
  'Voting power',
  'STX staked',
];

export const SignersTableHeaders = () => (
  <Tr>
    {signersTableHeaders.map(header => (
      <SignersTableHeader key={`signers-table-header-${header}`} headerTitle={header} />
    ))}
  </Tr>
);

const SignerTableRow = ({
  index,
  isFirst,
  isLast,
  signerKey,
  votingPowerPercentage: votingPower,
  stxStaked,
  stackers,
}: {
  index: number;
  isFirst: boolean;
  isLast: boolean;
} & SignerRowInfo) => {
  return (
    <Tr
      style={{
        borderTop: isFirst ? 'none' : '',
        borderBottom: isLast ? 'none' : '',
      }}
    >
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          {index}
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Text fontSize="sm" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          <Show above="lg">{truncateMiddle(signerKey)}</Show>
          <Show below="lg">{truncateMiddle(signerKey)}</Show>
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Flex textOverflow="ellipsis" overflow="hidden">
          {stackers?.map((stacker, index) => (
            <AddressLink
              key={index}
              principal={stacker.stacker_address}
              whiteSpace="nowrap"
              fontSize="sm"
              color="secondaryText"
            >
              {truncateMiddle(stacker.stacker_address)}
            </AddressLink>
          ))}
        </Flex>
      </Td>
      <Td py={3} px={6}>
        <HStack flexWrap="nowrap">
          <Box display={['none', 'none', 'none', 'block']} height="12px" width="100%">
            <ProgressBar progressPercentage={votingPower} />
          </Box>
          <Text whiteSpace="nowrap" fontSize="sm" color="secondaryText">
            {`${votingPower.toFixed(2)}%`}
          </Text>
        </HStack>
      </Td>
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {stxStaked}
        </Text>
      </Td>
    </Tr>
  );
};

export function SignersTableLayout({
  numSigners,
  signersTableHeaders,
  signersTableRows,
  votingPowerSortOrder,
  setVotingPowerSortOrder,
}: {
  numSigners: ReactNode;
  signersTableHeaders: ReactNode;
  signersTableRows: ReactNode;
  votingPowerSortOrder: VotingPowerSortOrder;
  setVotingPowerSortOrder: (order: VotingPowerSortOrder) => void;
}) {
  return (
    <Section
      title={numSigners}
      topRight={
        <SortByVotingPowerFilter
          setVotingPowerSortOrder={setVotingPowerSortOrder}
          votingPowerSortOrder={votingPowerSortOrder}
        />
      }
    >
      <Box overflowX={'auto'}>
        <StyledTable width="full">
          <Thead>{signersTableHeaders}</Thead>
          <Tbody>{signersTableRows}</Tbody>
        </StyledTable>
      </Box>
    </Section>
  );
}
interface SignerRowInfo {
  signerKey: string;
  votingPowerPercentage: number;
  stxStaked: string;
  stackers: SignersStackersData[];
}

function formatSignerRowData(
  singerInfo: SignerInfo,
  stackers: SignersStackersData[]
): SignerRowInfo {
  return {
    signerKey: singerInfo.signing_key,
    votingPowerPercentage: singerInfo.weight_percent,
    stxStaked: parseFloat(singerInfo.stacked_amount).toLocaleString(),
    stackers,
  };
}

const SignerTable = () => {
  const [votingPowerSortOrder, setVotingPowerSortOrder] = useState(VotingPowerSortOrder.Desc);
  const { currentCycleId } = useSuspenseCurrentStackingCycle();

  const {
    data: { results: signers },
  } = useSuspensePoxSigners(currentCycleId);
  const queryClient = useQueryClient();
  const getQuery = useGetStackersBySignerQuery();
  const signersStackersQueries = useMemo(() => {
    return {
      queries: signers.map(signer => {
        return getQuery(currentCycleId, signer.signing_key);
      }),
      combine: (
        response: UseQueryResult<ApiResponseWithResultsOffset<SignersStackersData>, Error>[]
      ) => response.map(r => r.data?.results ?? []),
    };
  }, [signers, getQuery, currentCycleId]);
  const signersStackers = useQueries(signersStackersQueries, queryClient);
  const signersData = signers.map((signer, index) => {
    return {
      ...formatSignerRowData(signer, signersStackers[index]),
    };
  });

  return (
    <SignersTableLayout
      votingPowerSortOrder={votingPowerSortOrder}
      setVotingPowerSortOrder={setVotingPowerSortOrder}
      numSigners={<Text fontWeight="medium">40 Active Signers</Text>}
      signersTableHeaders={<SignersTableHeaders />}
      signersTableRows={signers
        .sort((a, b) =>
          votingPowerSortOrder === 'desc'
            ? b.weight_percent - a.weight_percent
            : a.weight_percent - b.weight_percent
        )
        .map((signer, i) => (
          <SignerTableRow
            key={`signers=table-row-${i}`}
            index={i}
            {...signersData[i]}
            isFirst={i === 0}
            isLast={i === signers.length - 1}
          />
        ))}
    />
  );
};

export default SignerTable;
