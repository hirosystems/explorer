import { useSuspenseMempoolTransactionStats } from '@/common/queries/useMempoolTxStats';
import { StackDivider, VStack } from '@chakra-ui/react';
import { LuChevronUpCircle } from 'react-icons/lu';
import { TbCircleChevronDown, TbCircleChevronUp, TbCircleMinus } from 'react-icons/tb';
import { Cell, Pie, PieChart } from 'recharts';

import { MempoolFeePriorities } from '@stacks/blockchain-api-client/src/generated/models';
import { MempoolFeePrioritiesAll } from '@stacks/blockchain-api-client/src/generated/models/MempoolFeePrioritiesAll';

import { Card } from '../../common/components/Card';
import { getTxTypeIcon } from '../../common/components/TxIcon';
import { useSuspenseMempoolFee } from '../../common/queries/useMempoolFee';
import { TokenPrice } from '../../common/types/tokenPrice';
import { MICROSTACKS_IN_STACKS, capitalize, getUsdValue } from '../../common/utils/utils';
import { Box } from '../../ui/Box';
import { Flex, FlexProps } from '../../ui/Flex';
import { HStack } from '../../ui/HStack';
import { Icon } from '../../ui/Icon';
import { Text } from '../../ui/Text';
import { Tooltip } from '../../ui/Tooltip';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';

// function MempoolFeeByTxType({
//   mempoolFeeTokenTransfer,
//   mempoolFeeContractCall,
//   mempoolFeeSmartContract,
// }: {
//   mempoolFeeTokenTransfer: number;
//   mempoolFeeContractCall: number;
//   mempoolFeeSmartContract: number;
// }) {
//   return (
//     <VStack gap={3}>
//       <Tooltip
//         label={`Token transfer tx fee: ${mempoolFeeTokenTransfer / MICROSTACKS_IN_STACKS} STX`}
//       >
//         <Flex gap={0.5} alignItems={'center'} justifyContent={'center'}>
//           <Icon as={getTxTypeIcon('token_transfer')} size={3.5} mr={2} />
//           <Box suppressHydrationWarning>
//             {`${Number((mempoolFeeTokenTransfer / MICROSTACKS_IN_STACKS).toFixed(3))}`} STX
//           </Box>
//         </Flex>
//       </Tooltip>
//       <Tooltip
//         label={`Contract call tx fee: ${mempoolFeeContractCall / MICROSTACKS_IN_STACKS} STX`}
//       >
//         <Flex gap={0.5} alignItems={'center'} justifyContent={'center'}>
//           <Icon as={getTxTypeIcon('contract_call')} size={3.5} mr={2} />
//           <Box suppressHydrationWarning>
//             {`${Number((mempoolFeeContractCall / MICROSTACKS_IN_STACKS).toFixed(3))}`} STX
//           </Box>
//         </Flex>
//       </Tooltip>
//       <Tooltip
//         label={`Smart contract tx fee: ${mempoolFeeSmartContract / MICROSTACKS_IN_STACKS} STX`}
//       >
//         <Flex gap={0.5} alignItems={'center'} justifyContent={'center'}>
//           <Icon as={getTxTypeIcon('smart_contract')} size={3.5} mr={2} />
//           <Box suppressHydrationWarning>
//             {`${Number((mempoolFeeSmartContract / MICROSTACKS_IN_STACKS).toFixed(3))}`} STX
//           </Box>
//         </Flex>
//       </Tooltip>
//     </VStack>
//   );
// }

export const getFeePriorityIcon = (priority: keyof MempoolFeePrioritiesAll) => {
  switch (priority) {
    case 'no_priority':
      return <Icon as={TbCircleMinus} size={4} color="slate.600" />;
    case 'low_priority':
      return <Icon as={TbCircleChevronDown} size={4} color="red.600" />;
    case 'medium_priority':
      return <Icon as={TbCircleChevronUp} size={4} color="orange.600" />;
    case 'high_priority':
      return <Icon as={LuChevronUpCircle} size={4} color="green.600" />;
    default:
      throw new Error('Invalid priority');
  }
};

