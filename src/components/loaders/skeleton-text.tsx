import { Section } from '@components/section';
import { Box, Flex, useColorMode } from '@stacks/ui';
import * as React from 'react';
import ContentLoader from 'react-content-loader';
import { SkeletonBlock, SkeletonTransaction } from './skeleton-transaction';

export const useContentLoaderColors = () => {
  const { colorMode } = useColorMode();
  const [backgroundColor, setBackgroundColor] = React.useState('#f3f3f3');
  const [foregroundColor, setForegroundColor] = React.useState('#ecebeb');
  React.useEffect(() => {
    setBackgroundColor(colorMode === 'light' ? '#f3f3f3' : '#1a1a1a');
    setForegroundColor(colorMode === 'light' ? '#ecebeb' : '#151515');
  }, [colorMode]);
  return [backgroundColor, foregroundColor];
};

export const ExplorerContentLoader = ({ children, ...rest }: any) => {
  const [backgroundColor, foregroundColor] = useContentLoaderColors();
  return (
    <ContentLoader backgroundColor={backgroundColor} foregroundColor={foregroundColor} {...rest}>
      {children}
    </ContentLoader>
  );
};

export const SkeletonTextSpan = () => (
  <ExplorerContentLoader width={400} height={20} viewBox="0px 0px 400 20">
    <rect x="0" y="0" width="399px" height="16px" rx="4px" />
  </ExplorerContentLoader>
);

export const SkeletonAddress = () => (
  <ExplorerContentLoader width={400} height={20} viewBox="0px 0px 400 20">
    <rect x="0" y="0" width="399px" height="16px" rx="4px" />
  </ExplorerContentLoader>
);

export const SkeletonFees = () => (
  <ExplorerContentLoader width={380} height={20} viewBox="0px 0px 380 20">
    <rect x="0" y="0" width="61px" height="16px" rx="4px" />
  </ExplorerContentLoader>
);

export const SkeletonNonce = SkeletonFees;

export const SkeletonHoldings = () => (
  <ExplorerContentLoader width={380} height={20} viewBox="0px 0px 380 20">
    <rect x="0" y="0" width="91px" height="16px" rx="4px" />
    <rect x="118px" y="0" width="91px" height="16px" rx="4px" />
  </ExplorerContentLoader>
);

export const SkeletonTransactionList = () => (
  <>
    {new Array(10).fill(true).map((_, i) => (
      <div>
        <SkeletonTransaction key={i} />
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

export const SkeletonForType = (props: { type: string | undefined }) => {
  const { type } = props;
  if (!type) return <SkeletonTextSpan />;
  switch (type) {
    case 'address':
      return <SkeletonAddress />;
    case 'holdings':
      return <SkeletonHoldings />;
    case 'fees':
      return <SkeletonFees />;
    case 'nonce':
      return <SkeletonNonce />;
    default:
      return <SkeletonTextSpan />;
  }
};

export const SkeletonBlockList = () => {
  return (
    <Section title="Recent Blocks">
      <Flex flexDirection="column" flexGrow={1} px="loose">
        {new Array(10).fill(true).map((_, i) => (
          <SkeletonBlock key={i} />
        ))}
      </Flex>
    </Section>
  );
};
