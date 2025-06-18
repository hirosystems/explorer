import { Accordion, HStack } from '@chakra-ui/react';
import { CaretDown } from '@phosphor-icons/react';
import * as React from 'react';

interface AccordionItemTriggerProps extends Accordion.ItemTriggerProps {
  indicatorPlacement?: 'start' | 'end';
}

export const AccordionItemTrigger = React.forwardRef<HTMLButtonElement, AccordionItemTriggerProps>(
  function AccordionItemTrigger(props, ref) {
    const { children, indicatorPlacement, ...rest } = props;
    return (
      <Accordion.ItemTrigger {...rest} ref={ref}>
        {indicatorPlacement === 'start' && (
          <Accordion.ItemIndicator rotate={{ base: '-90deg', _open: '0deg' }}>
            <CaretDown />
          </Accordion.ItemIndicator>
        )}
        <HStack gap="4" flex="1" textAlign="start" width="full">
          {children}
        </HStack>
        {indicatorPlacement === 'end' && (
          <Accordion.ItemIndicator>
            <CaretDown />
          </Accordion.ItemIndicator>
        )}
      </Accordion.ItemTrigger>
    );
  }
);

interface AccordionItemContentProps extends Accordion.ItemContentProps {}

export const AccordionItemContent = React.forwardRef<HTMLDivElement, AccordionItemContentProps>(
  function AccordionItemContent({ ...rest }, ref) {
    return (
      <Accordion.ItemContent {...rest} ref={ref}>
        <Accordion.ItemBody {...rest} ref={ref} />
      </Accordion.ItemContent>
    );
  }
);

export const AccordionRoot = Accordion.Root;
export const AccordionItem = Accordion.Item;
