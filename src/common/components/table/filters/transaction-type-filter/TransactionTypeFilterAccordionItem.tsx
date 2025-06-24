import { useTxTableFilters } from '@/common/components/table/tx-table/useTxTableFilters';

import { FilterAccordionItem, getFilterAccordionItemContainerProps } from '../FilterAccordionItem';
import { TransactionTypeFilterForm } from './TransactionTypeFilterForm';
import { TransactionTypeFilterTrigger } from './TransactionTypeFilterTrigger';

export const TransactionTypeFilterAccordionItem = ({
  id,
  open,
  setOpen,
  onSubmit,
  transactionTypeFilterHandler,
}: {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (transactionType: string[]) => void;
  transactionTypeFilterHandler: (transactionType?: string[]) => void;
}) => {
  const { transactionType } = useTxTableFilters();

  return (
    <FilterAccordionItem
      id={id}
      trigger={
        <TransactionTypeFilterTrigger
          open={open}
          setOpen={setOpen}
          transactionType={transactionType}
          transactionTypeFilterHandler={transactionTypeFilterHandler}
          filterContainerProps={getFilterAccordionItemContainerProps}
        />
      }
      content={
        <TransactionTypeFilterForm
          open={open}
          onSubmit={onSubmit}
          defaultTransactionType={transactionType}
        />
      }
    />
  );
};
