import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import { useMemo } from 'react';

import { DatePicker } from './DatePicker';

interface DateFilterProps {
  defaultStartTime?: string;
  defaultEndTime?: string;
  onSubmit?: () => void;
}

export function DateFilterTabs({ defaultStartTime, defaultEndTime, onSubmit }: DateFilterProps) {
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
        content: (
          <DatePicker
            mode="between"
            defaultStartTime={populatedFilter === 'dateRange' ? defaultStartTimeNumber : null}
            defaultEndTime={populatedFilter === 'dateRange' ? defaultEndTimeNumber : null}
            onSubmit={onSubmit}
          />
        ),
      },
      {
        id: 'before',
        title: 'Before',
        content: (
          <DatePicker
            mode="before"
            defaultStartTime={populatedFilter === 'dateRange' ? defaultStartTimeNumber : null}
            defaultEndTime={populatedFilter === 'dateRange' ? defaultEndTimeNumber : null}
            onSubmit={onSubmit}
          />
        ),
      },
      {
        id: 'after',
        title: 'After',
        content: (
          <DatePicker
            mode="after"
            defaultStartTime={populatedFilter === 'dateRange' ? defaultStartTimeNumber : null}
            defaultEndTime={populatedFilter === 'dateRange' ? defaultEndTimeNumber : null}
            onSubmit={onSubmit}
          />
        ),
      },
    ],
    [defaultStartTimeNumber, defaultEndTimeNumber, populatedFilter, onSubmit]
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
