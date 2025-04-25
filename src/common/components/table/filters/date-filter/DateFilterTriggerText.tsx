import { formatDate, parseUTCDate } from '@/common/utils/time-utils';
import { useMemo } from 'react';

import { FilterTriggerText } from '../FilterTriggerText';

export const DateFilterTriggerText = ({
  open,
  startTime,
  endTime,
}: {
  open: boolean;
  startTime: string;
  endTime: string;
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

  return (
    <FilterTriggerText
      prefix={triggerTextPrefix}
      value={isDateSet ? triggerTextSuffix : ''}
      open={open}
    />
  );
};
