import { FC } from 'react';
import { AiOutlineEye, AiOutlineStar } from 'react-icons/ai';
import { MdPeopleOutline } from 'react-icons/md';
import { PiGitCommitDuotone, PiGitForkDuotone, PiGitMergeDuotone } from 'react-icons/pi';
import { VscDiffAdded, VscDiffRemoved } from 'react-icons/vsc';

import { Flex } from '../../../../ui/Flex';
import { DeveloperData } from '../types';
import { DeveloperStat } from './DeveloperStat';

export const Developers: FC<{ developerData: DeveloperData }> = ({ developerData }) => {
  const developerStat = [
    {
      value: developerData?.forks || 0,
      label: 'Forks',
      icon: PiGitForkDuotone,
    },
    {
      value: developerData?.stars || 0,
      label: 'Stars',
      icon: AiOutlineStar,
    },
    {
      value: developerData?.subscribers || 0,
      label: 'Subscribers',
      icon: AiOutlineEye,
    },
    {
      value: `${developerData?.closed_issues || 0} / ${developerData?.total_issues || 0}`,
      label: 'Closed issues / Total issues',
      icon: null,
    },
    {
      value: developerData?.pull_requests_merged || 0,
      label: 'PRs merged',
      icon: PiGitMergeDuotone,
    },
    {
      value: developerData?.pull_request_contributors || 0,
      label: 'PR contributors',
      icon: MdPeopleOutline,
    },
    {
      value: developerData?.commit_count_4_weeks || 0,
      label: 'Commits (4 weeks)',
      icon: PiGitCommitDuotone,
    },
    {
      value: developerData?.code_additions_deletions_4_weeks?.additions || 0,
      label: 'Additions (4 weeks)',
      icon: VscDiffAdded,
    },
    {
      value: developerData?.code_additions_deletions_4_weeks?.deletions || 0,
      label: 'Deletions (4 weeks)',
      icon: VscDiffRemoved,
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
