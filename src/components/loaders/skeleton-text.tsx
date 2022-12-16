import * as React from 'react';

import { Box, Flex } from '@stacks/ui';

import { Section } from '@components/section';

import { ExplorerSkeletonLoader } from './skeleton-common';
import { SkeletonBlock, SkeletonTransaction } from './skeleton-transaction';

const SkeletonTextSpan = () => <ExplorerSkeletonLoader width={'399px'} height={'16px'} />;

export const SkeletonRectangleFiller = () => (
  <ExplorerSkeletonLoader height={'20px'} containerClassName="skeleton-outer-full-width" />
);

export const SkeletonFees = () => <ExplorerSkeletonLoader width={'61px'} height={'16px'} />;

const SkeletonMediumText = () => <ExplorerSkeletonLoader width={'150px'} height={'16px'} />;

const SkeletonShortDigit = () => <ExplorerSkeletonLoader width={'22px'} height={'20px'} />;

const SkeletonNonce = SkeletonFees;

const SkeletonHoldings = () => (
  <Flex flexDirection={'column'} justifyContent="space-between">
    <ExplorerSkeletonLoader width={'91px'} height={'16px'} />
    <ExplorerSkeletonLoader width={'91px'} height={'16px'} />
  </Flex>
);

export const SkeletonForType = (props: { type: string | undefined }) => {
  const { type } = props;

  if (!type) return <SkeletonTextSpan />;
  switch (type) {
    case 'address':
      return <SkeletonTextSpan />;
    case 'holdings':
      return <SkeletonHoldings />;
    case 'fees':
      return <SkeletonFees />;
    case 'last executed tx nonce':
      return <SkeletonNonce />;
    case 'block height':
      return <SkeletonMediumText />;
    case 'mined':
      return <SkeletonMediumText />;
    case 'transactions':
      return <SkeletonShortDigit />;
    default:
      return <SkeletonTextSpan />;
  }
};

export const SkeletonBlockList = () => {
  return (
    <Section title="Recent Blocks">
      <Flex flexDirection="column" flexGrow={1} px="loose">
        {[...Array(10)].map((_, i) => (
          <SkeletonBlock key={i} />
        ))}
      </Flex>
    </Section>
  );
};
