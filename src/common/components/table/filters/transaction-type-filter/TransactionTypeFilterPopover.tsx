import { Box } from '@chakra-ui/react';

import { FilterTabPopover, getFilterTabPopoverContainerProps } from '../FilterTabPopover';
import { TransactionTypeFilterForm } from './TransactionTypeFilterForm';
import { TransactionTypeFilterTrigger } from './TransactionTypeFilterTrigger';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function TransactionTypeFilterPopover({
  idExtension = '',
  defaultTransactionType = [],
  clearFilterHandler,
  onSubmit,
}: {
  idExtension?: string;
  defaultTransactionType?: string[];
  clearFilterHandler: () => void;
  onSubmit: (transactionType: string[]) => void;
}) {
  return (
    <FilterTabPopover
      id={`transaction-type-filter-popover${idExtension ? `-${idExtension}` : ''}`}
      positioning={{
        placement: 'bottom-start',
        offset: { mainAxis: TAB_HEIGHT_ADJUSTMENT },
        sameWidth: true,
      }}
      trigger={(open, setOpen) => (
        <TransactionTypeFilterTrigger
          open={open}
          setOpen={setOpen}
          transactionType={defaultTransactionType}
          clearFilterHandler={clearFilterHandler}
          filterContainerProps={getFilterTabPopoverContainerProps}
        />
      )}
      content={(open, setOpen) => (
        <Box px={1.5} pt={2} pb={3}>
          <TransactionTypeFilterForm
            onSubmit={(transactionType: string[]) => {
              setOpen(false);
              onSubmit(transactionType);
            }}
            open={open}
            defaultTransactionType={defaultTransactionType}
          />
        </Box>
      )}
    />
  );
}
