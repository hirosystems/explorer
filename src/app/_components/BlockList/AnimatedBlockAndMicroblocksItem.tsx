'use client';

import { ScaleFade, SlideFade } from '@chakra-ui/react';
import { FC, memo, useEffect, useState } from 'react';

import { Box } from '../../../ui/Box';
import { Button } from '../../../ui/Button';
import { Collapse } from '../../../ui/Collapse';
import { useDisclosure } from '../../../ui/hooks/useDisclosure';
import { BlockAndMicroblocksItem } from './BlockAndMicroblocksItem';
import { EnhancedBlock } from './types';

export const animationDuration = 0.8;

export const AnimatedBlockAndMicroblocksItem: FC<{
  block: EnhancedBlock;
  onAnimationExit?: () => void;
}> = ({ block, onAnimationExit }) => {
  const [show, setShow] = useState(!block.animate);
  useEffect(() => {
    if (block.animate) {
      setTimeout(() => {
        setShow(true);
      }, 100);
    }
  }, [block.animate]);
  useEffect(() => {
    if (block.destroy) {
      setShow(false);
    }
  }, [block.destroy]);

  return (
    <Box borderBottom={'1px'} _last={{ borderBottom: 'none' }}>
      <Collapse
        in={show}
        animateOpacity
        transition={{
          enter: { duration: animationDuration },
          exit: { duration: animationDuration },
        }}
        onAnimationComplete={state => {
          if (state === 'exit') {
            onAnimationExit?.();
          }
        }}
        data-testid={`block-item-${block.hash}`}
      >
        <BlockAndMicroblocksItem block={block} />
      </Collapse>
    </Box>
  );
};
