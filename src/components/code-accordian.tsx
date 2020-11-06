import * as React from 'react';
import { Box, Transition } from '@stacks/ui';
import { useRect } from '@reach/rect';
import { CodeBlock } from '@components/code-block';

export const CodeAccordian = React.memo(
  ({ isOpen, code, language = 'json', isLast, show, note, maxHeight, ...rest }: any) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const rect = useRect(ref);
    const height = rect?.height;

    if (!code) return null;

    return (
      <Transition
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        appear={false}
        unmountOnExit={false}
        styles={{
          init: {
            height: 0,
          },
          entered: {
            height: height,
          },
          exiting: {
            height: 0,
          },
        }}
        in={isOpen}
        timeout={200}
      >
        {styles => (
          <Box
            style={
              {
                willChange: 'height',
                overflow: 'hidden',
                ...styles,
              } as any
            }
          >
            <Box
              borderBottomRightRadius={isLast ? '12px' : 'unset'}
              borderBottomLeftRadius={isLast ? '12px' : 'unset'}
              bg="ink"
              {...rest}
              ref={ref}
            >
              <CodeBlock
                borderRadius="0"
                showLineNumbers
                code={JSON.stringify(code, null, '  ')}
                language={language}
                maxHeight={maxHeight}
              />
              {note && note}
            </Box>
          </Box>
        )}
      </Transition>
    );
  }
);
