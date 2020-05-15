import { BoxProps } from '@blockstack/ui';
import { Ref } from 'react';

export interface PopoverProps extends BoxProps {
  onItemClick?: (item?: any) => void;
  dismiss?: () => void;
  itemComponent?: any;
  items: any[];
  cardProps?: BoxProps;
  wrapperProps?: BoxProps;
  label?: string;
  triggerRef: Ref<any>;
  hideItems?: boolean;
  activeItem?: number;
}

export interface UsePopoverProps {
  length: number;
  triggerRef: any;
}
