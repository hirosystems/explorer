import { formatDate, parseUTCDate } from '@/common/utils/time-utils';
import { UTCDate } from '@date-fns/utc';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { FilterTriggerText } from '../FilterTriggerText';

export const DateFilterTriggerText = ({
  defaultStartTime,
  defaultEndTime,
  open,
}: {
  defaultStartTime?: string;
  defaultEndTime?: string;
  open: boolean;
}) => {
  const searchParams = useSearchParams();
  const [startTime, setStartTime] = useState<UTCDate | null>(
    defaultStartTime ? parseUTCDate(defaultStartTime) : null
  );
  const [endTime, setEndTime] = useState<UTCDate | null>(
    defaultEndTime ? parseUTCDate(defaultEndTime) : null
  );

  useEffect(() => {
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    setStartTime(startTime ? parseUTCDate(startTime) : null);
    setEndTime(endTime ? parseUTCDate(endTime) : null);
  }, [searchParams]);

  const isDateSet = startTime || endTime;
  const triggerTextPrefix = isDateSet ? 'Date:' : 'Date';
  const triggerTextSuffix = useMemo(() => {
    if (startTime && endTime) {
      return `Between ${formatDate(
        startTime,
        { month: '2-digit', day: '2-digit', year: 'numeric' },
        'en-CA'
      )} - ${formatDate(endTime, { month: '2-digit', day: '2-digit', year: 'numeric' }, 'en-CA')}`;
    }
    if (startTime) {
      return `After ${formatDate(
        startTime,
        { month: '2-digit', day: '2-digit', year: 'numeric' },
        'en-CA'
      )}`;
    }
    if (endTime) {
      return `Before ${formatDate(
        endTime,
        { month: '2-digit', day: '2-digit', year: 'numeric' },
        'en-CA'
      )}`;
    }
    return '';
  }, [startTime, endTime]);

  return (
    <FilterTriggerText
      prefix={triggerTextPrefix}
      value={isDateSet ? triggerTextSuffix : ''}
      open={open}
    />
  );
};
