import { FilterAccordionItem, getFilterAccordionItemContainerProps } from '../FilterAccordionItem';
import { SingleAddressFilterForm } from './SingleAddressFilterForm';
import { SingleAddressFilterTrigger } from './SingleAddressFilterTrigger';

export const SingleAddressFilterAccordionItem = ({
  id,
  open,
  setOpen,
  defaultAddress,
  addressFilterHandler,
  onSubmit,
}: {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultAddress?: string;
  addressFilterHandler: (address?: string) => void;
  onSubmit?: (address: string) => void;
}) => {
  return (
    <FilterAccordionItem
      id={id}
      trigger={
        <SingleAddressFilterTrigger
          address={defaultAddress}
          open={open}
          setOpen={setOpen}
          addressFilterHandler={addressFilterHandler}
          filterContainerProps={getFilterAccordionItemContainerProps}
        />
      }
      content={<SingleAddressFilterForm defaultAddress={defaultAddress} onSubmit={onSubmit} />}
    />
  );
};
