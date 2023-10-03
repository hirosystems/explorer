import { ReactNode } from 'react';
import { numberToString } from '@/common/utils';
import { GridProps } from '@/ui/Grid';
import { StatSection } from './StatSection';

export function StackingCycle({
  title,
  stackedSTX,
  caption,
  ...rest
}: {
  title: string;
  stackedSTX?: number;
  caption: ReactNode;
} & GridProps) {
  return (
    <StatSection
      title={title}
      bodyMainText={stackedSTX ? numberToString(stackedSTX) : '0'}
      bodySecondaryText=" STX stacked"
      caption={caption}
      {...rest}
    />
  );
}
