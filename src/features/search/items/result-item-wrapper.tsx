import { forwardRef } from 'react';

import { Flex, FlexProps } from '../../../ui/Flex';

export const ResultItemWrapper = forwardRef<HTMLDivElement, FlexProps>(
  ({ children, ...rest }, ref) => (
    <Flex ref={ref}>
      <Flex
        alignItems="center"
        position="relative"
        justifyContent="space-between"
        flexGrow={1}
        {...rest}
      >
        <Flex flexGrow={1} alignItems="center" justifyContent="space-between">
          {children}
        </Flex>
      </Flex>
    </Flex>
  )
);
