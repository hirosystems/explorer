import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from '@/components/ui/accordion';

import { DateFilterTabs } from './DateFilterTabs';
import { DateFilterTriggerText } from './DateFilterTriggerText';

export const DateFilterAccordionItem = ({
  id,
  defaultStartTime,
  defaultEndTime,
  open,
  onSubmit,
}: {
  id: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
  open: boolean;
  onSubmit: () => void;
}) => {
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
        <DateFilterTriggerText
          defaultStartTime={defaultStartTime}
          defaultEndTime={defaultEndTime}
          open={open}
        />
      </AccordionItemTrigger>
      <AccordionItemContent
        bg="surfacePrimary"
        borderBottomRadius="redesign.md"
        borderTopRadius={'none'}
        p={1.5} // I think there is a bug on Chakra that's causing the padding here to be applied to 2 divs surrounding the content
      >
        <DateFilterTabs
          defaultStartTime={defaultStartTime}
          defaultEndTime={defaultEndTime}
          onSubmit={onSubmit}
        />
      </AccordionItemContent>
    </AccordionItem>
  );
};
