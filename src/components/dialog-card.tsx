import * as React from 'react';
import { Flex, FlexProps } from '@stacks/ui';

export const DialogCard = (props: FlexProps) => {
  return (
    <Flex
      flexDirection="column"
      border="1px solid #E1E3E8"
      width="100%"
      borderRadius="6px"
      boxShadow="0px 8px 16px rgba(27, 39, 51, 0.08)"
      bg="white"
      {...props}
      style={{ overflowY: 'auto', ...props.style }}
    />
  );
};
