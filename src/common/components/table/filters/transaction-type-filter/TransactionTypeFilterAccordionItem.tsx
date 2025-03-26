import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from '@/components/ui/accordion';

import { TransactionTypeFilterForm } from './TransactionTypeFilterForm';
import { TransactionTypeFilterTriggerText } from './TransactionTypeFilterTriggerText';

export const TransactionTypeFilterAccordionItem = ({
  id,
  open,
  onSubmit,
}: {
  id: string;
  open: boolean;
  onSubmit?: () => void;
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
        <TransactionTypeFilterTriggerText open={open} />
      </AccordionItemTrigger>
      <AccordionItemContent
        bg="surfacePrimary"
        borderBottomRadius="redesign.md"
        borderTopRadius={'none'}
        p={1.5} // I think there is a bug on Chakra that's causing the padding here to be applied to 2 divs surrounding the content
      >
        <TransactionTypeFilterForm open={open} onSubmit={onSubmit} />
      </AccordionItemContent>
    </AccordionItem>
  );
};
