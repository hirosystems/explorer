import { useTxTableFilters } from '@/common/components/table/tx-table/useTxTableFilters';
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from '@/components/ui/accordion';

import { TransactionTypeFilterForm } from './TransactionTypeFilterForm';
import { TransactionTypeFilterTrigger } from './TransactionTypeFilterTriggerText';

export const TransactionTypeFilterAccordionItem = ({
  id,
  open,
  onSubmit,
}: {
  id: string;
  open: boolean;
  onSubmit: (transactionType: string[]) => void;
}) => {
  const { transactionType } = useTxTableFilters();

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
        <TransactionTypeFilterTrigger open={open} transactionType={transactionType} />
      </AccordionItemTrigger>
      <AccordionItemContent
        bg="surfacePrimary"
        borderBottomRadius="redesign.md"
        borderTopRadius={'none'}
        p={1.5} // I think there is a bug on Chakra that's causing the padding here to be applied to 2 divs surrounding the content
      >
        <TransactionTypeFilterForm
          open={open}
          onSubmit={onSubmit}
          defaultTransactionType={transactionType}
        />
      </AccordionItemContent>
    </AccordionItem>
  );
};
