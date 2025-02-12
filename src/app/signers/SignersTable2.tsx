import { ColumnDefinition, Table } from '@/common/components/table/Table';
import { UseQueryResult, useQueries, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';

import { AddressLink } from '../../common/components/ExplorerLinks';
import { ApiResponseWithResultsOffset } from '../../common/types/api';
import { truncateMiddle } from '../../common/utils/utils';
import { Flex } from '../../ui/Flex';
import { Text } from '../../ui/Text';
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { removeStackingDaoFromName } from './SignerDistributionLegend';
import { SortByVotingPowerFilter, VotingPowerSortOrder } from './SortByVotingPowerFilter';
import { SignersStackersData, useGetStackersBySignerQuery } from './data/UseSignerAddresses';
import { SignerInfo, useSuspensePoxSigners } from './data/useSigners';
import { getSignerKeyName } from './utils';

const NUM_OF_ADDRESSES_TO_SHOW = 1;

function getEntityName(signerKey: string) {
  const entityName = removeStackingDaoFromName(getSignerKeyName(signerKey));
  return entityName === 'unknown' ? '-' : entityName;
}

enum SignerColumnIndex {
  Index = 0,
  SignerKey = 1,
  Entity = 2,
  AssociatedAddress = 3,
  VotingPower = 4,
  StxStaked = 5,
}

type SignerRowTypes = {
  [SignerColumnIndex.Index]: number;
  [SignerColumnIndex.SignerKey]: string;
  [SignerColumnIndex.Entity]: string;
  [SignerColumnIndex.AssociatedAddress]: SignersStackersData[];
  [SignerColumnIndex.VotingPower]: number;
  [SignerColumnIndex.StxStaked]: number;
};

// Update your SignerRow type to be more type-safe
type SignerRow = [
  SignerRowTypes[SignerColumnIndex.Index],
  SignerRowTypes[SignerColumnIndex.SignerKey],
  SignerRowTypes[SignerColumnIndex.Entity],
  SignerRowTypes[SignerColumnIndex.AssociatedAddress],
  SignerRowTypes[SignerColumnIndex.VotingPower],
  SignerRowTypes[SignerColumnIndex.StxStaked],
];

function formatSignerRowData(
  index: number,
  singerInfo: SignerInfo,
  stackers: SignersStackersData[]
): SignerRow {
  return [
    index, // index TODO: find some way to be able to map each column to an index
    singerInfo.signing_key, // signerKey
    singerInfo.signing_key, // signerKey
    stackers, // associatedAddress
    singerInfo.weight_percent, // votingPower
    parseFloat(singerInfo.stacked_amount) / 1_000_000, // stxStaked
  ];
}

export const columnDefinitions: ColumnDefinition[] = [
  {
    id: 'index',
    header: '#',
    accessor: (val: SignerRowTypes[SignerColumnIndex.Index]) => val,
  },
  {
    id: 'signerKey',
    header: 'Signer key',
    accessor: (val: SignerRowTypes[SignerColumnIndex.SignerKey]) => val,
    sortable: true,
  },
  {
    id: 'entity',
    header: 'Entity',
    accessor: (val: SignerRowTypes[SignerColumnIndex.Entity]) => getEntityName(val),
    sortable: true,
  },
  {
    id: 'associatedAddress',
    header: 'Associated address',
    accessor: (val: SignerRowTypes[SignerColumnIndex.AssociatedAddress]) => val,
    cellRenderer: (stackers: SignersStackersData[] | undefined) => (
      <Flex textOverflow="ellipsis" overflow="hidden">
        {stackers?.slice(0, NUM_OF_ADDRESSES_TO_SHOW).map((stacker, index) => (
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
            {stackers.length > NUM_OF_ADDRESSES_TO_SHOW ? (
              <Text color="textSubdued" fontSize="sm">
                &nbsp;+{stackers.length - NUM_OF_ADDRESSES_TO_SHOW}&nbsp;more
              </Text>
            ) : null}
          </React.Fragment>
        ))}
      </Flex>
    ),
  },
  {
    id: 'votingPower',
    header: 'Voting power',
    accessor: (val: SignerRowTypes[SignerColumnIndex.VotingPower]) => `${val?.toFixed(2)}%`,
    sortable: true,
  },
  {
    id: 'stxStaked',
    header: 'STX stacked',
    accessor: (val: SignerRowTypes[SignerColumnIndex.StxStaked]) =>
      Number(val?.toFixed(0)).toLocaleString(),
    sortable: true,
  },
];

export function SignerTable2() {
  const [votingPowerSortOrder, setVotingPowerSortOrder] = useState(VotingPowerSortOrder.Desc);
  const { currentCycleId } = useSuspenseCurrentStackingCycle();

  // Get signers
  const {
    data: { results: signers },
  } = useSuspensePoxSigners(currentCycleId);

  if (!signers) {
    throw new Error('Signers data is not available');
  }

  // Get signers' stackers
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

  // Format signers data + sort
  const signersData = useMemo(
    () =>
      signers
        .map((signer, index) => formatSignerRowData(index, signer, signersStackers[index]))
        .sort((a, b) => {
          const aVotingPower = a[4];
          const bVotingPower = b[4];
          return votingPowerSortOrder === 'desc'
            ? bVotingPower - aVotingPower
            : aVotingPower - bVotingPower;
        }),
    [signers, signersStackers, votingPowerSortOrder]
  );

  return (
    <Table
      title="Signers"
      rowData={signersData}
      columnDefinitions={columnDefinitions}
      onSort={() => {}}
      sortColumn={null}
      sortDirection={undefined}
      topRight={
        <SortByVotingPowerFilter
          setVotingPowerSortOrder={setVotingPowerSortOrder}
          votingPowerSortOrder={votingPowerSortOrder}
        />
      }
    />
  );
}
