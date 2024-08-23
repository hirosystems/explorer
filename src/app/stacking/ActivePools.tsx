import { Box } from '@/ui/Box';
import { useColorModeValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ReactNode, Suspense, useMemo } from 'react';

import { Section } from '../../common/components/Section';
import { Flex } from '../../ui/Flex';
import { Table } from '../../ui/Table';
import { Tbody } from '../../ui/Tbody';
import { Td } from '../../ui/Td';
import { Text } from '../../ui/Text';
import { Th } from '../../ui/Th';
import { Thead } from '../../ui/Thead';
import { Tr } from '../../ui/Tr';
import { ScrollableBox } from '../_components/BlockList/ScrollableDiv';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { mobileBorderCss } from '../signers/consts';
import { useSuspensePoxSigners } from '../signers/data/useSigners';
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { useQueryClient } from '@tanstack/react-query';
import { useGetStackersBySignerQuery } from '../signers/data/UseSignerAddresses';

const StyledTable = styled(Table)`
  th {
    border-bottom: none;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const NUM_OF_ADDRESSES_TO_SHOW = 1;

export const ActivePoolsTableHeader = ({
  headerTitle,
  isFirst,
}: {
  headerTitle: string;
  isFirst: boolean;
}) => (
  <Th py={3} px={6} border="none" sx={isFirst ? mobileBorderCss : {}} width="fit-content">
    <Flex
      bg="hoverBackground"
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

export const activePoolsTableHeaders = [
  'Provider',
  'PoX address',
  'Contract',
  'Rewards in ',
  'Users delegating',
  'Amount stacked',
  'Rewards',
];

export const ActivePoolsTableHeaders = () => (
  <Tr>
    {activePoolsTableHeaders.map((header, i) => (
      <ActivePoolsTableHeader
        key={`activePools-table-header-${header}`}
        headerTitle={header}
        isFirst={i === 0}
      />
    ))}
  </Tr>
);

const ActivePoolsTableRow = ({
  index,
  isFirst,
  isLast,
  provider,
  poxAddress,
  contract,
  rewardsIn,
  usersDelegating,
  amountStacked,
  rewards,
}: {
  index: number;
  isFirst: boolean;
  isLast: boolean;
} & ActivePoolsRowInfo) => {
  return (
    <Tr
      style={{
        borderTop: isFirst ? 'none' : '',
        borderBottom: isLast ? 'none' : '',
      }}
    >
      <Td py={3} px={6} sx={mobileBorderCss}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          {provider}
        </Text>
      </Td>
      <Td py={3} px={6} sx={mobileBorderCss}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          {poxAddress}
        </Text>
      </Td>
      <Td py={3} px={6} sx={mobileBorderCss}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          {contract}
        </Text>
      </Td>
      <Td py={3} px={6} sx={mobileBorderCss}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          {rewardsIn}
        </Text>
      </Td>
      <Td py={3} px={6} sx={mobileBorderCss}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          {usersDelegating}
        </Text>
      </Td>
      <Td py={3} px={6} sx={mobileBorderCss}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          {amountStacked}
        </Text>
      </Td>

      <Td py={3} px={6} sx={mobileBorderCss}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          {rewards}
        </Text>
      </Td>
    </Tr>
  );
};

export function ActivePoolsTableLayout({
  activePoolsTableHeaders,
  activePoolsTableRows,
}: {
  activePoolsTableHeaders: ReactNode;
  activePoolsTableRows: ReactNode;
}) {
  return (
    <Section>
      <ScrollableBox>
        <StyledTable width="full">
          <Thead>{activePoolsTableHeaders}</Thead>
          <Tbody>{activePoolsTableRows}</Tbody>
        </StyledTable>
      </ScrollableBox>
    </Section>
  );
}
interface ActivePoolsRowInfo {
  provider: string;
  poxAddress: string;
  contract: string;
  rewardsIn: string;
  usersDelegating: string;
  amountStacked: string;
  rewards: string;
}

const ActivePoolsTableBase = () => {
  const { currentCycleId } = useSuspenseCurrentStackingCycle();

  const {
    data: { results: signers },
  } = useSuspensePoxSigners(currentCycleId);

  if (!signers) {
    throw new Error('Signers data is not available');
  }


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
  const signersData = useMemo(
    () =>
      signers
        .map((signer, index) => {
          return {
            ...formatSignerRowData(signer, signersStackers[index]),
          };
        })
        .sort((a, b) =>
          votingPowerSortOrder === 'desc'
            ? b.votingPowerPercentage - a.votingPowerPercentage
            : a.votingPowerPercentage - b.votingPowerPercentage
        ),
    [signers, signersStackers, votingPowerSortOrder]
  );


  console.log({ signers });
  
  const activePoolFakeData = {
    provider: 'Xverse',
    poxAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    contract: 'xverse-pool-contract',
    rewardsIn: 'BTC',
    usersDelegating: '5,684',
    amountStacked: '118,432,860.02 STX ($12.3M)',
    rewards: '2,325 BTC',
  };

  const data = [
    activePoolFakeData,
    activePoolFakeData,
    activePoolFakeData,
    activePoolFakeData,
    activePoolFakeData,
    activePoolFakeData,
    activePoolFakeData,
  ];

  if (!data) {
    throw new Error('Active pools data is not available');
  }

  return (
    <ActivePoolsTableLayout
      activePoolsTableHeaders={<ActivePoolsTableHeaders />}
      activePoolsTableRows={data.map((ap, i) => (
        <ActivePoolsTableRow
          key={`active-pools-table-row-${ap.provider}`}
          index={i}
          {...data[i]}
          isFirst={i === 0}
          isLast={i === data.length - 1}
        />
      ))}
    />
  );
};

const ActivePoolsTable = () => {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        title: 'Active Pools',
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <Suspense fallback={<Box>No skeleton rn</Box>}>
        <ActivePoolsTableBase />
      </Suspense>
    </ExplorerErrorBoundary>
  );
};

export default ActivePoolsTable;
