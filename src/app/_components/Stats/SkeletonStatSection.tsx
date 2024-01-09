import * as React from 'react';
import { FC } from 'react';

import { GridProps } from '../../../ui/Grid';
import { SkeletonItem } from '../../../ui/SkeletonItem';
import { Text } from '../../../ui/Text';
import { StatSection } from './StatSection';

export const SkeletonStatSection: FC<GridProps> = props => (
  <StatSection
    title={
      <SkeletonItem height={'full'} width={'75%'}>
        <Text fontSize={'xs'} width={24}>
          -
        </Text>
      </SkeletonItem>
    }
    bodyMainText={
      <SkeletonItem>
        <Text fontSize={'xl'} width={24}>
          -
        </Text>
      </SkeletonItem>
    }
    bodySecondaryText={null}
    caption={
      <SkeletonItem height={'full'} width={'90%'}>
        <Text fontSize={'xs'} width={24}>
          -
        </Text>
      </SkeletonItem>
    }
    borderColor={'border'}
    {...props}
  />
);
