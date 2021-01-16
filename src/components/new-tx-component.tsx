import * as React from 'react';
import { Box, BoxProps, color, Stack, transition } from '@stacks/ui';
import { TxList } from '@components/transaction-list';
import { Section } from '@components/section';
import { capitalize } from '@common/utils';
import { Caption } from '@components/typography';
import { atomFamily, useRecoilState } from 'recoil';
import { memo, useCallback } from 'react';
import { useHover } from 'web-api-hooks';
import { SECTION_HEADER_HEIGHT } from '@common/constants/sizes';
import { SectionFooterAction } from '@components/section-footer-button';

const TX_TABS = 'tabs/tx-list';

const tabIndexState = atomFamily({
  key: 'tabs.index',
  default: 0,
});

const useTabs = (key: string) => {
  const [currentIndex, setCurrentIndex] = useRecoilState(tabIndexState(key));

  return {
    currentIndex,
    setCurrentIndex,
  };
};

interface TabProps extends BoxProps {
  tab: string;
  index: number;
}

const Tab: React.FC<TabProps> = memo(({ tab, index, _hover = {}, ...rest }) => {
  const [isHovered, bind] = useHover();
  const { currentIndex, setCurrentIndex } = useTabs(TX_TABS);
  const isActive = index === currentIndex;
  const hoverProps = isActive
    ? {
        ..._hover,
      }
    : {
        cursor: 'pointer',
        color: color('brand'),
        ..._hover,
      };
  return (
    <Box
      as="button"
      display="flex"
      alignItems="center"
      justifyContent="center"
      outline={0}
      border={0}
      bg="transparent"
      onClick={() => setCurrentIndex(index)}
      color={isActive ? color('text-title') : color('text-caption')}
      _hover={hoverProps}
      position="relative"
      height={SECTION_HEADER_HEIGHT}
      {...bind}
      {...rest}
    >
      <Caption fontSize={1} color="currentColor">
        {capitalize(tab)}
      </Caption>
      <Box
        height="1px"
        width="100%"
        opacity={isActive ? 0.75 : isHovered ? 1 : 0}
        bg={color(isActive ? 'text-title' : 'brand')}
        position="absolute"
        bottom="-1px"
        transform={isActive || isHovered ? 'none' : 'scaleX(0)'}
        transition={transition}
      />
    </Box>
  );
});

const Tabs = memo(() => {
  const tabs = ['confirmed', 'pending'];
  return (
    <Stack isInline spacing="base">
      {tabs.map((tab, index) => (
        <Tab tab={tab} index={index} key={index} />
      ))}
    </Stack>
  );
});

export const HomeTxs = memo(({ confirmed, mempool }: any) => {
  const defaultView = mempool.length === 10 ? 1 : 0;
  const { currentIndex, setCurrentIndex } = useTabs(TX_TABS);
  useCallback(() => {
    if (currentIndex !== defaultView) {
      setCurrentIndex(defaultView);
    }
  }, []);
  const dataInView = currentIndex === 0 ? confirmed : mempool;
  const labelInView = currentIndex === 0 ? 'Confirmed transactions' : 'Pending transactions';
  return (
    <Section topRight={<Tabs />} title={labelInView}>
      <Box px="base-loose">
        <TxList items={dataInView} />
        <SectionFooterAction path="transactions" />
      </Box>
    </Section>
  );
});
