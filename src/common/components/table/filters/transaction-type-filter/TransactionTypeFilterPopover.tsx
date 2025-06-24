import { Box } from '@chakra-ui/react';

import { FilterTabPopover, getFilterTabPopoverContainerProps } from '../FilterTabPopover';
import { TransactionTypeFilterForm } from './TransactionTypeFilterForm';
import { TransactionTypeFilterTrigger } from './TransactionTypeFilterTrigger';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function TransactionTypeFilterPopover({
  idExtension = '',
  defaultTransactionType = [],
  transactionTypeFilterHandler,
}: {
  idExtension?: string;
  defaultTransactionType?: string[];
  transactionTypeFilterHandler: (transactionType?: string[]) => void;
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
          transactionType={defaultTransactionType}
          transactionTypeFilterHandler={transactionTypeFilterHandler}
          filterContainerProps={getFilterTabPopoverContainerProps}
        />
      )}
      content={(open, setOpen) => (
        <Box px={1.5} pt={2} pb={3}>
          <TransactionTypeFilterForm
            onSubmit={(transactionType: string[]) => {
              setOpen(false);
              transactionTypeFilterHandler(transactionType);
            }}
            open={open}
            defaultTransactionType={defaultTransactionType}
          />
        </Box>
      )}
    />
  );
}
