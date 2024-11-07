'use client';

import { Box, Flex, HStack } from '@chakra-ui/react';

import { PageTitle } from '../../../app/_components/PageTitle';
import { SkeletonCircle } from '../../../components/ui/skeleton';
import { SkeletonTxsList } from '../../../features/txs-list/SkeletonTxsList';
import { Skeleton } from '../../../ui/Skeleton';
import { KeyValueHorizontal } from '../KeyValueHorizontal';
import { Section } from '../Section';
import { TwoColumnPage } from '../TwoColumnPage';
import { TwoColsListItem } from '../TwoColumnsListItem';
import { Value } from '../Value';
import { RightBoxSkeleton } from './RightBox';
import { randomWidth } from './consts';

export const SkeletonBlock = () => (
  <TwoColsListItem
    icon={<SkeletonCircle width={'40px'} height={'40px'} />} // Takes time to load in...
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
    <Flex borderBottom={`1px solid var(--stacks-colors-border-secondary)`}>
      <Flex>
        <Flex width={'140px'}>
          <Flex width={'70px'}>
            <Skeleton height={'20px'} width={'full'} />
          </Flex>
        </Flex>
        <Flex>
          <Flex width={'450px'}>
            <Skeleton height={'20px'} width={'full'} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
const SkeletonSummaryRowShortContent = (): JSX.Element => {
  return (
    <Flex
      flexDirection={['column', 'column', 'row']}
      py={['16px', '16px', '24px']}
      width="100%"
      alignItems={['unset', 'unset', 'center']}
      px={4}
      paddingLeft={0}
      overflow="hidden"
      borderTopWidth="1px"
      borderBottomWidth="1px"
      borderColor={'borderSecondary'}
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
      rightContent={<RightBoxSkeleton />}
    />
  );
};
