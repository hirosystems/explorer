import { ReactNode } from 'react';

import { Text, TextProps } from '../../ui/Text';

export function ListHeader({ children, ...textProps }: { children: ReactNode } & TextProps) {
  return (
    <Text
      py={2}
      px={2.5}
      color="table.header.text"
      bg="table.header.background"
      fontSize={'xs'}
      rounded={'md'}
      whiteSpace={'nowrap'}
      {...textProps}
    >
      {children}
    </Text>
  );
}
