import { ReactNode } from 'react';

import { Card } from '../../../common/components/Card';

export function Wrapper({ children }: { children: ReactNode }) {
  return (
    <Card
      display={'grid'}
      gridColumnStart={'1'}
      gridColumnEnd={['2', '2', '3']}
      gridTemplateColumns={['100%', '100%', '1fr 1fr', '1fr 1fr 1fr 1fr']}
    >
      {children}
    </Card>
  );
}
