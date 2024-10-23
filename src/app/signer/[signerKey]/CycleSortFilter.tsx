import { SortDescending } from '@phosphor-icons/react';
import { useMemo } from 'react';

import { FilterMenu } from '../../../common/components/FilterMenu';

export enum CycleSortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

const cycleSortOrderLabels = {
  [CycleSortOrder.Asc]: 'Cycle Asc',
  [CycleSortOrder.Desc]: 'Cycle Desc',
};

function getSortOptionLabel(order: CycleSortOrder) {
  return cycleSortOrderLabels[order];
}

export function CycleSortFilter({
  cycleSortOrder,
  setCycleSortOrder,
}: {
  cycleSortOrder: CycleSortOrder;
  setCycleSortOrder: (order: CycleSortOrder) => void;
}) {
  const menuItems = useMemo(
    () =>
      Object.values(CycleSortOrder).map(order => ({
        onClick: () => {
          setCycleSortOrder(order);
        },
        label: getSortOptionLabel(order),
      })),
    [setCycleSortOrder]
  );

  return (
    <FilterMenu
      filterLabel={() => getSortOptionLabel(cycleSortOrder)}
      menuItems={menuItems}
      leftIcon={SortDescending}
    />
  );
}
