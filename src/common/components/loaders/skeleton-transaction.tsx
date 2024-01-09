'use client';

import { useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';

import { PageTitle } from '../../../app/_components/PageTitle';
import { SkeletonTxsList } from '../../../features/txs-list/SkeletonTxsList';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { HStack } from '../../../ui/HStack';
import { SkeletonCircle } from '../../../ui/SkeletonCircle';
import { SkeletonItem } from '../../../ui/SkeletonItem';
import { KeyValueHorizontal } from '../KeyValueHorizontal';
import { Section } from '../Section';
import { TwoColumnPage } from '../TwoColumnPage';
import { TwoColsListItem } from '../TwoColumnsListItem';
import { Value } from '../Value';

export const SkeletonBlock = () => (
  <TwoColsListItem
    icon={<SkeletonCircle width={'40px'} height={'40px'} />}
    leftContent={{
      title: <SkeletonItem width={'192px'} height={'15px'} />,
      subtitle: <SkeletonItem width={'180px'} height={'12px'} />,
    }}
    rightContent={{
      title: <SkeletonItem width={'89px'} height={'14px'} />,
      subtitle: <SkeletonItem width={'72px'} height={'12px'} />,
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
  const borderColor = useColorModeValue('slate.150', 'slate.900');
  return (
    <Flex borderBottom="1px" borderColor={borderColor}>
      <Flex>
        <Flex width={'140px'}>
          <Flex width={'70px'}>
            <SkeletonItem height={'20px'} width={'full'} />
          </Flex>
        </Flex>
        <Flex>
          <Flex width={'450px'}>
            <SkeletonItem height={'20px'} width={'full'} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
const SkeletonSummaryRowShortContent = () => {
  const borderColor = useColorModeValue('slate.150', 'slate.900');
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
      borderColor={borderColor}
    >
      <Flex>
        <Flex width={'140px'}>
          <Flex width={'70px'}>
            <SkeletonItem height={'20px'} />
          </Flex>
        </Flex>
        <Flex>
          <Flex width={'90px'}>
            <SkeletonItem height={'20px'} />
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
        <SkeletonItem height={6} />
      </HStack>
      <PageTitle mt={2}>
        <SkeletonItem width={'300px'} height={'43px'} />
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
        <Section title={<SkeletonItem width={'200px'} height={'20px'} />}>
          <Flex width="100%" flexDirection={['column', 'column', 'row']}>
            <Box width={['100%']}>
              {Array.from({ length: 20 }).map((_, i) => (
                <KeyValueHorizontal
                  key={i}
                  label={<SkeletonItem width={'100px'} height={'14px'} />}
                  value={
                    <Flex alignItems={'center'} width={'full'} flexGrow={1}>
                      <Value>
                        <SkeletonItem
                          width={`${randomWidth[i]}px`}
                          maxWidth={'100%'}
                          height={'14px'}
                        />
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
        <Section title={<SkeletonItem width={'200px'} height={'20px'} />}>
          <Flex width="100%" flexDirection={['column', 'column', 'row']}>
            <Box width={['100%']}>
              {Array.from({ length: 20 }).map((_, i) => (
                <KeyValueHorizontal
                  key={i}
                  label={<SkeletonItem width={`${randomWidth[i]}px`} height={'14px'} />}
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
