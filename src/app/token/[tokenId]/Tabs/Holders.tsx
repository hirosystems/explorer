import { ListFooter } from '@/common/components/ListFooter';
import { useColorModeValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ReactNode, Suspense } from 'react';

import { ScrollableBox } from '../../../../app/_components/BlockList/ScrollableDiv';
import { mobileBorderCss } from '../../../../app/_components/BlockList/consts';
import { ExplorerErrorBoundary } from '../../../../app/_components/ErrorBoundary';
import { Section } from '../../../../common/components/Section';
import { truncateMiddle } from '../../../../common/utils/utils';
import { Flex } from '../../../../ui/Flex';
import { Table } from '../../../../ui/Table';
import { Tbody } from '../../../../ui/Tbody';
import { Td } from '../../../../ui/Td';
import { Text } from '../../../../ui/Text';
import { Th } from '../../../../ui/Th';
import { Thead } from '../../../../ui/Thead';
import { Tr } from '../../../../ui/Tr';
import { useSuspenseFtHolders } from './data/useHolders';

const StyledTable = styled(Table)`
  th {
    border-bottom: none;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

export const HoldersTableHeader = ({
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

export const holdersTableHeaders = ['#', 'Address', 'Quantity', 'Percentage', 'Value'];

export const HoldersTableHeaders = () => (
  <Tr>
    {holdersTableHeaders.map((header, i) => (
      <HoldersTableHeader
        key={`holders-table-header-${header}`}
        headerTitle={header}
        isFirst={i === 0}
      />
    ))}
  </Tr>
);

interface HolderRowInfo {
  address: string;
  balance: string;
  percentage: string;
  value: string;
}

function generateHolderRowInfo(
  address: string,
  balance: number,
  totalSupply: number,
  tokenPrice: number | null
): HolderRowInfo {
  return {
    address,
    balance: balance.toLocaleString(),
    percentage: `${((balance / totalSupply) * 100).toFixed(2).toLocaleString()}%`,
    value:
      typeof tokenPrice === 'number' ? (balance * tokenPrice).toFixed(2).toLocaleString() : 'N/A',
  };
}

const HolderTableRow = ({
  index,
  isFirst,
  isLast,
  address,
  balance,
  percentage,
  value,
}: {
  index: number;
  isFirst: boolean;
  isLast: boolean;
} & HolderRowInfo) => {
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
          {truncateMiddle(address)}
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {balance}
        </Text>
      </Td>

      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {percentage}
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {value}
        </Text>
      </Td>
    </Tr>
  );
};

export function HoldersTableLayout({
  numHolders,
  holdersTableHeaders,
  holdersTableRows,
}: {
  numHolders: ReactNode;
  holdersTableHeaders: ReactNode;
  holdersTableRows: ReactNode;
}) {
  return (
    <Section title={numHolders}>
      <ScrollableBox>
        <StyledTable width="full">
          <Thead>{holdersTableHeaders}</Thead>
          <Tbody>{holdersTableRows}</Tbody>
        </StyledTable>
      </ScrollableBox>
    </Section>
  );
}

const HoldersTableBase = ({
  tokenId,
  tokenPrice,
}: {
  tokenId: string;
  tokenPrice: number | null;
}) => {
  const {
    data: { results: holderBalances, total: totalNumHolders, total_supply: totalSupply },
  } = useSuspenseFtHolders(tokenId);

  if (!holderBalances || !totalNumHolders || !totalSupply) {
    throw new Error('Holders data is not available');
  }

  return (
    <>
      <HoldersTableLayout
        numHolders={<Text fontWeight="medium">{totalNumHolders.toLocaleString()} Holders</Text>}
        holdersTableHeaders={<HoldersTableHeaders />}
        holdersTableRows={holderBalances.map((holder, i) => {
          const { address, balance } = holder;
          return (
            <HolderTableRow
              key={`holders-table-row-${address}`}
              index={i}
              {...generateHolderRowInfo(
                address,
                parseInt(balance),
                parseInt(totalSupply),
                tokenPrice
              )}
              isFirst={i === 0}
              isLast={i === holderBalances.length - 1}
            />
          );
        })}
      />
      <ListFooter
        isLoading={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        label={'blocks'}
      />
    </>
  );
};

const HoldersTable = ({ tokenId, tokenPrice }: { tokenId: string; tokenPrice: number | null }) => {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        title: 'Holders',
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      {/* TODO: create HoldersTableSkelelton */}
      {/* <Suspense fallback={<HoldersTableSkeleton />}> */}
      <Suspense fallback={<Text>Skeleton placeholder</Text>}>
        <HoldersTableBase tokenId={tokenId} tokenPrice={tokenPrice} />
      </Suspense>
    </ExplorerErrorBoundary>
  );
};

export default HoldersTable;
