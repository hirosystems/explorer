import * as React from 'react';
import { Flex, FlexProps, IconButton, transition } from '@stacks/ui';
import { Tooltip } from '@components/tooltip';
import { IconQuestionMark } from '@tabler/icons';

interface SearchHintsProps extends FlexProps {
  isHovered?: boolean;
  isSmall?: boolean;
}

export const SearchHints: React.FC<SearchHintsProps> = React.memo(
  ({ isHovered, isSmall, ...rest }) => {
    const [overflow, setOverflow] = React.useState(false);
    const overflowRef = React.useRef<any | null>(null);
    React.useLayoutEffect(() => {
      if (isHovered) {
        if (!overflowRef.current) {
          overflowRef.current = setTimeout(() => {
            setOverflow(true);
          }, 680);
        }
      } else {
        if (!isHovered && overflow) {
          setTimeout(() => {
            setOverflow(false);
          }, 350);
        }
        if (overflowRef.current) {
          clearTimeout(overflowRef.current);
          overflowRef.current = null;
        }
      }
    }, [isHovered, overflowRef.current]);
    return (
      <Flex
        alignItems="center"
        height="100%"
        position="absolute"
        right="calc(calc(32px + 36px) * -1)"
        overflow={!overflow ? 'hidden' : 'unset'}
        transition="overflow ease-in-out 250ms"
        transitionDelay="1s"
      >
        <Flex
          alignItems="center"
          height="100%"
          top={0}
          transform={isHovered ? 'none' : 'translateX(-68px)'}
          transition={transition}
          transitionDelay={isHovered ? '420ms' : '250ms'}
          transitionDuration={!isHovered ? '800ms' : '0'}
          zIndex={9999}
          px="base"
          {...rest}
        >
          <Tooltip
            label="Available search terms: principal, tx_id, contract_id, and block_hash."
            placement={isSmall ? 'bottom-end' : 'top-end'}
            interactive
            labelProps={{
              minWidth: '350px',
            }}
          >
            <IconButton
              size={isSmall ? '28px' : '36px'}
              iconSize={isSmall ? '16px' : '24px'}
              invert
              color="white"
              _hover={{ cursor: 'unset' }}
              icon={IconQuestionMark}
            />
          </Tooltip>
        </Flex>
      </Flex>
    );
  }
);
