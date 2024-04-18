import { ReactNode } from 'react';

export interface NavItem {
  id: string;
  label: string | ReactNode;
  children?: ReactNode;
  href?: string;
  onClick?: () => void;
}
