'use client';

import { chakra } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { BoxProps } from './Box';

export type Direction = 'up' | 'down' | 'left' | 'right';

interface ChevronPropsBase {
  size: string;
  direction?: Direction;
}
type ChevronProps = ChevronPropsBase & Omit<BoxProps, 'direction'> & React.SVGProps<SVGSVGElement>;

const rotate = (direction: Direction = 'right') => {
  switch (direction) {
    case 'left':
      return '90';
    case 'up':
      return '180';
    case 'right':
      return '270';
    case 'down':
      return 0;
    default:
      throw new Error('`rotate` must receive direction parameter');
  }
};

export const ChevronIcon = forwardRef<SVGSVGElement, ChevronProps>(
  ({ direction, size = '16px', style = {}, ...props }, ref) => (
    <chakra.svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{ ...style, transform: `rotate(${rotate(direction)}deg)` }}
      {...props}
    >
      <path
        fill="currentColor"
        d="M4.7 7.367l3.3 3.3 3.3-3.3-.943-.943L8 8.78 5.643 6.424l-.943.943z"
      />
    </chakra.svg>
  )
);
