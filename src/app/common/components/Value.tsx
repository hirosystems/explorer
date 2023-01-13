import { Text } from '@/ui/typography';
import { FC } from 'react';

export const Value: FC = ({ children }) => (
  <Text fontWeight={500} fontSize={'14px'} lineHeight={'1em'}>
    {children}
  </Text>
);
