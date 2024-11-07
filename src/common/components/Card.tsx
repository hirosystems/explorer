import { Flex, FlexProps } from '@chakra-ui/react';

export function Card(props: FlexProps) {
  return (
    <Flex
      flexDirection="column"
      borderRadius="xl"
      bg={'surface'}
      border="normal"
      borderColor={'borderSecondary'}
      boxShadow={'0px 1px 2px 0px var(--stacks-colors-blackAlpha-50)'}
      {...props}
    />
  );
}
