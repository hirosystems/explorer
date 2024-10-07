import { useColorModeValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { UseQueryResult, useQueries, useQueryClient } from '@tanstack/react-query';
import React, { ReactNode, Suspense, useMemo, useState } from 'react';

import { AddressLink } from '../../common/components/ExplorerLinks';
import { Section } from '../../common/components/Section';
import { mobileBorderCss } from '../../common/constants/constants';
import { ApiResponseWithResultsOffset } from '../../common/types/api';
import { truncateMiddle } from '../../common/utils/utils';
import { Flex } from '../../ui/Flex';
import { Show } from '../../ui/Show';
import { Table } from '../../ui/Table';
import { Tbody } from '../../ui/Tbody';
import { Td } from '../../ui/Td';
import { Text } from '../../ui/Text';
import { Th } from '../../ui/Th';
import { Thead } from '../../ui/Thead';
import { Tr } from '../../ui/Tr';
import { ScrollableBox } from '../_components/BlockList/ScrollableDiv';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { removeStackingDaoFromName } from './SignerDistributionLegend';
import { SortByVotingPowerFilter, VotingPowerSortOrder } from './SortByVotingPowerFilter';
import { SignersStackersData, useGetStackersBySignerQuery } from './data/UseSignerAddresses';
import { SignerInfo, useSuspensePoxSigners } from './data/useSigners';
import { SignersTableSkeleton } from './skeleton';
import { getSignerKeyName } from './utils';

const StyledTable = styled(Table)`
  th {
    border-bottom: none;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const NUM_OF_ADDRESSES_TO_SHOW = 1;

export const SignersTableHeader = ({
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

export const signersTableHeaders = [
  '#',
  'Signer key',
  'Entity',
  'Associated address',
  'Voting power',
  'STX stacked',
];

export const SignersTableHeaders = () => (
  <Tr>
    {signersTableHeaders.map((header, i) => (
      <SignersTableHeader
        key={`signers-table-header-${header}`}
        headerTitle={header}
        isFirst={i === 0}
      />
    ))}
  </Tr>
);

function getEntityName(signerKey: string) {
  const entityName = removeStackingDaoFromName(getSignerKeyName(signerKey));
  return entityName === 'unknown' ? '-' : entityName;
}

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
      <Td py={3} px={6} sx={mobileBorderCss}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          {index + 1}
        </Text>
      </Td>

      <Td py={3} px={6}>
        <Text fontSize="sm" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          <Show above="lg">{truncateMiddle(signerKey)}</Show>
          <Show below="lg">{truncateMiddle(signerKey)}</Show>
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          {getEntityName(signerKey)}
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Flex textOverflow="ellipsis" overflow="hidden">
          {stackers.slice(0, NUM_OF_ADDRESSES_TO_SHOW).map((stacker, index) => (
            <React.Fragment key={stacker.stacker_address}>
              <AddressLink
                principal={stacker.stacker_address}
                whiteSpace="nowrap"
                fontSize="sm"
                color="textSubdued"
              >
                {truncateMiddle(stacker.stacker_address, 5, 5)}
              </AddressLink>
              {index < stackers.length - 1 && (
                <Text color="textSubdued" fontSize="sm">
                  ,&nbsp;
                </Text>
              )}
              {stackers && stackers.length > NUM_OF_ADDRESSES_TO_SHOW ? (
                <Text color="textSubdued" fontSize="sm">
                  &nbsp;+{stackers.length - NUM_OF_ADDRESSES_TO_SHOW}&nbsp;more
                </Text>
              ) : null}
            </React.Fragment>
          ))}
        </Flex>
      </Td>
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {`${votingPower.toFixed(2)}%`}
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {Number(stxStaked.toFixed(0)).toLocaleString()}
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
      <ScrollableBox>
        <StyledTable width="full">
          <Thead>{signersTableHeaders}</Thead>
          <Tbody>{signersTableRows}</Tbody>
        </StyledTable>
      </ScrollableBox>
    </Section>
  );
}
interface SignerRowInfo {
  signerKey: string;
  votingPowerPercentage: number;
  stxStaked: number;
  stackers: SignersStackersData[];
}

function formatSignerRowData(
  singerInfo: SignerInfo,
  stackers: SignersStackersData[]
): SignerRowInfo {
  return {
    signerKey: singerInfo.signing_key,
    votingPowerPercentage: singerInfo.weight_percent,
    stxStaked: parseFloat(singerInfo.stacked_amount) / 1_000_000,
    stackers,
  };
}

const SignersTableBase = () => {
  const [votingPowerSortOrder, setVotingPowerSortOrder] = useState(VotingPowerSortOrder.Desc);
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

  return (
    <SignersTableLayout
      votingPowerSortOrder={votingPowerSortOrder}
      setVotingPowerSortOrder={setVotingPowerSortOrder}
      numSigners={<Text fontWeight="medium">{signersData.length} Active Signers</Text>}
      signersTableHeaders={<SignersTableHeaders />}
      signersTableRows={signersData.map((signer, i) => (
        <SignerTableRow
          key={`signers-table-row-${signer.signerKey}`}
          index={i}
          {...signersData[i]}
          isFirst={i === 0}
          isLast={i === signers.length - 1}
        />
      ))}
    />
  );
};

const SignerTable = () => {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        title: 'Signers',
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <Suspense fallback={<SignersTableSkeleton />}>
        <SignersTableBase />
      </Suspense>
    </ExplorerErrorBoundary>
  );
};

export default SignerTable;
