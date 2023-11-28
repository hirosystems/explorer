import { FC, ReactNode } from 'react';
import * as React from 'react';

import { numberToString } from '../../../common/utils/utils';
import { GridProps } from '../../../ui/Grid';
import { StatSection } from './StatSection';

export const StackingCycle: FC<
  {
    title: string;
    stackedSTX?: number;
    caption: ReactNode;
  } & GridProps
> = ({ title, stackedSTX, caption, ...rest }) => {
  return (
    <StatSection
      title={title}
      bodyMainText={stackedSTX ? numberToString(stackedSTX) : '0'}
      bodySecondaryText=" STX stacked"
      caption={caption}
      {...rest}
    />
  );
};
