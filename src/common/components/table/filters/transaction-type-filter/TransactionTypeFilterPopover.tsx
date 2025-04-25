import { Box } from '@chakra-ui/react';

import { TableTabPopover } from '../TableTabPopover';
import { TransactionTypeFilterForm } from './TransactionTypeFilterForm';
import { TransactionTypeFilterTriggerText } from './TransactionTypeFilterTriggerText';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function TransactionTypeFilterPopover({
  idExtension = '',
  defaultTransactionType = [],
  onSubmit,
}: {
  idExtension?: string;
  defaultTransactionType?: string[];
  onSubmit: (transactionType: string[]) => void;
}) {
  return (
    <TableTabPopover
      id={`transaction-type-filter-popover${idExtension ? `-${idExtension}` : ''}`}
      positioning={{
        placement: 'bottom-start',
        offset: { mainAxis: TAB_HEIGHT_ADJUSTMENT },
        sameWidth: true,
      }}
      trigger={(open, setOpen) => (
        <TransactionTypeFilterTriggerText open={open} transactionType={defaultTransactionType} />
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
