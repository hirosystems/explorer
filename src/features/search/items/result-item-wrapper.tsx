import { Flex, FlexProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

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
