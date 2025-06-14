import { useTxTableFilters } from '@/common/components/table/tx-table/useTxTableFilters';

import { FilterAccordionItem, getFilterAccordionItemContainerProps } from '../FilterAccordionItem';
import { TransactionTypeFilterForm } from './TransactionTypeFilterForm';
import { TransactionTypeFilterTrigger } from './TransactionTypeFilterTrigger';

export const TransactionTypeFilterAccordionItem = ({
  id,
  open,
  setOpen,
  onSubmit,
  clearFilterHandler,
}: {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (transactionType: string[]) => void;
  clearFilterHandler: () => void;
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
          clearFilterHandler={clearFilterHandler}
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
  // return (
  //   <AccordionItem borderBottom={'none'} value={id}>
  //     <AccordionItemTrigger
  //       alignItems="center"
  //       bg="surfacePrimary"
  //       borderTopRadius="redesign.md"
  //       borderBottomRadius={open ? 'none' : 'redesign.md'}
  //       w="full"
  //       p={3}
  //     >
  //       <TransactionTypeFilterTrigger
  //         open={open}
  //         transactionType={transactionType}
  //         setOpen={setOpen}
  //         clearFilterHandler={clearFilterHandler}
  //         filterContainerProps={FILTER_CONTAINER_PROPS}
  //       />
  //     </AccordionItemTrigger>
  //     <AccordionItemContent
  //       bg="surfacePrimary"
  //       borderBottomRadius="redesign.md"
  //       borderTopRadius={'none'}
  //       p={1.5} // I think there is a bug on Chakra that's causing the padding here to be applied to 2 divs surrounding the content
  //     >
  //       <TransactionTypeFilterForm
  //         open={open}
  //         onSubmit={onSubmit}
  //         defaultTransactionType={transactionType}
  //       />
  //     </AccordionItemContent>
  //   </AccordionItem>
  // );
};
