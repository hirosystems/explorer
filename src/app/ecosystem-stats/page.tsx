'use client';

import { Flex, Grid, Select, Tooltip } from '@/ui/components';
import type { NextPage } from 'next';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { HighLevelStats } from '@/app/ecosystem-stats/components/HighlevelStats';
import { Title } from '@/ui/typography';
import { MonthlyActiveDevelopersChartSection } from '@/app/ecosystem-stats/components/MonthlyActiveDevelopersChartSection';
import { formatUTCDate } from '@/common/utils/formatUTCDate';
import { InfoCircleIcon } from '@/components/icons/info-circle';

const EcosystemPage: NextPage = () => {
  const [windowSize, setWindowSize] = useState(4);
  const [period, setPeriod] = useState(6 * 4);
  const [weeklyContributionData, setWeeklyContributionData] = useState<
    { weekStartDateTs: string; numberOfContributors: number }[]
  >([]);

  useEffect(() => {
    const loadJson = async () => {
      try {
        const data = await import(`../../data/windowSize-${windowSize}.json`);
        setWeeklyContributionData(data.default);
      } catch (err) {
        console.log(err);
        console.error(`Failed to load windowSize-${windowSize}.json: ${err.message}`);
      }
    };
    void loadJson();
  }, [windowSize]);

  if (!weeklyContributionData[0]?.weekStartDateTs) return null;

  return (
    <Grid mt="32px" gap="32px" width="100%" gridTemplateColumns={['100%']}>
      <Title
        as="h1"
        fontSize="36px"
        display="block"
        width="100%"
        textAlign={['center', 'left']}
        mt="40px"
        mb="0"
        data-test="homepage-title"
        color="white"
      >
        Ecosystem stats{' '}
      </Title>
      <HighLevelStats
        activeDevelopersCount={weeklyContributionData[0]?.numberOfContributors || 0}
        repoCount={1656}
        commitCount={27}
        periodEndDate={formatUTCDate(
          new Date(Number(weeklyContributionData[0]?.weekStartDateTs) * 1000)
        )}
        windowSize={windowSize}
      />
      <MonthlyActiveDevelopersChartSection
        weeklyContributionData={weeklyContributionData}
        period={period}
        windowSize={windowSize}
        controls={
          <Grid
            gap={'8px'}
            gridTemplateColumns={['100%', '100%', '0.4fr 0.6fr']}
            width={['auto', 'auto', '310px']}
          >
            <Select
              name="windowSize"
              onChange={e => {
                setPeriod(Number(e.target.value));
              }}
              flexGrow={1}
              bg={'white'}
              color={`black`}
              value={period}
            >
              <option label={`Max`} value={0}>
                max
              </option>
              <option label={`5 years`} value={5 * 52}>
                5 years
              </option>
              <option label={`2 years`} value={2 * 52}>
                2 years
              </option>
              <option label={`1 year`} value={52}>
                1 year
              </option>
              <option label={`6 months`} value={6 * 4}>
                6 months
              </option>
              <option label={`3 months`} value={3 * 4}>
                3 months
              </option>
            </Select>
            <Select
              name="windowSize"
              placeholder="no rolling window"
              onChange={e => {
                setWindowSize(Number(e.target.value) || 1);
              }}
              flexGrow={1}
              bg={'white'}
              color={`black`}
              value={windowSize}
            >
              {[...Array(11)].map((_, i) => (
                <option
                  key={`${i + 2}-week${i === 0 ? '' : 's'}`}
                  label={`${i + 2} week${i === 0 ? '' : 's'}`}
                  value={i + 2}
                >
                  {i + 2} week{i === 0 ? '' : 's'}
                </option>
              ))}
            </Select>
          </Grid>
        }
      />
    </Grid>
  );
};

export default EcosystemPage;
