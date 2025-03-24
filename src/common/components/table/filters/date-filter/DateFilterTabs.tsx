import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import { useMemo } from 'react';

import { DatePicker } from './DatePicker';
import { DatePickerMobile } from './DatePickerMobile';

interface DateFilterProps {
  defaultStartTime?: string;
  defaultEndTime?: string;
  onClose?: () => void;
  isMobile?: boolean;
}

export function DateFilterTabs({
  defaultStartTime,
  defaultEndTime,
  onClose,
  isMobile,
}: DateFilterProps) {
  const defaultStartTimeNumber = isNaN(Number(defaultStartTime)) ? null : Number(defaultStartTime);
  const defaultEndTimeNumber = isNaN(Number(defaultEndTime)) ? null : Number(defaultEndTime);

  const populatedFilter =
    defaultStartTime && defaultEndTime
      ? 'dateRange'
      : defaultStartTime
        ? 'after'
        : defaultEndTime
          ? 'before'
          : null;

  const tabs = useMemo(
    () => [
      {
        id: 'between',
        title: 'Between',
        content: isMobile ? (
          <DatePickerMobile
            mode="between"
            defaultStartTime={populatedFilter === 'dateRange' ? defaultStartTimeNumber : null}
            defaultEndTime={populatedFilter === 'dateRange' ? defaultEndTimeNumber : null}
          />
        ) : (
          <DatePicker
            mode="between"
            defaultStartTime={populatedFilter === 'dateRange' ? defaultStartTimeNumber : null}
            defaultEndTime={populatedFilter === 'dateRange' ? defaultEndTimeNumber : null}
            onClose={onClose}
          />
        ),
      },
      {
        id: 'before',
        title: 'Before',
        content: isMobile ? (
          <DatePickerMobile
            mode="before"
            defaultStartTime={populatedFilter === 'dateRange' ? defaultStartTimeNumber : null}
            defaultEndTime={populatedFilter === 'dateRange' ? defaultEndTimeNumber : null}
          />
        ) : (
          <DatePicker
            mode="before"
            defaultStartTime={populatedFilter === 'dateRange' ? defaultStartTimeNumber : null}
            defaultEndTime={populatedFilter === 'dateRange' ? defaultEndTimeNumber : null}
            onClose={onClose}
          />
        ),
      },
      {
        id: 'after',
        title: 'After',
        content: isMobile ? (
          <DatePickerMobile
            mode="after"
            defaultStartTime={populatedFilter === 'dateRange' ? defaultStartTimeNumber : null}
            defaultEndTime={populatedFilter === 'dateRange' ? defaultEndTimeNumber : null}
          />
        ) : (
          <DatePicker
            mode="after"
            defaultStartTime={populatedFilter === 'dateRange' ? defaultStartTimeNumber : null}
            defaultEndTime={populatedFilter === 'dateRange' ? defaultEndTimeNumber : null}
            onClose={onClose}
          />
        ),
      },
    ],
    [defaultStartTimeNumber, defaultEndTimeNumber, populatedFilter, onClose, isMobile]
  );

  return (
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
  );
}
