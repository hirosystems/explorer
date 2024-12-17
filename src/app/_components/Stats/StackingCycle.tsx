import { FC, ReactNode } from 'react';

import { abbreviateNumber } from '../../../common/utils/utils';
import { Box } from '../../../ui/Box';
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
      bodyMainText={stackedSTX ? abbreviateNumber(stackedSTX) : '0'}
      bodySecondaryText={<Box ml={1}>STX stacked</Box>}
      caption={caption}
      {...rest}
    />
  );
};
