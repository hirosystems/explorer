'use client';

import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { TbMenu2, TbUser } from 'react-icons/tb';

import { PageTitle } from '../../../app/_components/PageTitle';
import { SideNav } from '../../../app/sandbox/layout/SideNav';
import { TxAlerts } from '../../../app/txid/[txId]/TxAlerts';
import { BlockHash } from '../../../app/txid/[txId]/TxDetails/BlockHash';
import { BlockHeight } from '../../../app/txid/[txId]/TxDetails/BlockHeight';
import { Fees } from '../../../app/txid/[txId]/TxDetails/Fees';
import { ID } from '../../../app/txid/[txId]/TxDetails/ID';
import { NonCanonical } from '../../../app/txid/[txId]/TxDetails/NonCanonical';
import { Nonce } from '../../../app/txid/[txId]/TxDetails/Nonce';
import { Sender } from '../../../app/txid/[txId]/TxDetails/Sender';
import { SkeletonTxsList } from '../../../features/txs-list/SkeletonTxsList';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Grid } from '../../../ui/Grid';
import { HStack } from '../../../ui/HStack';
import { IconButton } from '../../../ui/IconButton';
import { Skeleton } from '../../../ui/Skeleton';
import { SkeletonCircle } from '../../../ui/SkeletonCircle';
import { Spinner } from '../../../ui/Spinner';
import { Stack } from '../../../ui/Stack';
import { Caption } from '../../../ui/typography';
import { getTransactionStatus } from '../../utils/transactions';
import { getTxTitle } from '../../utils/utils';
import { KeyValueHorizontal } from '../KeyValueHorizontal';
import { Section } from '../Section';
import { TwoColumnPage } from '../TwoColumnPage';
import { TwoColsListItem } from '../TwoColumnsListItem';
import { TxTypeTag } from '../TxTypeTag';
import { Value } from '../Value';
import { TxStatusLabel } from '../status';

export const SkeletonTxListItemMini = () => (
  <TwoColsListItem
    icon={<SkeletonCircle width={'40px'} height={'40px'} />}
    leftContent={{
      title: <Skeleton width={'275px'} height={'20px'} />,
      subtitle: <Skeleton width={'212px'} height={'16px'} />,
    }}
  />
);

export const SkeletonBlock = () => (
  <TwoColsListItem
    icon={<SkeletonCircle width={'40px'} height={'40px'} />}
    leftContent={{
      title: <Skeleton width={'192px'} height={'15px'} />,
      subtitle: <Skeleton width={'180px'} height={'12px'} />,
    }}
    rightContent={{
      title: <Skeleton width={'89px'} height={'14px'} />,
      subtitle: <Skeleton width={'72px'} height={'12px'} />,
    }}
  />
);

export const SkeletonGenericTransactionList = () => <SkeletonTxsList />;

const SkeletonTxidSummary = () => {
  const content = ['long', 'long', 'long', 'short', 'short', 'long'];
  return (
    <Box>
      {content.map((type, i) => {
        return type === 'long' ? (
          <SkeletonSummaryRow key={i} />
        ) : (
          <SkeletonSummaryRowShortContent key={i} />
        );
      })}
    </Box>
  );
};

const SkeletonSummaryRow = () => {
  return (
    <Flex borderBottom="1px">
      <Flex>
        <Flex width={'140px'}>
          <Flex width={'70px'}>
            <Skeleton height={'20px'} />
          </Flex>
        </Flex>
        <Flex>
          <Flex width={'450px'}>
            <Skeleton height={'20px'} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
const SkeletonSummaryRowShortContent = () => {
  return (
    <Flex
      flexDirection={['column', 'column', 'row']}
      py={['16px', '16px', '24px']}
      width="100%"
      alignItems={['unset', 'unset', 'center']}
      borderTopWidth="1px"
      borderBottomWidth="1px"
      px={'16px'}
      paddingLeft={'0'}
      overflow="hidden"
    >
      <Flex>
        <Flex width={'140px'}>
          <Flex width={'70px'}>
            <Skeleton height={'20px'} />
          </Flex>
        </Flex>
        <Flex>
          <Flex width={'90px'}>
            <Skeleton height={'20px'} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const SkeletonTransactionTitle = () => {
  return (
    <Flex direction={'column'} gap={2} width={'full'} mt={10}>
      <HStack gap={2}>
        <Skeleton height={6} />
      </HStack>
      <PageTitle mt={2}>
        <Skeleton width={'300px'} height={'43px'} />
      </PageTitle>
    </Flex>
  );
};

export const SkeletonTransactionDetails = () => {
  return (
    <Section>
      <Flex flexDirection={['column', 'column', 'row']}>
        <Box width={'full'}>
          <SkeletonTxidSummary />
        </Box>
      </Flex>
    </Section>
  );
};

export const SkeletonPageWithTagsAndTwoColumns = () => {
  const randomWidth = [
    94, 115, 99, 89, 142, 160, 85, 117, 125, 94, 115, 99, 89, 142, 160, 94, 115, 85, 117, 125,
  ];
  return (
    <TwoColumnPage
      title={<SkeletonTransactionTitle />}
      leftContent={
        <Section title={<Skeleton width={'200px'} height={'20px'} />}>
          <Flex width="100%" flexDirection={['column', 'column', 'row']}>
            <Box width={['100%']}>
              {Array.from({ length: 20 }).map((_, i) => (
                <KeyValueHorizontal
                  key={i}
                  label={<Skeleton width={'100px'} height={'14px'} />}
                  value={
                    <Flex alignItems={'center'} width={'full'} flexGrow={1}>
                      <Value>
                        <Skeleton width={`${randomWidth[i]}px`} maxWidth={'100%'} height={'14px'} />
                      </Value>
                    </Flex>
                  }
                />
              ))}
            </Box>
          </Flex>
        </Section>
      }
      rightContent={
        <Section title={<Skeleton width={'200px'} height={'20px'} />}>
          <Flex width="100%" flexDirection={['column', 'column', 'row']}>
            <Box width={['100%']}>
              {Array.from({ length: 20 }).map((_, i) => (
                <KeyValueHorizontal
                  key={i}
                  label={<Skeleton width={`${randomWidth[i]}px`} height={'14px'} />}
                  value={null}
                />
              ))}
            </Box>
          </Flex>
        </Section>
      }
    />
  );
};

export const SkeletonPageWithTwoColumns = () => {
  return (
    <TwoColumnPage
      title={
        <PageTitle>
          <Skeleton width={'400px'} height={'31px'} />
        </PageTitle>
      }
      leftContent={
        <>
          <SkeletonTransactionDetails />
          <SkeletonTransactionDetails />
        </>
      }
      rightContent={<SkeletonTransactionDetails />}
    />
  );
};
