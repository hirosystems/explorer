import { useTxTableFilters } from '@/common/components/table/tx-table/useTxTableFilters';

import { FilterAccordionItem, getFilterAccordionItemContainerProps } from '../FilterAccordionItem';
import { AddressFilterForm } from './AddressFilterForm';
import { AddressFilterTrigger } from './AddressFilterTrigger';

export const AddressFilterAccordionItem = ({
  id,
  open,
  setOpen,
  addressFilterHandler,
  onSubmit,
}: {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  addressFilterHandler: (fromAddress?: string, toAddress?: string) => void;
  onSubmit?: (fromAddress: string, toAddress: string) => void;
}) => {
  const { fromAddress, toAddress } = useTxTableFilters();

  return (
    <FilterAccordionItem
      id={id}
      trigger={
        <AddressFilterTrigger
          fromAddress={fromAddress}
          toAddress={toAddress}
          open={open}
          setOpen={setOpen}
          addressFilterHandler={addressFilterHandler}
          filterContainerProps={getFilterAccordionItemContainerProps}
        />
      }
      content={
        <AddressFilterForm
          defaultFromAddress={fromAddress}
          defaultToAddress={toAddress}
          onSubmit={onSubmit}
        />
      }
    />
  );
};
