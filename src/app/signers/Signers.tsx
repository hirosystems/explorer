import { MempoolFeePriorities } from '@stacks/blockchain-api-client/src/generated/models';
import { MempoolFeePrioritiesAll } from '@stacks/blockchain-api-client/src/generated/models/MempoolFeePrioritiesAll';

import { Card } from '../../common/components/Card';
import { getTxTypeIcon } from '../../common/components/TxIcon';
import { useSuspenseMempoolFee } from '../../common/queries/usMempoolFee';
import { MICROSTACKS_IN_STACKS, capitalize, getUsdValue } from '../../common/utils/utils';
import { Box } from '../../ui/Box';
import { Flex, FlexProps } from '../../ui/Flex';
import { HStack } from '../../ui/HStack';
import { Icon } from '../../ui/Icon';
import { Link } from '../../ui/Link';
import { Text } from '../../ui/Text';
import { Tooltip } from '../../ui/Tooltip';
import { Caption, Title } from '../../ui/typography';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { StatSection } from '../_components/Stats/StatSection';

function MempoolFeeByTxType({
  mempoolFeeTokenTransfer,
  mempoolFeeContractCall,
  mempoolFeeSmartContract,
}: {
  mempoolFeeTokenTransfer: number;
  mempoolFeeContractCall: number;
  mempoolFeeSmartContract: number;
}) {
  return (
    <HStack divider={<Caption color={'border'}>|</Caption>} gap={1}>
      <Tooltip
        label={`Token transfer tx fee: ${mempoolFeeTokenTransfer / MICROSTACKS_IN_STACKS} STX`}
      >
        <Flex gap={0.5} alignItems={'center'} justifyContent={'center'}>
          <Icon as={getTxTypeIcon('token_transfer')} />
          <Box suppressHydrationWarning>
            {`${Number((mempoolFeeTokenTransfer / MICROSTACKS_IN_STACKS).toFixed(3))}`} STX
          </Box>
        </Flex>
      </Tooltip>
      <Tooltip
        label={`Contract call tx fee: ${mempoolFeeContractCall / MICROSTACKS_IN_STACKS} STX`}
      >
        <Flex gap={0.5} alignItems={'center'} justifyContent={'center'}>
          <Icon as={getTxTypeIcon('contract_call')} size={3} />
          <Box suppressHydrationWarning>
            {`${Number((mempoolFeeContractCall / MICROSTACKS_IN_STACKS).toFixed(3))}`} STX
          </Box>
        </Flex>
      </Tooltip>
      <Tooltip
        label={`Smart contract tx fee: ${mempoolFeeSmartContract / MICROSTACKS_IN_STACKS} STX`}
      >
        <Flex gap={0.5} alignItems={'center'} justifyContent={'center'}>
          <Icon as={getTxTypeIcon('smart_contract')} size={3} />
          <Box suppressHydrationWarning>
            {`${Number((mempoolFeeSmartContract / MICROSTACKS_IN_STACKS).toFixed(3))}`} STX
          </Box>
        </Flex>
      </Tooltip>
    </HStack>
  );
}

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
  return (
    <StatSection
      title={capitalize(priority.replaceAll('_', ' '))}
      bodyMainText={`${mempoolFeeAll / MICROSTACKS_IN_STACKS} STX`}
      bodySecondaryText={getUsdValue(mempoolFeeAll, stxPrice, true)}
      caption={
        <MempoolFeeByTxType
          mempoolFeeTokenTransfer={mempoolFeeTokenTransfer}
          mempoolFeeContractCall={mempoolFeeContractCall}
          mempoolFeeSmartContract={mempoolFeeSmartContract}
        />
      }
      borderColor={'border'}
      {...rest}
    />
  );
}

function CurrentCycleCard({
  title,
  bodyMainText,
  bodySecondaryText,
  caption,
  ...rest
}: {
  title: string;
  bodyMainText: string;
  bodySecondaryText: string;
  caption: string;
}) {
  return (
    <Card>
      <Flex
        direction={'column'}
        p={5}
        height={32}
        justifyContent={'center'}
        borderColor={'border'}
        {...rest}
      >
        <Text fontSize={'xs'} fontWeight="semibold" mb={3} whiteSpace={'nowrap'}>
          {title}
        </Text>
        <Flex
          mb={2}
          alignItems={'baseline'}
          wrap={'nowrap'}
          minW={'0'}
          gap={0.5}
          fontWeight={'medium'}
        >
          <Text
            fontSize={'xl'}
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            color={'text'}
          >
            {bodyMainText}
          </Text>
          <Text fontSize={'sm'} color={'secondaryText'} whiteSpace={'nowrap'}>
            {bodySecondaryText}
          </Text>
        </Flex>
        <Text fontSize={'xs'} lineHeight={'none'} fontWeight="medium" color={'secondaryText'}>
          {caption}
        </Text>
      </Flex>
    </Card>
  );
}

function StxStakedCard({
  title,
  bodyMainText,
  bodySecondaryText,
  caption,
  ...rest
}: {
  title: string;
  bodyMainText: string;
  bodySecondaryText: string;
  caption: string;
}) {
  return (
    <Card>
      <Flex
        direction={'column'}
        p={5}
        height={32}
        justifyContent={'center'}
        borderColor={'border'}
        {...rest}
      >
        <Text fontSize={'xs'} fontWeight="semibold" mb={3} whiteSpace={'nowrap'}>
          {title}
        </Text>
        <Flex
          mb={2}
          alignItems={'baseline'}
          wrap={'nowrap'}
          minW={'0'}
          gap={0.5}
          fontWeight={'medium'}
        >
          <Text
            fontSize={'xl'}
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            color={'text'}
          >
            {bodyMainText}
          </Text>
          <Text fontSize={'sm'} color={'secondaryText'} whiteSpace={'nowrap'}>
            {bodySecondaryText}
          </Text>
        </Flex>
        <Text fontSize={'xs'} lineHeight={'none'} fontWeight="medium" color={'secondaryText'}>
          {caption}
        </Text>
      </Flex>
    </Card>
  );
}

