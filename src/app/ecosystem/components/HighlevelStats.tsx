import { StatSection } from '@/app/stats/StatSection';
import { ErrorBoundary } from 'react-error-boundary';
import { Card } from '@/components/card';
import { FC } from 'react';

export const HighLevelStats: FC = () => {
  return (
    <ErrorBoundary fallbackRender={() => null}>
      <Card display={'grid'} gridTemplateColumns={['100%', '100%', '1fr 1fr 1fr']}>
        <StatSection
          title={'monthly active developers'}
          bodyMainText={'116'}
          bodySecondaryText={'secondary text'}
          caption={'caption'}
          borderRightWidth={['0px', '0px', '1px']}
        />
        <StatSection
          title={'total stacks repos'}
          bodyMainText={'1,615'}
          bodySecondaryText={'secondary text'}
          caption={'caption'}
          borderRightWidth={['0px', '0px', '1px']}
        />
        <StatSection
          title={'total stacks commits'}
          bodyMainText={'761,636'}
          bodySecondaryText={'secondary text'}
          caption={'caption'}
        />
      </Card>
    </ErrorBoundary>
  );
};
