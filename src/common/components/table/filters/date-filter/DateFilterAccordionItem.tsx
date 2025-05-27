import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from '@/components/ui/accordion';

import { useSearchParamsFilters } from '../search-param-filter-utils';
import { DateFilterTabs } from './DateFilterTabs';
import { DateFilterTriggerText } from './DateFilterTriggerText';

export const DateFilterAccordionItem = ({
  id,
  open,
  onSubmit,
}: {
  id: string;
  open: boolean;
  onSubmit: () => void;
}) => {
  const { startTime, endTime } = useSearchParamsFilters();

  return (
    <AccordionItem borderBottom={'none'} value={id}>
      <AccordionItemTrigger
        alignItems="center"
        bg="surfacePrimary"
        borderTopRadius="redesign.md"
        borderBottomRadius={open ? 'none' : 'redesign.md'}
        w="full"
        p={3}
      >
        <DateFilterTriggerText startTime={startTime} endTime={endTime} open={open} />
      </AccordionItemTrigger>
      <AccordionItemContent
        bg="surfacePrimary"
        borderBottomRadius="redesign.md"
        borderTopRadius={'none'}
        p={1.5} // I think there is a bug on Chakra that's causing the padding here to be applied to 2 divs surrounding the content
      >
        <DateFilterTabs defaultStartTime={startTime} defaultEndTime={endTime} onSubmit={onSubmit} />
      </AccordionItemContent>
    </AccordionItem>
  );
};
