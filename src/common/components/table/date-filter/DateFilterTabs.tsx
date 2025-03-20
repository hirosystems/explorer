import { AfterDatePicker } from '@/common/components/table/date-filter/AfterDatePicker';
import { BeforeDatePicker } from '@/common/components/table/date-filter/BeforeDatePicker';
import { BetweenDatePicker } from '@/common/components/table/date-filter/BetweenDatePicker';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import { useMemo } from 'react';

interface DateFilterProps {
  defaultStartTime?: string;
  defaultEndTime?: string;
  onClose?: () => void;
}

export function DateFilterTabs({ defaultStartTime, defaultEndTime, onClose }: DateFilterProps) {
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
          <BetweenDatePicker
            defaultStartTime={populatedFilter === 'dateRange' ? defaultStartTimeNumber : null}
            defaultEndTime={populatedFilter === 'dateRange' ? defaultEndTimeNumber : null}
            onClose={onClose}
          />
        ),
      },
      {
        id: 'before',
        title: 'Before',
        content: (
          <BeforeDatePicker
            defaultEndTime={populatedFilter === 'before' ? defaultEndTimeNumber : null}
            onClose={onClose}
          />
        ),
      },
      {
        id: 'after',
        title: 'After',
        content: (
          <AfterDatePicker
            defaultStartTime={populatedFilter === 'after' ? defaultStartTimeNumber : null}
            onClose={onClose}
          />
        ),
      },
    ],
    [defaultStartTimeNumber, defaultEndTimeNumber, populatedFilter, onClose]
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
