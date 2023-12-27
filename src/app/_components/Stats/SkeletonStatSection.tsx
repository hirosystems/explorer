import * as React from 'react';
import { FC } from 'react';

import { Box } from '../../../ui/Box';
import { GridProps } from '../../../ui/Grid';
import { Skeleton } from '../../../ui/Skeleton';
import { SkeletonText } from '../../../ui/SkeletonText';
import { Text } from '../../../ui/Text';
import { StatSection } from './StatSection';

export const SkeletonStatSection: FC<GridProps> = props => (
  <StatSection
    title={
      <Skeleton height={'full'} width={'75%'}>
        <Text fontSize={'xs'} width={24}>
          -
        </Text>
      </Skeleton>
    }
    bodyMainText={
      <Skeleton>
        <Text fontSize={'xl'} width={24}>
          -
        </Text>
      </Skeleton>
    }
    bodySecondaryText={null}
    caption={
      <Skeleton height={'full'} width={'90%'}>
        <Text fontSize={'xs'} width={24}>
          -
        </Text>
      </Skeleton>
    }
    borderColor={'border'}
    {...props}
  />
);
