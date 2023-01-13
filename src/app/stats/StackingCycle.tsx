import { numberToString } from '@/common/utils';
import { GridProps } from '@/ui/Grid';
import * as React from 'react';
import { FC, ReactNode } from 'react';

import { SkeletonStatSection } from './SkeletonStatSection';
import { StatSection } from './StatSection';

export const StackingCycle: FC<
  {
    title: string;
    stackedSTX?: number;
    caption: ReactNode;
  } & GridProps
> = ({ title, stackedSTX, caption, ...rest }) => {
  if (!stackedSTX) {
    return <SkeletonStatSection />;
  }
  return (
    <StatSection
      title={title}
      bodyMainText={numberToString(stackedSTX)}
      bodySecondaryText=" STX stacked"
      caption={caption}
      {...rest}
    />
  );
};
