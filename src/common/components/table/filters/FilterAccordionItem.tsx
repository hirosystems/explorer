import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from '@/components/ui/accordion';
import { FlexProps, PopoverContentProps, PopoverTriggerProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface FilterAccordionItemProps {
  id: string;
  trigger: ReactNode;
  content: ReactNode;
  triggerProps?: PopoverTriggerProps;
  contentProps?: PopoverContentProps;
}

export const getFilterAccordionItemContainerProps = (open: boolean): FlexProps => ({
  px: 3,
  py: 3,
  bg: 'surfacePrimary',
  borderTopRadius: 'redesign.md',
  borderBottomRadius: open ? 'none' : 'redesign.md',
  w: 'full',
});

export function FilterAccordionItem({
  id,
  trigger,
  content,
  triggerProps,
  contentProps,
}: FilterAccordionItemProps) {
  return (
    <AccordionItem borderBottom={'none'} value={id} aria-label={`${id} filter`} w="full">
      <AccordionItemTrigger {...triggerProps} p={0}>
        {trigger}
      </AccordionItemTrigger>
      <AccordionItemContent
        bg="surfacePrimary"
        borderBottomRadius="redesign.md"
        borderTopRadius={'none'}
        px={1.5} // I think there is a bug on Chakra that's causing the padding here to be applied to 2 divs surrounding the content
        pb={1.5}
        pt={0}
        {...contentProps}
      >
        {content}
      </AccordionItemContent>
    </AccordionItem>
  );
}
