'use client';

import { FC, memo, useEffect, useState } from 'react';

import { Collapse } from '../../../ui/Collapse';
import { BlockAndMicroblocksItem } from './BlockAndMicroblocksItem';
import { EnhancedBlock } from './types';

export const animationDuration = 0.25;

export const AnimatedBlockAndMicroblocksItem: FC<{
  block: EnhancedBlock;
  onAnimationExit?: () => void;
}> = memo(
  ({ block, onAnimationExit }) => {
    const [show, setShow] = useState(!block.animate);
    useEffect(() => {
      if (block.animate) {
        setShow(true);
      }
    }, [block.animate]);
    useEffect(() => {
      if (block.destroy) {
        setShow(false);
      }
    }, [block.destroy]);

    return (
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
    );
  },
  (prevProps, currentProps) =>
    prevProps.block.hash === currentProps.block.hash &&
    prevProps.block.destroy === currentProps.block.destroy
);
