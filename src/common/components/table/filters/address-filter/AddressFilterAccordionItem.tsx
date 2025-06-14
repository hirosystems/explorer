import { useTxTableFilters } from '@/common/components/table/tx-table/useTxTableFilters';

import { FilterAccordionItem, getFilterAccordionItemContainerProps } from '../FilterAccordionItem';
import { AddressFilterForm } from './AddressFilterForm';
import { AddressFilterTrigger } from './AddressFilterTrigger';

export const AddressFilterAccordionItem = ({
  id,
  open,
  setOpen,
  clearFilterHandler,
  onSubmit,
}: {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  clearFilterHandler: () => void;
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
          clearFilterHandler={clearFilterHandler}
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
  // return (
  //   <AccordionItem borderBottom={'none'} value={id} aria-label="Address filter options">
  //     <AccordionItemTrigger
  //       alignItems="center"
  //       bg="surfacePrimary"
  //       borderTopRadius="redesign.md"
  //       borderBottomRadius={open ? 'none' : 'redesign.md'}
  //       w="full"
  //       p={3}
  //     >
  //       <AddressFilterTrigger fromAddress={fromAddress} toAddress={toAddress} open={open} />
  //     </AccordionItemTrigger>
  //     <AccordionItemContent
  //       bg="surfacePrimary"
  //       borderBottomRadius="redesign.md"
  //       borderTopRadius={'none'}
  //       p={1.5} // I think there is a bug on Chakra that's causing the padding here to be applied to 2 divs surrounding the content
  //     >
  //       <AddressFilterForm
  //         defaultFromAddress={fromAddress}
  //         defaultToAddress={toAddress}
  //         onSubmit={onSubmit}
  //       />
  //     </AccordionItemContent>
  //   </AccordionItem>
  // );
};
