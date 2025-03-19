import { useOpenedModal } from '@/common/components/modals/modal-slice';
import { MODALS } from '@/common/constants/constants';
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from '@/components/ui/accordion';
import { RedesignModal } from '@/ui/RedesignModal';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import { useMemo } from 'react';

const TxTableFiltersModalBody = () => (
  <Stack gap={4}>
    <AccordionRoot
      multiple
      mt={4}
      // onValueChange={({ value }) => {
      //   setIsBtcExplorerUrlsAccordionExpanded(value.includes('btc-explorer-urls'));
      // }}
    >
      <AccordionItem borderBottom={'none'} value="btc-explorer-urls">
        <AccordionItemTrigger paddingLeft={0} gap={2}>
          {/* <Icon h={3} w={3}>
                    {isBtcExplorerUrlsAccordionExpanded ? <CaretDown /> : <CaretRight />}
                  </Icon> */}
          <Text fontSize={'sm'}>BTC Explorer URLs</Text>
        </AccordionItemTrigger>
        <AccordionItemContent>
            
        </AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  </Stack>
);

export const TxTableFiltersModal = () => {
  const modal = useOpenedModal();
  const open = useMemo(() => modal === MODALS.TxsTableFilters, [modal]);

  return (
    <RedesignModal
      open={open}
      title={
        <Text fontSize={'3.5xl'} fontFamily="matter" fontWeight="regular">
          Filter
        </Text>
      }
      body={<TxTableFiltersModalBody />}
    />
  );
};
