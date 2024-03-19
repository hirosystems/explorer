import { useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { Text, TextProps } from '../../ui/Text';

export function ListHeader({ children, ...textProps }: { children: ReactNode } & TextProps) {
  const color = useColorModeValue('slate.700', 'slate.250');
  const bg = useColorModeValue('slate.150', 'slate.850');
  return (
    <Text
      py={2}
      px={2.5}
      color={color}
      bg={bg}
      fontSize={'xs'}
      rounded={'md'}
      whiteSpace={'nowrap'}
      {...textProps}
    >
      {children}
    </Text>
  );
}
