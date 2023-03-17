import { Text } from '@/ui/typography';
import { FC, PropsWithChildren } from 'react';

export const Value: FC<PropsWithChildren> = ({ children }) => (
  <Text fontWeight={500} fontSize={'14px'} lineHeight={'1em'}>
    {children}
  </Text>
);
