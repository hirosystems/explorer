import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from '@/components/ui/accordion';

import { AddressFilterForm } from './AddressFilterForm';
import { AddressFilterTriggerText } from './AddressFilterTriggerText';

export const AddressFilterAccordionItem = ({
  id,
  defaultFromAddress,
  defaultToAddress,
  open,
  onSubmit,
}: {
  id: string;
  defaultFromAddress?: string;
  defaultToAddress?: string;
  open: boolean;
  onSubmit?: () => void;
}) => {
  return (
    <AccordionItem borderBottom={'none'} value={id} aria-label="Address filter options">
      <AccordionItemTrigger
        alignItems="center"
        bg="surfacePrimary"
        borderTopRadius="redesign.md"
        borderBottomRadius={open ? 'none' : 'redesign.md'}
        w="full"
        p={3}
      >
        <AddressFilterTriggerText
          defaultFromAddress={defaultFromAddress}
          defaultToAddress={defaultToAddress}
          open={open}
        />
      </AccordionItemTrigger>
      <AccordionItemContent
        bg="surfacePrimary"
        borderBottomRadius="redesign.md"
        borderTopRadius={'none'}
        p={1.5} // I think there is a bug on Chakra that's causing the padding here to be applied to 2 divs surrounding the content
      >
        <AddressFilterForm
          defaultFromAddress={defaultFromAddress}
          defaultToAddress={defaultToAddress}
          onSubmit={onSubmit}
        />
      </AccordionItemContent>
    </AccordionItem>
  );
};
