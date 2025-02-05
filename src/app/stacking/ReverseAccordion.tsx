import { Plus, X } from '@phosphor-icons/react';
import { RefObject, createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import { Box, Flex, Icon, Stack } from '@chakra-ui/react';
import useResizeObserver from './useResizeObserver';

const cardPaddingY = 3;
const cardMarginBottom = 3;
const cardOverlap = 10; // Amount of overlap between cards
const onHoverRise = 40; // How much the card rises when hovered
const extraRiseToShowContent = cardOverlap - 5;

const calculateCardHeight = (cardTitleHeight: number) => {
  return cardTitleHeight + cardMarginBottom * 4 + cardPaddingY * 2 * 4;
};

function ReverseAccordionItem({
  title,
  text,
  link,
  linkLabel,
  index,
  setIsExpanded,
  isExpanded,
  itemTitleRef,
  topPosition,
  accordionWidth,
}: {
  title: string;
  text: string;
  link: string;
  linkLabel: string;
  index: number;
  setIsExpanded: (index: number, state: boolean) => void;
  isExpanded: boolean;
  itemTitleRef: RefObject<HTMLDivElement>;
  topPosition: number;
  accordionWidth: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [titleHeight, setTitleHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardHeight = useMemo(() => calculateCardHeight(titleHeight), [titleHeight]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [text, isExpanded, isHovered, accordionWidth]);

  useEffect(() => {
    if (itemTitleRef.current) {
      setTitleHeight(itemTitleRef.current.scrollHeight);
    }
  }, [text, isExpanded, isHovered, accordionWidth]);

  return (
    <Stack
      className="CARD"
      ref={containerRef}
      gap={0}
      position="absolute"
      top={`${topPosition}px`}
      left={0}
      right={0}
      bg="white"
      border="1px solid var(--stacks-colors-sand-200)"
      borderRadius="xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => (isExpanded ? null : setIsExpanded(index, true))}
      style={{
        // the transform is there to balance out the height so that the card will look like it moves upward instead of downward. For example, if the height grows by 20px, we can move the card up 20px so that the height drops back down to the original bottom of the card
        transition: 'all 0.3s ease-out',
        transform: isExpanded
          ? `translateY(-${contentHeight + extraRiseToShowContent}px)`
          : isHovered
            ? `translateY(-${onHoverRise}px)`
            : 'translateY(0)',
        height: isExpanded
          ? `${cardHeight + contentHeight}px`
          : isHovered
            ? `${cardHeight + onHoverRise}px`
            : `${cardHeight}px`,
        overflow: 'hidden',
        zIndex: 10 + index,
      }}
      boxShadow="0px -8px 10px -6px rgba(0, 0, 0, 0.1)"
    >
      <Stack gap={0}>
        <Flex height={cardHeight} className="CARD-TITLE-CONTAINER" alignItems="center" px={4}>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            className="cardTitle"
            ref={itemTitleRef}
            height="fit-content"
            w="full"
          >
            <Text fontWeight="medium">{title}</Text>
            <Icon
              as={isExpanded ? X : Plus}
              onClick={() => (isExpanded ? setIsExpanded(index, false) : null)}
              size={4}
            />
          </Flex>
        </Flex>
        <Flex ref={contentRef} height="fit-content" flexDirection="column" gap={4} px={3} pb={3}>
          <Text color="textSubdued">{text}</Text>
          <Button>{linkLabel}</Button>
        </Flex>
      </Stack>
    </Stack>
  );
}

export interface ReverseAccordionItem {
  // This should be made more generic to accomodate other types of item content
  title: string;
  text: string;
  link: string;
  linkLabel: string;
}

export function ReverseAccordion({ items }: { items: ReverseAccordionItem[] }) {
  const [totalHeight, setTotalHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const itemTitleRefs = useRef<Array<React.RefObject<HTMLDivElement>>>(
    Array(items.length)
      .fill(null)
      .map(() => createRef<HTMLDivElement>())
  );

  const setIsExpanded = useCallback((index: number, state: boolean) => {
    if (state) {
      setExpandedIndex(index);
    } else {
      setExpandedIndex(null);
    }
  }, []);

  const { width } = useResizeObserver(containerRef);

  useEffect(() => {
    if (containerRef.current) {
      const height =
        itemTitleRefs.current.reduce(
          (sum, ref) => sum + (calculateCardHeight(ref.current?.scrollHeight ?? 0) - cardOverlap),
          0
        ) + cardOverlap; // add the overlap back on to account for the last card
      setTotalHeight(height);
    }
  }, [items, width]);

  return (
    <Box
      position="relative"
      height={`${totalHeight}px`}
      w="full"
      ref={containerRef}
      className="REVERSE-ACCORDION"
    >
      {items.map((item, index) => (
        <ReverseAccordionItem
          key={item.title}
          title={item.title}
          text={item.text}
          link={item.link}
          linkLabel={item.linkLabel}
          index={index}
          setIsExpanded={setIsExpanded}
          isExpanded={expandedIndex === index}
          itemTitleRef={itemTitleRefs.current[index]}
          topPosition={itemTitleRefs.current
            .slice(0, index)
            .reduce(
              (sum, ref) =>
                sum + (calculateCardHeight(ref.current?.scrollHeight ?? 0) - cardOverlap),
              0
            )}
          accordionWidth={width}
        />
      ))}
    </Box>
  );
}
