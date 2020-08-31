import { BoxProps } from '@stacks/ui';
import { Ref } from 'react';

interface PopoverPropsBase {
  onItemClick?: (item?: any) => void;
  dismiss?: () => void;
  itemComponent?: any;
  items: any[];
  cardProps?: BoxProps;
  wrapperProps?: BoxProps;
  label?: string;
  triggerRef: Ref<any>;
  hideItems?: boolean;
  showOnClickOrFocus?: boolean;
  isVisible?: boolean;
  showBackdrop?: boolean;
  showClose?: 'mobile' | 'always' | undefined;
  activeItem?: number;
  placement?: 'left' | 'right';
  lockBodyScroll?: boolean;
}
export type PopoverProps = PopoverPropsBase & BoxProps;

export interface UsePopoverProps {
  length: number;
  triggerRef: any;
  wrapperRef: any;
  showOnClickOrFocus?: boolean;
  lockBodyScroll?: boolean;
}
