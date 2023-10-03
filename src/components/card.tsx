import { useColorMode } from '@chakra-ui/react';

import { memo } from 'react';
import { Flex, FlexProps } from '@/ui/components';

export const Card = memo((props: FlexProps) => {
  return (
    <Flex
      flexDirection="column"
      borderRadius="12px"
      borderWidth="1px"
      bg={`bg.${useColorMode().colorMode}`}
      {...props}
    />
  );
});
