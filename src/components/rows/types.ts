import React from 'react';
import { FlexProps } from '@blockstack/ui';

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
}

export interface RowWrapperProps extends FlexProps {
  inline?: boolean;
}

export interface RowContentProps {
  isHovered: boolean;
  copy?: string;
}

export interface CopyProps {
  isHovered?: boolean;
  onClick?: () => void;
}

export interface Item {
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
}
