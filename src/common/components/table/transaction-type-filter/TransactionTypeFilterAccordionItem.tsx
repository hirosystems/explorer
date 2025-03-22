import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from '@/components/ui/accordion';

import { TransactionTypeFilterFormMobile } from './TransactionTypeFilterFormMobile';
import { TransactionTypeFilterTriggerTextMobile } from './TransactionTypeFilterTriggerTextMobile';

export const TransactionTypeFilterAccordionItem = ({ id, open }: { id: string; open: boolean }) => {
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
        <TransactionTypeFilterTriggerTextMobile open={open} />
      </AccordionItemTrigger>
      <AccordionItemContent
        bg="surfacePrimary"
        borderBottomRadius="redesign.md"
        borderTopRadius={'none'}
        p={1.5} // I think there is a bug on Chakra that's causing the padding here to be applied to 2 divs surrounding the content
      >
        <TransactionTypeFilterFormMobile />
      </AccordionItemContent>
    </AccordionItem>
  );
};
