import React from 'react';

import { BoxProps, FlexProps } from '@stacks/ui';

export interface RowProps extends FlexProps {
  card?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  copy?: string;
  label?:
    | {
        children: any;
      }
    | string;
  render?: any;
  inline?: boolean;
  noTopBorder?: boolean;
  onClick?: any;
}

export interface RowWrapperProps extends FlexProps {
  inline?: boolean;
}

export interface RowContentProps {
  isHovered: boolean;
  label?: string;
  flexGrow?: BoxProps['flexGrow'];
  copy?: string;
}

export interface CopyProps {
  isHovered?: boolean;
  hasCopied?: boolean;
  onClick?: () => void;
}

export interface Item extends Partial<BoxProps> {
  condition?: boolean;
  label?: {
    children: any;
  };
  children: any;
  copy?: string; // the value to copy
}

export interface RowsProps {
  card?: boolean;
  childComponent?: React.FC<RowProps>;
  items: Item[];
  columnLabels?: string[];
  inline?: boolean;
  noTopBorder?: boolean;
  noBottomBorder?: boolean;
}
