import { memo, useEffect, useState } from 'react';
import { BlockAndMicroblocksItem } from './BlockAndMicroblocksItem';
import { Collapse } from '@/ui/components';
import { EnhancedBlock } from '@/appPages/components/BlockList/types';

export const animationDuration = 0.25;

export const AnimatedBlockAndMicroblocksItem = memo(
  ({ block, onAnimationExit }: { block: EnhancedBlock; onAnimationExit?: () => void }) => {
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