function MempoolFeeSection({
  mempoolFeeResponse,
  priority,
  stxPrice,
  ...rest
}: {
  mempoolFeeResponse: MempoolFeePriorities;
  priority: keyof MempoolFeePrioritiesAll;
  stxPrice: number;
} & FlexProps) {
  const mempoolFeeAll = mempoolFeeResponse?.all?.[priority] || 0;
  const mempoolFeeTokenTransfer = mempoolFeeResponse?.token_transfer?.[priority] || 0;
  const mempoolFeeContractCall = mempoolFeeResponse?.contract_call?.[priority] || 0;
  const mempoolFeeSmartContract = mempoolFeeResponse?.smart_contract?.[priority] || 0;
  const title = capitalize(priority.replaceAll('_', ' '));

  return (
    <Card padding={6} minWidth="260px">
      <Flex gap={2} mt={4} mb={4}>
        {getFeePriorityIcon(priority)}
        <Text fontSize={'xs'} fontWeight="semibold" mb={3} whiteSpace={'nowrap'}>
          {title}
        </Text>
      </Flex>
      <VStack
        divider={<StackDivider borderColor="slate.200" />}
        spacing={4}
        alignItems="flex-start"
      >
        <Box>
          <Text
            fontSize={'xl'}
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            color={'text'}
            mt={4}
            mb={4}
          >
            {mempoolFeeAll / MICROSTACKS_IN_STACKS} STX
          </Text>
          <Text fontSize={'sm'} color={'secondaryText'} whiteSpace={'nowrap'}>
            {getUsdValue(mempoolFeeAll, stxPrice, true)}
          </Text>
        </Box>
        <VStack gap={3} alignItems="flex-start">
          <Tooltip
            label={`Token transfer tx fee: ${mempoolFeeTokenTransfer / MICROSTACKS_IN_STACKS} STX`}
          >
            <Flex gap={0.5} alignItems={'center'} justifyContent={'center'}>
              <Icon as={getTxTypeIcon('token_transfer')} size={3.5} mr={2} />
              <Box suppressHydrationWarning>
                {`${Number((mempoolFeeTokenTransfer / MICROSTACKS_IN_STACKS).toFixed(3))}`} STX
              </Box>
            </Flex>
          </Tooltip>
          <Tooltip
            label={`Contract call tx fee: ${mempoolFeeContractCall / MICROSTACKS_IN_STACKS} STX`}
          >
            <Flex gap={0.5} alignItems={'center'} justifyContent={'center'}>
              <Icon as={getTxTypeIcon('contract_call')} size={3.5} mr={2} />
              <Box suppressHydrationWarning>
                {`${Number((mempoolFeeContractCall / MICROSTACKS_IN_STACKS).toFixed(3))}`} STX
              </Box>
            </Flex>
          </Tooltip>
          <Tooltip
            label={`Smart contract tx fee: ${mempoolFeeSmartContract / MICROSTACKS_IN_STACKS} STX`}
          >
            <Flex gap={0.5} alignItems={'center'} justifyContent={'center'}>
              <Icon as={getTxTypeIcon('smart_contract')} size={3.5} mr={2} />
              <Box suppressHydrationWarning>
                {`${Number((mempoolFeeSmartContract / MICROSTACKS_IN_STACKS).toFixed(3))}`} STX
              </Box>
            </Flex>
          </Tooltip>
        </VStack>
      </VStack>
    </Card>
  );
}

function getTxTypePieChartColor(txType: string) {
  switch (txType) {
    case 'token_transfer':
      return '#9985FF';
    case 'contract_call':
      return '#2D2294';
    case 'smart_contract':
      return '#C1D21B';
    default:
      return 'purple';
  }
}

// const renderActiveShape = props => {
//   const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

//   return (
//     <g>
//       <Sector
//         cx={cx}
//         cy={cy}
//         innerRadius={innerRadius}
//         outerRadius={outerRadius}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//       />
//       <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     </g>
//   );
// };

