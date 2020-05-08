import { BoxProps } from '@blockstack/ui';
import { RecentlyViewedProps } from '@components/recently-viewed';

export interface ErrorType {
  success: boolean;
  message?: string;
}

export interface SearchBarProps extends BoxProps {
  inputOffset?: string;
  value?: string;
  boxProps?: BoxProps;
  inputRef?: any;
  small?: boolean;
  recentlyViewedProps?: RecentlyViewedProps;
  clearError?: () => void;
  error?: ErrorType;
}
