import { ReactNode } from 'react';
import { Text } from '@/ui/typography';

export function Value({ children }: { children: ReactNode }) {
  return (
    <Text fontWeight={500} fontSize="14px" lineHeight="1em">
      {children}
    </Text>
  );
}
