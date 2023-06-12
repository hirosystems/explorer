import { StatSection } from '@/app/stats/StatSection';
import { ErrorBoundary } from 'react-error-boundary';
import { Card } from '@/components/card';
import { FC } from 'react';
import { Tooltip } from '@/ui/Tooltip';
import { Flex } from '@/ui/Flex';
import { InfoCircleIcon } from '@/components/icons/info-circle';
import * as React from 'react';

export const HighLevelStats: FC<{
  activeDevelopersCount: number;
  repoCount: number;
  commitCount: number;
  periodEndDate: string;
  windowSize: number;
}> = ({ activeDevelopersCount, commitCount, repoCount, periodEndDate, windowSize }) => {
  return (
    <ErrorBoundary fallbackRender={() => null}>
      <Card display={'grid'} gridTemplateColumns={['100%', '100%', '1fr 1fr 1fr']}>
        <StatSection
          title={`${windowSize === 4 ? 'Monthly' : 'Weekly'} Active Developers`}
          bodyMainText={activeDevelopersCount}
          bodySecondaryText={
            <Flex>
              as of {periodEndDate}
              {windowSize > 1 && windowSize !== 4 ? ` (rolling ${windowSize}-week)` : ''}
              {windowSize === 4 && (
                <Tooltip
                  label={`The calculation for monthly developers is based on a 4-week rolling window.`}
                  placement="bottom"
                >
                  <Flex alignItems={'center'}>
                    &nbsp;
                    <InfoCircleIcon width="18px" height="18px" />
                  </Flex>
                </Tooltip>
              )}
            </Flex>
          }
          borderRightWidth={['0px', '0px', '1px']}
        />
        <StatSection
          title={'Total Stacks Repos'}
          bodyMainText={repoCount}
          bodySecondaryText={`as of ${periodEndDate}`}
          borderRightWidth={['0px', '0px', '1px']}
        />
        <StatSection
          title={'Total Stacks Commits'}
          bodyMainText={commitCount}
          bodySecondaryText={`as of ${periodEndDate}`}
        />
      </Card>
    </ErrorBoundary>
  );
};
