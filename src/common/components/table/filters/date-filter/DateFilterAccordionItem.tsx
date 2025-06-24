import { useTxTableFilters } from '@/common/components/table/tx-table/useTxTableFilters';

import { FilterAccordionItem, getFilterAccordionItemContainerProps } from '../FilterAccordionItem';
import { DateFilterTabs } from './DateFilterTabs';
import { DateFilterTrigger } from './DateFilterTrigger';

export const DateFilterAccordionItem = ({
  id,
  open,
  setOpen,
  dateFilterHandler,
  onSubmit,
}: {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  dateFilterHandler: (startTime?: number, endTime?: number) => void;
  onSubmit: (startTime?: number, endTime?: number) => void;
}) => {
  const { startTime, endTime } = useTxTableFilters();

  return (
    <FilterAccordionItem
      id={id}
      trigger={
        <DateFilterTrigger
          startTime={startTime}
          endTime={endTime}
          open={open}
          setOpen={setOpen}
          dateFilterHandler={dateFilterHandler}
          filterContainerProps={getFilterAccordionItemContainerProps}
        />
      }
      content={
        <DateFilterTabs defaultStartTime={startTime} defaultEndTime={endTime} onSubmit={onSubmit} />
      }
    />
  );
};
