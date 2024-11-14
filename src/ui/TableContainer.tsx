'use client';

// source is from chakra v2. deprecated in chakra v3. TODO: remove
import { HTMLChakraProps, chakra } from '@chakra-ui/react';
import { forwardRef } from 'react';

export interface TableContainerProps extends HTMLChakraProps<'div'> {}

export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(
  (props: HTMLChakraProps<'div'>, ref) => {
    const { overflow, overflowX, className, ...rest } = props;
    return (
      <chakra.div
        ref={ref}
        className={`chakra-table__container ${className || ''}`}
        {...rest}
        css={{
          display: 'block',
          whiteSpace: 'nowrap',
          WebkitOverflowScrolling: 'touch',
          overflowX: overflow ?? overflowX ?? 'auto',
          overflowY: 'hidden',
          maxWidth: '100%',
        }}
      />
    );
  }
);
