import { Wrapper } from '@features/account-transaction-list';
import { Box, Flex, Stack } from '@stacks/ui';
import { SkeletonRectangleFiller } from './skeleton-text';
import { PagePanes } from '@components/page-panes';
import { RowContent, RowWrapper } from '@components/rows/row';
import { Section } from '@components/section';
import { Title } from '@components/typography';
import * as React from 'react';
import { ExplorerSkeletonLoader, SkeletonPageTitle, SkeletonTag } from './skeleton-common';
import { css } from '@emotion/react';

const skeletonTransactionCss = css`
  .skeleton-align-self-right {
    align-self: flex-end;
  }
`;

export const SkeletonTransaction = () => (
  <Flex
    css={skeletonTransactionCss}
    justifyContent="space-between"
    display="flex"
    style={{
      borderBottom: '1px solid',
      borderColor: 'var(--colors-border)',
    }}
  >
    <div style={{ width: '360px', height: '91px', display: 'flex' }}>
      <ExplorerSkeletonLoader
        width={'40px'}
        height={'40px'}
        circle={true}
        style={{ marginRight: '16px' }}
      />
      <Flex justifyContent="center" flexDirection="column">
        <ExplorerSkeletonLoader
          width={'275px'}
          height={'18px'}
          borderRadius={'4px'}
          style={{ marginBottom: '8px' }}
        />
        <ExplorerSkeletonLoader width={'212px'} height={'16px'} borderRadius={'4px'} />
      </Flex>
    </div>
    <Flex justifyContent="center" flexDirection="column" alignItems="center">
      <ExplorerSkeletonLoader
        width={'79px'}
        height={'16px'}
        containerClassName="skeleton-outer skeleton-align-self-right"
        style={{ marginBottom: '12px' }}
      />
      <ExplorerSkeletonLoader width={'185px'} height={'18px'} />
    </Flex>
  </Flex>
);

export const SkeletonCoinbaseTransaction = () => {
  return <SkeletonTransaction />;
};

export const SkeletonBlock = () => (
  <Flex
    css={skeletonTransactionCss}
    justifyContent="space-between"
    display="flex"
    style={{
      borderBottom: '1px solid',
      borderColor: 'var(--colors-border)',
    }}
  >
    <div style={{ width: '360px', height: '91px', display: 'flex' }}>
      <ExplorerSkeletonLoader
        width={'40px'}
        height={'40px'}
        circle={true}
        style={{ marginRight: '16px' }}
      />
      <Flex justifyContent="center" flexDirection="column">
        <ExplorerSkeletonLoader width={'192px'} height={'19px'} style={{ marginBottom: '8px' }} />
        <ExplorerSkeletonLoader width={'180px'} height={'16px'} borderRadius={'4px'} />
      </Flex>
    </div>
    <Flex justifyContent="center" flexDirection="column" alignItems="center">
      <ExplorerSkeletonLoader
        width={'89px'}
        containerClassName="skeleton-outer skeleton-align-self-right"
        height={'16px'}
        style={{ marginBottom: '8px' }}
      />
      <ExplorerSkeletonLoader
        width={'72px'}
        height={'16px'}
        containerClassName="skeleton-outer skeleton-align-self-right"
      />
    </Flex>
  </Flex>
);

export const SkeletonAccountTransactionList = () => (
  <Wrapper>
    <Box px="loose" data-test="account-transaction-list">
      <SkeletonTransactionList />
    </Box>
  </Wrapper>
);

export const SkeletonGenericTransactionList = () => (
  <Section border="none">
    <Box px="loose">
      <SkeletonTransactionList />
    </Box>
  </Section>
);

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
    <RowWrapper
      borderTop={'1px solid'}
      borderBottom={'1px solid'}
      px={'base'}
      paddingLeft={'0'}
      overflow="hidden"
    >
      <RowContent isHovered={false}>
        <Flex width={'140px'}>
          <Flex width={'70px'}>
            <SkeletonRectangleFiller />
          </Flex>
        </Flex>
        <Flex>
          <Flex width={'450px'}>
            <SkeletonRectangleFiller />
          </Flex>
        </Flex>
      </RowContent>
    </RowWrapper>
  );
};
const SkeletonSummaryRowShortContent = () => {
  return (
    <RowWrapper
      borderTop={'1px solid'}
      borderBottom={'1px solid'}
      px={'base'}
      paddingLeft={'0'}
      overflow="hidden"
    >
      <RowContent isHovered={false}>
        <Flex width={'140px'}>
          <Flex width={'70px'}>
            <SkeletonRectangleFiller />
          </Flex>
        </Flex>
        <Flex>
          <Flex width={'90px'}>
            <SkeletonRectangleFiller />
          </Flex>
        </Flex>
      </RowContent>
    </RowWrapper>
  );
};

const SkeletonTransactionTitle = () => {
  return (
    <Box width="100%">
      <Title as="h1" fontSize="36px" color="white" mt="72px" mb="16px">
        <SkeletonPageTitle />
      </Title>
      <Box mb="24px">
        <Stack isInline spacing="tight">
          <SkeletonTag />
        </Stack>
      </Box>
    </Box>
  );
};

const SkeletonTransactionDetails = () => {
  return (
    <Section title="Summary">
      <Flex px="base" width="100%" flexDirection={['column', 'column', 'row']}>
        <Box width={['100%']}>
          <SkeletonTxidSummary />
        </Box>
      </Flex>
    </Section>
  );
};

export const SkeletonTransactionSummary = () => {
  return (
    <>
      <SkeletonTransactionTitle />
      <PagePanes>
        <Stack spacing="extra-loose">
          <SkeletonTransactionDetails />
        </Stack>
      </PagePanes>
    </>
  );
};

const SkeletonTransactionList = () => (
  <>
    {new Array(10).fill(true).map((_, i) => (
      <div key={i}>
        <SkeletonTransaction />
      </div>
    ))}
  </>
);

export const SectionBoxSkeleton = () => (
  <Section mt="extra-loose">
    <Box p="base">
      <SkeletonTransactionList />
    </Box>
  </Section>
);
