import { ReactNode } from 'react';

export interface NavItem {
  id: string;
  label: string | ReactNode;
  children?: NavItem[];
  href?: string;
  onClick?: () => void;
}
