import { Flex } from '@chakra-ui/react';
import {
  Eye,
  GitCommit,
  GitFork,
  GitMerge,
  MinusSquare,
  PlusSquare,
  Star,
  Users,
} from '@phosphor-icons/react';
import { FC } from 'react';

import { DeveloperData } from '../types';
import { DeveloperStat } from './DeveloperStat';

export const Developers: FC<{ developerData: DeveloperData }> = ({ developerData }) => {
  const developerStat = [
    {
      value: developerData?.forks || 0,
      label: 'Forks',
      icon: <GitFork />,
    },
    {
      value: developerData?.stars || 0,
      label: 'Stars',
      icon: <Star />,
    },
    {
      value: developerData?.subscribers || 0,
      label: 'Subscribers',
      icon: <Eye />,
    },
    {
      value: `${developerData?.closed_issues || 0} / ${developerData?.total_issues || 0}`,
      label: 'Closed issues / Total issues',
      icon: null,
    },
    {
      value: developerData?.pull_requests_merged || 0,
      label: 'PRs merged',
      icon: <GitMerge />,
    },
    {
      value: developerData?.pull_request_contributors || 0,
      label: 'PR contributors',
      icon: <Users />,
    },
    {
      value: developerData?.commit_count_4_weeks || 0,
      label: 'Commits (4 weeks)',
      icon: <GitCommit />,
    },
    {
      value: developerData?.code_additions_deletions_4_weeks?.additions || 0,
      label: 'Additions (4 weeks)',
      icon: <PlusSquare />,
    },
    {
      value: developerData?.code_additions_deletions_4_weeks?.deletions || 0,
      label: 'Deletions (4 weeks)',
      icon: <MinusSquare />,
    },
  ];
  return (
    <Flex width="100%" flexWrap={'wrap'} justifyContent={'center'} p={['0px', '0px', '20px']}>
      {developerStat.map(({ icon, label, value }, index) => (
        <DeveloperStat
          value={value}
          label={label}
          icon={icon}
          flex={['0 0 calc(50% - 20px)', '0 0 calc(50% - 20px)', '0 0 calc(33.33% - 20px)']}
          borderRightWidth={[
            (index + 1) % 2 !== 0 && index < developerStat.length - 1 ? '1px' : '0px',
            (index + 1) % 2 !== 0 && index < developerStat.length - 1 ? '1px' : '0px',
            (index + 1) % 3 !== 0 && index < developerStat.length - 1 ? '1px' : '0px',
          ]}
        />
      ))}
    </Flex>
  );
};
