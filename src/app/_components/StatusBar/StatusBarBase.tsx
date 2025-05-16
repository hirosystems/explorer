import { PAGE_MAX_WIDTH } from '@/common/constants/constants';
import { Flex, FlexProps } from '@chakra-ui/react';
import { ReactNode, forwardRef } from 'react';

export const StatusBarBase = forwardRef<
  HTMLDivElement,
  {
    content: ReactNode;
  } & Omit<FlexProps, 'content'>
>(({ content, ...flexProps }, ref) => {
  return (
    <Flex
      w="full"
      alignItems="center"
      justifyContent="center"
      ref={ref}
      backdropFilter={'blur(10px)'}
      bg={'surfaceOpposite'}
      borderTop="1px solid"
      borderColor="statusPage.border"
      py={3}
      {...flexProps}
    >
      <Flex
        maxWidth={PAGE_MAX_WIDTH}
        alignItems="center"
        justifyContent="center"
        padding={'0 32px'}
        color={'statusPage.text'}
        fontWeight={'medium'}
      >
        {content}
      </Flex>
    </Flex>
  );
});