export function MempoolFeeStats({ tokenPrice }: { tokenPrice: TokenPrice }) {
  const mempoolFeeResponse = useSuspenseMempoolFee().data as MempoolFeePriorities;
  const mempoolTransactionStats = useSuspenseMempoolTransactionStats().data;
  const txTypeCounts = mempoolTransactionStats?.tx_type_counts;
  const { poison_microblock, ...filteredTxTypeCounts } = txTypeCounts || {};
  const totalTxCount = Object.entries(filteredTxTypeCounts).reduce((acc, [key, val]) => {
    return acc + val;
  }, 0);
  const pieData = Object.entries(filteredTxTypeCounts).map(([key, value]) => {
    return {
      name: key,
      value: Math.round((value / totalTxCount) * 100),
    };
  });
  console.log({ pieData, filteredTxTypeCounts });
  return (
    <Card>
      <HStack divider={<StackDivider borderColor="slate.200" />}>
        <Flex padding={6} flexDirection="column">
          <Box
            fontSize="12px"
            fontStyle="normal"
            fontWeight={600}
            lineHeight="20px"
            letterSpacing="-0.12px"
          >
            IN MEMPOOL
          </Box>
          <Box height="fit-content" width="fit-content">
            <PieChart width={200} height={200}>
              <Pie
                paddingAngle={3}
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                labelLine={false}
                label
                innerRadius={57}
                outerRadius={67}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getTxTypePieChartColor(entry.name)} />
                ))}
              </Pie>
              /
            </PieChart>
          </Box>
          <VStack gap={3} alignItems="flex-start">
            <Flex gap={0.5} alignItems={'center'} justifyContent={'center'}>
              <Box
                size={3.5}
                borderRadius="50%"
                mr={2}
                backgroundColor={getTxTypePieChartColor('token_transfer')}
              />
              <Icon as={getTxTypeIcon('token_transfer')} size={3.5} mr={2} />
              <Box suppressHydrationWarning>{txTypeCounts.token_transfer} Token transfer</Box>
            </Flex>
            <Flex gap={0.5} alignItems={'center'} justifyContent={'center'}>
              <Box
                size={3.5}
                borderRadius="50%"
                mr={2}
                backgroundColor={getTxTypePieChartColor('contract_call')}
              />
              <Icon as={getTxTypeIcon('contract_call')} size={3.5} mr={2} />
              <Box suppressHydrationWarning>{txTypeCounts.contract_call} Function call</Box>
            </Flex>
            <Flex gap={0.5} alignItems={'center'} justifyContent={'center'}>
              <Box
                size={3.5}
                borderRadius="50%"
                mr={2}
                backgroundColor={getTxTypePieChartColor('smart_contract')}
              />

              <Icon as={getTxTypeIcon('smart_contract')} size={3.5} mr={2} />
              <Box suppressHydrationWarning>{txTypeCounts.smart_contract} Contract deploy</Box>
            </Flex>
          </VStack>
        </Flex>
        <Flex padding={6} justifyContent="center" flexDirection="column">
          <Flex mb={9} justifyContent="space-between">
            <Box
              fontSize="12px"
              fontStyle="normal"
              fontWeight={600}
              lineHeight="20px"
              letterSpacing="-0.12px"
            >
              CURRENT FEE RATES
            </Box>
            <Box>Tx Filter</Box>
          </Flex>
          <Box
            display={'grid'}
            gridColumnStart={'1'}
            gridColumnEnd={['2', '2', '3']}
            gridTemplateColumns={[
              '100%',
              '100%',
              'minmax(0, 1fr) minmax(0, 1fr)',
              'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
            ]}
          >
            <HStack gap={3}>
              <MempoolFeeSection
                mempoolFeeResponse={mempoolFeeResponse}
                priority={'no_priority'}
                stxPrice={tokenPrice.stxPrice}
                borderRightWidth={['0px', '0px', '1px', '1px']}
              />
              <MempoolFeeSection
                mempoolFeeResponse={mempoolFeeResponse}
                priority={'low_priority'}
                stxPrice={tokenPrice.stxPrice}
                borderRightWidth={['0px', '0px', '0px', '1px']}
              />
              <MempoolFeeSection
                mempoolFeeResponse={mempoolFeeResponse}
                priority={'medium_priority'}
                stxPrice={tokenPrice.stxPrice}
                borderRightWidth={['0px', '0px', '1px', '1px']}
              />
              <MempoolFeeSection
                mempoolFeeResponse={mempoolFeeResponse}
                priority={'high_priority'}
                stxPrice={tokenPrice.stxPrice}
              />
            </HStack>
          </Box>
        </Flex>
      </HStack>
    </Card>
  );
}

function MempoolFeeStatsContainer({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <Box>
      <MempoolFeeStats tokenPrice={tokenPrice} />
    </Box>
  );
}

export function MempoolFeeStatsWithErrorBoundary({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <MempoolFeeStats tokenPrice={tokenPrice} />
    </ExplorerErrorBoundary>
  );
}
