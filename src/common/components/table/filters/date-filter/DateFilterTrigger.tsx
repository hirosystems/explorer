import { formatDate, parseUTCDate } from '@/common/utils/time-utils';
import { useCallback, useMemo } from 'react';

import { FilterTrigger, FilterTriggerContainerProps } from '../FilterTrigger';

export const DateFilterTrigger = ({
  open,
  startTime,
  endTime,
  setOpen,
  dateFilterHandler,
  filterContainerProps,
}: {
  open: boolean;
  startTime: string;
  endTime: string;
  setOpen: (open: boolean) => void;
  dateFilterHandler: (startTime?: number, endTime?: number) => void;
  filterContainerProps: FilterTriggerContainerProps;
}) => {
  const parsedStartTime = parseUTCDate(startTime);
  const parsedEndTime = parseUTCDate(endTime);

  const isDateSet = startTime || endTime;
  const triggerTextPrefix = isDateSet ? 'Date:' : 'Date';
  const triggerTextSuffix = useMemo(() => {
    if (parsedStartTime && parsedEndTime) {
      return `Between ${formatDate(
        parsedStartTime,
        { month: '2-digit', day: '2-digit', year: 'numeric' },
        'en-CA'
      )} - ${formatDate(parsedEndTime, { month: '2-digit', day: '2-digit', year: 'numeric' }, 'en-CA')}`;
    }
    if (parsedStartTime) {
      return `After ${formatDate(
        parsedStartTime,
        { month: '2-digit', day: '2-digit', year: 'numeric' },
        'en-CA'
      )}`;
    }
    if (parsedEndTime) {
      return `Before ${formatDate(
        parsedEndTime,
        { month: '2-digit', day: '2-digit', year: 'numeric' },
        'en-CA'
      )}`;
    }
    return '';
  }, [parsedStartTime, parsedEndTime]);

  const handleClearFilter = useCallback(() => {
    dateFilterHandler(undefined, undefined);
    setOpen?.(false);
  }, [dateFilterHandler, setOpen]);

  return (
    <FilterTrigger
      prefix={triggerTextPrefix}
      value={isDateSet ? triggerTextSuffix : ''}
      open={open}
      setOpen={setOpen}
      clearFilterHandler={handleClearFilter}
      containerProps={filterContainerProps}
    />
  );
};
