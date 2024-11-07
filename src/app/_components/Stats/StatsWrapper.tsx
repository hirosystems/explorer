import { FlexProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { Card } from '../../../common/components/Card';

export function StatsWrapper({ children, ...props }: { children: ReactNode } & FlexProps) {
  return (
    <Card
      display={'grid'}
      gridColumnStart={'1'}
      gridColumnEnd={['2', '2', '3']}
      gridTemplateColumns={[
        '100%',
        '100%',
        'minmax(0, 1fr) minmax(0, 1fr)',
        'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
      ]}
      {...props}
    >
      {children}
    </Card>
  );
}
