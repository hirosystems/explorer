import { parseTimestamp } from '@/common/utils/time-utils';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import { useMemo, useState } from 'react';

import { DatePicker, DatePickerMode } from './DatePicker';

interface DateFilterProps {
  defaultStartTime?: string;
  defaultEndTime?: string;
  onSubmit?: () => void;
}

export function DateFilterTabs({ defaultStartTime, defaultEndTime, onSubmit }: DateFilterProps) {
  const defaultStartTimeNumber = defaultStartTime ? parseTimestamp(defaultStartTime) : null;
  const defaultEndTimeNumber = defaultEndTime ? parseTimestamp(defaultEndTime) : null;
  const defaultMode =
    defaultStartTime && defaultEndTime ? 'between' : defaultStartTime ? 'after' : 'before';
  const [selectedTab, setSelectedTab] = useState<DatePickerMode>('between');

  const tabs = useMemo(
    () => [
      {
        id: 'between',
        title: 'Between',
        content: (
          <DatePicker
            mode="between"
            defaultStartTime={defaultMode === 'between' ? defaultStartTimeNumber : null}
            defaultEndTime={defaultMode === 'between' ? defaultEndTimeNumber : null}
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
            defaultEndTime={defaultMode === 'before' ? defaultEndTimeNumber : null}
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
            defaultStartTime={defaultMode === 'after' ? defaultStartTimeNumber : null}
            onSubmit={onSubmit}
          />
        ),
      },
    ],
    [defaultStartTimeNumber, defaultEndTimeNumber, onSubmit, defaultMode]
  );

  return (
    <TabsRoot
      defaultValue={selectedTab}
      size="redesignSm"
      variant="redesignPrimary"
      aria-label="Date filter options"
      onValueChange={({ value }) => setSelectedTab(value as DatePickerMode)}
    >
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
