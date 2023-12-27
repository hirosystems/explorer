import { ReactNode } from 'react';

import { Text, TextProps } from '../../ui/Text';

export function Value({ children, ...rest }: { children: ReactNode } & TextProps) {
  return (
    <Text fontWeight={'medium'} fontSize={'14px'} lineHeight={'1em'} {...rest}>
      {children}
    </Text>
  );
}
