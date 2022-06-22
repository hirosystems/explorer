import { Wrapper } from '@features/account-transaction-list';
import { Box, Flex } from '@stacks/ui';
import ContentLoader from 'react-content-loader';
import { ExplorerContentLoader, SkeletonTransactionList } from './skeleton-text';

const SkeletonTextSpan = () => (
  <ContentLoader>
    <rect x="0" y="0" rx="4" ry="4" width="300" height="90px" />
  </ContentLoader>
);

export const SkeletonTransaction = () => (
  <Flex
    justifyContent="space-between"
    display="flex"
    style={{
      borderBottom: '1px solid',
      borderColor: 'var(--colors-border)',
    }}
  >
    <div>
      <ExplorerContentLoader speed={2} width={360} height={91} viewBox="0 0 360 91">
        <rect x="56" y="20" rx="4" width="275" height="18" />
        <rect x="56" y="48" rx="4" width="212" height="16" />
        <circle cx="20" cy="50%" r="20" />
      </ExplorerContentLoader>
    </div>
    <div>
      <ExplorerContentLoader speed={2} width={200} height={91} viewBox="0 0 200 91">
        <rect x="121" y="20" rx="4" width="79" height="16" />
        <rect x="15" y="50" rx="4" width="185" height="18" />
      </ExplorerContentLoader>
    </div>
  </Flex>
);

export const SkeletonCoinbaseTransaction = () => {
  return <SkeletonTransaction />;
};

export const SkeletonBlock = () => (
  <Flex
    justifyContent="space-between"
    display="flex"
    style={{
      borderBottom: '1px solid',
      borderColor: 'var(--colors-border)',
    }}
  >
    <div>
      <ExplorerContentLoader speed={2} width={260} height={91} viewBox="0 0 260 91">
        <rect x="56" y="20" rx="4" width="175" height="18" />
        <rect x="56" y="48" rx="4" width="212" height="16" />
        <circle cx="20" cy="50%" r="20" />
      </ExplorerContentLoader>
    </div>
    <div>
      <ExplorerContentLoader speed={2} width={200} height={91} viewBox="0 0 200 91" rtl={true}>
        <rect x="24" y="20" rx="4" width="89" height="16" />
        <rect x="24" y="50" rx="4" width="72" height="18" />
      </ExplorerContentLoader>
    </div>
  </Flex>
);

export const SkeletonAccountTransactionList = () => (
  <Wrapper>
    <Box px="loose" data-test="account-transaction-list">
      <SkeletonTransactionList />
    </Box>
  </Wrapper>
);
