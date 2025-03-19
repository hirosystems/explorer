import { AfterForm } from '@/app/search/filters/After';
import { BeforeForm } from '@/app/search/filters/Before';
import { DateRangeForm } from '@/app/search/filters/DateRange';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import { UTCDate } from '@date-fns/utc';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Text } from '../../../ui/Text';
import {
  GooseNeckPopoverContent,
  GooseNeckPopoverRoot,
  GooseNeckPopoverTrigger,
} from '../GooseNeckPopover';

interface DateFilterProps {
  defaultStartTime?: string;
  defaultEndTime?: string;
}

const GOOSENECK_ADJUSTMENT = 4;

export function DateFilter({ defaultStartTime, defaultEndTime }: DateFilterProps) {
  const defaultStartTimeNumber = isNaN(Number(defaultStartTime)) ? null : Number(defaultStartTime);
  const defaultEndTimeNumber = isNaN(Number(defaultEndTime)) ? null : Number(defaultEndTime);
  const [open, setOpen] = useState(false);

  const populatedFilter =
    defaultStartTime && defaultEndTime
      ? 'dateRange'
      : defaultStartTime
        ? 'after'
        : defaultEndTime
          ? 'before'
          : null;

  const searchParams = useSearchParams();
  const [startTime, setStartTime] = useState<UTCDate | null>(
    defaultStartTimeNumber ? new UTCDate(defaultStartTimeNumber * 1000) : null
  );
  const [endTime, setEndTime] = useState<UTCDate | null>(
    defaultEndTimeNumber ? new UTCDate(defaultEndTimeNumber * 1000) : null
  );

  useEffect(() => {
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    setStartTime(startTime ? new UTCDate(Number(startTime) * 1000) : null);
    setEndTime(endTime ? new UTCDate(Number(endTime) * 1000) : null);
  }, [searchParams]);

  const isDateSet = startTime || endTime;
  const triggerTextPrefix = isDateSet ? 'Date: ' : 'Date';
  const triggerTextSuffix =
    startTime && endTime
      ? `Between ${startTime.toLocaleDateString()} - ${endTime.toLocaleDateString()}`
      : startTime
        ? `After ${startTime.toLocaleDateString()}`
        : endTime
          ? `Before ${endTime.toLocaleDateString()}`
          : '';

  const tabs = useMemo(
    () => [
      {
        id: 'between',
        title: 'Between',
        content: (
          <DateRangeForm
            defaultStartTime={populatedFilter === 'dateRange' ? defaultStartTimeNumber : null}
            defaultEndTime={populatedFilter === 'dateRange' ? defaultEndTimeNumber : null}
            onClose={() => setOpen(false)}
          />
        ),
      },
      {
        id: 'before',
        title: 'Before',
        content: (
          <BeforeForm
            defaultEndTime={populatedFilter === 'before' ? defaultEndTimeNumber : null}
            onClose={() => setOpen(false)}
          />
        ),
      },
      {
        id: 'after',
        title: 'After',
        content: (
          <AfterForm
            defaultStartTime={populatedFilter === 'after' ? defaultStartTimeNumber : null}
            onClose={() => setOpen(false)}
          />
        ),
      },
    ],
    [defaultStartTimeNumber, defaultEndTimeNumber, populatedFilter]
  );

  return (
    <GooseNeckPopoverRoot
      id={'date-filter-popover'}
      positioning={{ placement: 'bottom-start', offset: { mainAxis: GOOSENECK_ADJUSTMENT } }}
      open={open}
      onOpenChange={e => setOpen(e.open)}
    >
      <GooseNeckPopoverTrigger
        open={open}
        triggerText={open => (
          <>
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
          </>
        )}
        positioning={{ placement: 'bottom-start', offset: { mainAxis: GOOSENECK_ADJUSTMENT } }}
      />
      <GooseNeckPopoverContent maxWidth={'256px'} bgColor={'surfacePrimary'} p={3}>
        <TabsRoot defaultValue={tabs[0].id} size="redesignSm" variant="redesignPrimary">
          <TabsList mb={4}>
            {tabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(tab => (
            <TabsContent key={`${tab.id}-content`} value={tab.id}>
              {tab.content}
            </TabsContent>
          ))}
        </TabsRoot>
      </GooseNeckPopoverContent>
    </GooseNeckPopoverRoot>
  );
}