function StxLockedCard({
  title,
  bodyMainText,
  bodySecondaryText,
  caption,
  ...rest
}: {
  title: string;
  bodyMainText: string;
  bodySecondaryText: string;
  caption: string;
}) {
  return (
    <Card>
      <Flex
        direction={'column'}
        p={5}
        height={32}
        justifyContent={'center'}
        borderColor={'border'}
        {...rest}
      >
        <Text fontSize={'xs'} fontWeight="semibold" mb={3} whiteSpace={'nowrap'}>
          {title}
        </Text>
        <Flex
          mb={2}
          alignItems={'baseline'}
          wrap={'nowrap'}
          minW={'0'}
          gap={0.5}
          fontWeight={'medium'}
        >
          <Text
            fontSize={'xl'}
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            color={'text'}
          >
            {bodyMainText}
          </Text>
          <Text fontSize={'sm'} color={'secondaryText'} whiteSpace={'nowrap'}>
            {bodySecondaryText}
          </Text>
        </Flex>
        <Text fontSize={'xs'} lineHeight={'none'} fontWeight="medium" color={'secondaryText'}>
          {caption}
        </Text>
      </Flex>
    </Card>
  );
}

function AddressesStackingCard({
  title,
  bodyMainText,
  bodySecondaryText,
  caption,
  ...rest
}: {
  title: string;
  bodyMainText: string;
  bodySecondaryText: string;
  caption: string;
}) {
  return (
    <Card>
      <Flex
        direction={'column'}
        p={5}
        height={32}
        justifyContent={'center'}
        borderColor={'border'}
        {...rest}
      >
        <Text fontSize={'xs'} fontWeight="semibold" mb={3} whiteSpace={'nowrap'}>
          {title}
        </Text>
        <Flex
          mb={2}
          alignItems={'baseline'}
          wrap={'nowrap'}
          minW={'0'}
          gap={0.5}
          fontWeight={'medium'}
        >
          <Text
            fontSize={'xl'}
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            color={'text'}
          >
            {bodyMainText}
          </Text>
          <Text fontSize={'sm'} color={'secondaryText'} whiteSpace={'nowrap'}>
            {bodySecondaryText}
          </Text>
        </Flex>
        <Text fontSize={'xs'} lineHeight={'none'} fontWeight="medium" color={'secondaryText'}>
          {caption}
        </Text>
      </Flex>
    </Card>
  );
}

function NextCycleCard({
  title,
  bodyMainText,
  bodySecondaryText,
  caption,
  ...rest
}: {
  title: string;
  bodyMainText: string;
  bodySecondaryText: string;
  caption: string;
}) {
  return (
    <Card>
      <Flex
        direction={'column'}
        p={5}
        height={32}
        justifyContent={'center'}
        borderColor={'border'}
        {...rest}
      >
        <Text fontSize={'xs'} fontWeight="semibold" mb={3} whiteSpace={'nowrap'}>
          {title}
        </Text>
        <Flex
          mb={2}
          alignItems={'baseline'}
          wrap={'nowrap'}
          minW={'0'}
          gap={0.5}
          fontWeight={'medium'}
        >
          <Text
            fontSize={'xl'}
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
            color={'text'}
          >
            {bodyMainText}
          </Text>
          <Text fontSize={'sm'} color={'secondaryText'} whiteSpace={'nowrap'}>
            {bodySecondaryText}
          </Text>
        </Flex>
        <Text fontSize={'xs'} lineHeight={'none'} fontWeight="medium" color={'secondaryText'}>
          {caption}
        </Text>
      </Flex>
    </Card>
  );
}

export function Signers() {
  const mempoolFeeResponse = useSuspenseMempoolFee().data as MempoolFeePriorities;
  return (
    <Card width="full" flexDirection="column" padding={7}>
      <Flex justifyContent="space-between" width="full" mb={4}>
        <Title>Stacking</Title>
        <Link href="/">See Stacking historical data</Link>
      </Flex>
      <Flex
        // sx={{
        //   '& > *:not(:last-child)': {
        //     mr: 4,
        //   },
        // }}
        flexWrap="wrap"
      >
        <Box
          display="grid"
          gridTemplateColumns="minmax(0, 1fr) auto auto auto auto"
          gap={4}
        >
          <CurrentCycleCard
            title="nothing"
            bodyMainText="nothing"
            bodySecondaryText="nothing"
            caption="nothing"
          />
          <StxStakedCard
            title="nothing"
            bodyMainText="nothing"
            bodySecondaryText="nothing"
            caption="nothing"
          />
          <StxLockedCard
            title="nothing"
            bodyMainText="nothing"
            bodySecondaryText="nothing"
            caption="nothing"
          />
          <AddressesStackingCard
            title="nothing"
            bodyMainText="nothing"
            bodySecondaryText="nothing"
            caption="nothing"
          />
          <NextCycleCard
            title="nothing"
            bodyMainText="nothing"
            bodySecondaryText="nothing"
            caption="nothing"
          />
        </Box>
      </Flex>
    </Card>
  );
}

export function SignersWithErrorBoundary() {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <Signers />
    </ExplorerErrorBoundary>
  );
}
