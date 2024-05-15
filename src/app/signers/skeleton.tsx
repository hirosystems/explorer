'use client';

import { Box, extendTheme } from '@chakra-ui/react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { Card } from '../../common/components/Card';
import { Flex } from '../../ui/Flex';
import { SkeletonCircle } from '../../ui/SkeletonCircle';
import { SkeletonItem } from '../../ui/SkeletonItem';
import { SkeletonText } from '../../ui/SkeletonText';
import { Td } from '../../ui/Td';
import { Th } from '../../ui/Th';
import { Tr } from '../../ui/Tr';
import { PageTitle } from '../_components/PageTitle';
import { SkeletonStatSection } from '../_components/Stats/SkeletonStatSection';
import { SignersHeaderLayout } from './SignersHeader';
import { SignersTableLayout, signersTableHeaders } from './SignersTable';
import { VotingPowerSortOrder } from './SortByVotingPowerFilter';

const TableRowSkeleton = ({ numCols }: { numCols: number }) => {
  const cols = Array.from({ length: numCols }, (_, i) => i + 1);

  return (
    <Tr>
      {cols.map((_, index) => (
        <Td py={3} px={6} textAlign="center">
          <SkeletonItem width="full" height="14px" />
        </Td>
      ))}
    </Tr>
  );
};

const TableHeaderSkeleton = () => (
  <Th py={3} px={6}>
    <Flex
      bg="hoverBackground"
      px={2.5}
      py={2}
      borderRadius="md"
      justifyContent="center"
      alignItems="center"
    >
      <SkeletonText noOfLines={1} height="14px" />
    </Flex>
  </Th>
);

export default function Skeleton() {
  const numRows = Array.from({ length: 10 }, (_, i) => i + 1);
  const numCols = Array.from({ length: signersTableHeaders.length }, (_, i) => i + 1);

  return (
    <>
      <PageTitle>
        <SkeletonItem width={'400px'} height={'43px'} />
      </PageTitle>

      <SignersHeaderLayout
        stackingTitle={<SkeletonItem width="30%" height="14px" />}
        currentCycleCard={
          <Card>
            <SkeletonStatSection />
          </Card>
        }
        stxStakedCard={
          <Card>
            <SkeletonStatSection />
          </Card>
        }
        stxLockedCard={
          <Card>
            <SkeletonStatSection />
          </Card>
        }
        addressesStackingCard={
          <Card>
            <SkeletonStatSection />
          </Card>
        }
        nextCycleCard={
          <Card>
            <SkeletonStatSection />
          </Card>
        }
        signerDistribution={
          <Card height="100%" justifyContent="center" alignItems="center">
            <SkeletonCircle size="150" />
          </Card>
        }
        signerDistributionHeader={<SkeletonItem width="30%" height="14px" />}
        historicalStackingDataLink={<SkeletonItem width="30%" height="14px" />}
      />
      <SignersTableLayout
        numSigners={<SkeletonItem width="30%" height="40px" />}
        signersTableHeaders={numCols.map(() => (
          <TableHeaderSkeleton />
        ))}
        signersTableRows={numRows.map(() => (
          <TableRowSkeleton numCols={signersTableHeaders.length} />
        ))}
        votingPowerSortOrder={VotingPowerSortOrder.Asc}
        setVotingPowerSortOrder={() => {}}
      />
    </>
  );
}

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartSkeleton = () => {
  return (
    <Box width="100%" height="100%">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const theme = extendTheme({
  styles: {
    global: {
      'html, body, #root': {
        height: '100%',
      },
    },
  },
});
