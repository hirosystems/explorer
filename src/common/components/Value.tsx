import { ReactNode } from 'react';

import { Text, TextProps } from '../../ui/Text';

export function Value({ children, ...rest }: { children: ReactNode } & TextProps) {
  return (
    <Text color={'text'} fontSize={'xs'} {...rest}>
      {children}
    </Text>
  );
}
