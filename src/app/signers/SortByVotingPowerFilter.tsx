import { useMemo } from 'react';
import { GoSortDesc } from 'react-icons/go';

import { FilterMenu } from '../../common/components/FilterMenu';

export enum VotingPowerSortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

function getSortOptionLabel(order: VotingPowerSortOrder) {
  switch (order) {
    case VotingPowerSortOrder.Asc:
      return 'Lowest voting power first';
    case VotingPowerSortOrder.Desc:
      return 'Highest voting power first';
  }
}

export function SortByVotingPowerFilter({
  votingPowerSortOrder,
  setVotingPowerSortOrder,
}: {
  votingPowerSortOrder: VotingPowerSortOrder;
  setVotingPowerSortOrder: (order: VotingPowerSortOrder) => void;
}) {
  const menuItems = useMemo(
    () =>
      Object.values(VotingPowerSortOrder).map(order => ({
        onClick: () => {
          setVotingPowerSortOrder(order as VotingPowerSortOrder);
        },
        label: getSortOptionLabel(order as VotingPowerSortOrder),
      })),
    [setVotingPowerSortOrder]
  );

  return (
    <FilterMenu
      filterLabel={() => getSortOptionLabel(votingPowerSortOrder)}
      menuItems={menuItems}
      leftIcon={GoSortDesc}
    />
  );
}
