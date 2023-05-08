import { truncateMiddle } from '@/common/utils';
import { Box, Flex } from '@/ui/components';
import * as React from 'react';
import { useClickOutside } from 'use-events';

export const Truncate = React.memo(({ children, offset = 8 }: any) => {
  const [selected, setSelected] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const handleDoubleClick = React.useCallback(() => {
    setSelected(true);
  }, []);

  useClickOutside([ref], () => setSelected(false));
  return (
    <Flex>
      <Box ref={ref} onDoubleClick={handleDoubleClick} position="relative" overflow="hidden">
        <Box
          style={{
            userSelect: 'none',
            pointerEvents: 'none',
            color: selected ? 'white' : undefined,
          }}
          position="relative"
        >
          {truncateMiddle(children, offset)}
        </Box>
        <Box
          color="transparent"
          style={{ wordBreak: 'keep-all' }}
          position="absolute"
          left={0}
          top={0}
        >
          {children}
        </Box>
      </Box>
    </Flex>
  );
});
