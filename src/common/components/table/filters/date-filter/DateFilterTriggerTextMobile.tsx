import { Text } from '@/ui/Text';
import { Flex } from '@chakra-ui/react';
import { UTCDate } from '@date-fns/utc';
import { useEffect, useState } from 'react';

import { useTxTableFilters } from '../../TxTableFilterContext';

export const DateFilterTriggerTextMobile = ({
  defaultStartTime,
  defaultEndTime,
  open,
}: {
  defaultStartTime?: string;
  defaultEndTime?: string;
  open: boolean;
}) => {
  const defaultStartTimeNumber = isNaN(Number(defaultStartTime)) ? null : Number(defaultStartTime);
  const defaultEndTimeNumber = isNaN(Number(defaultEndTime)) ? null : Number(defaultEndTime);

  const [startTime, setStartTime] = useState<UTCDate | null>(
    defaultStartTimeNumber ? new UTCDate(defaultStartTimeNumber * 1000) : null
  );
  const [endTime, setEndTime] = useState<UTCDate | null>(
    defaultEndTimeNumber ? new UTCDate(defaultEndTimeNumber * 1000) : null
  );

  const { filters } = useTxTableFilters() || {};

  useEffect(() => {
    const { startTime: contextStartTime, endTime: contextEndTime } = filters?.dates || {};
    setStartTime(contextStartTime ? new UTCDate(Number(contextStartTime) * 1000) : null);
    setEndTime(contextEndTime ? new UTCDate(Number(contextEndTime) * 1000) : null);
  }, [filters]);

  const isDateSet = startTime || endTime;
  const triggerTextPrefix = isDateSet ? 'Date:' : 'Date';
  const triggerTextSuffix =
    startTime && endTime
      ? `Between ${startTime.toLocaleDateString()} - ${endTime.toLocaleDateString()}`
      : startTime
        ? `After ${startTime.toLocaleDateString()}`
        : endTime
          ? `Before ${endTime.toLocaleDateString()}`
          : '';

  return (
    <Flex gap={1}>
      <Text
        textStyle="text-medium-sm"
        color={open ? 'textPrimary' : 'textSecondary'}
        _groupHover={{ color: 'textPrimary' }}
      >
        {triggerTextPrefix}
      </Text>
      {isDateSet && (
        <Text textStyle="text-medium-sm" color="textPrimary">
          {triggerTextSuffix}
        </Text>
      )}
    </Flex>
  );
};
