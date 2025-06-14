import { useTxTableFilters } from '@/common/components/table/tx-table/useTxTableFilters';

import { FilterAccordionItem, getFilterAccordionItemContainerProps } from '../FilterAccordionItem';
import { DateFilterTabs } from './DateFilterTabs';
import { DateFilterTrigger } from './DateFilterTrigger';

export const DateFilterAccordionItem = ({
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
  onSubmit: (startTime?: number, endTime?: number) => void;
}) => {
  const { startTime, endTime, clearDateFilterHandler } = useTxTableFilters();

  return (
    <FilterAccordionItem
      id={id}
      trigger={
        <DateFilterTrigger
          startTime={startTime}
          endTime={endTime}
          open={open}
          setOpen={setOpen}
          clearFilterHandler={clearDateFilterHandler}
          filterContainerProps={getFilterAccordionItemContainerProps}
        />
      }
      content={
        <DateFilterTabs defaultStartTime={startTime} defaultEndTime={endTime} onSubmit={onSubmit} />
      }
    />
  );

  // return (
  //   <AccordionItem borderBottom={'none'} value={id} onClick={e => {
  //     console.log('dont do anything')
  //     e.stopPropagation();
  //   }}>
  //     <AccordionItemTrigger
  //       alignItems="center"
  //       bg="surfacePrimary"
  //       borderTopRadius="redesign.md"
  //       borderBottomRadius={open ? 'none' : 'redesign.md'}
  //       w="full"
  //       p={3}
  //     >
  //       <DateFilterTrigger
  //         startTime={startTime}
  //         endTime={endTime}
  //         open={open}
  //         setOpen={setOpen}
  //         clearFilterHandler={clearDateFilterHandler}
  //       />
  //     </AccordionItemTrigger>
  //     <AccordionItemContent
  //       bg="surfacePrimary"
  //       borderBottomRadius="redesign.md"
  //       borderTopRadius={'none'}
  //       p={1.5} // I think there is a bug on Chakra that's causing the padding here to be applied to 2 divs surrounding the content
  //     >
  //       <DateFilterTabs defaultStartTime={startTime} defaultEndTime={endTime} onSubmit={onSubmit} />
  //     </AccordionItemContent>
  //   </AccordionItem>
  // );
};
