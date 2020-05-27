import * as React from 'react';
import { Box, CodeBlock, Transition } from '@blockstack/ui';
import { useRect } from '@reach/rect';

export const CodeAccordian = ({
  isOpen,
  code,
  language = 'json',
  isLast,
  show,
  note,
  ...rest
}: any) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const rect = useRect(ref);
  const height = rect?.height;

  return (
    <Transition
      // @ts-ignore
      appear={false}
      // @ts-ignore
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
          style={{
            willChange: 'height',
            overflow: 'hidden',
            ...styles,
          }}
        >
          <Box
            borderBottomRightRadius={isLast ? '12px' : 'unset'}
            borderBottomLeftRadius={isLast ? '12px' : 'unset'}
            {...rest}
            ref={ref}
          >
            <CodeBlock
              borderRadius="0"
              showLineNumbers
              code={JSON.stringify(code, null, '  ')}
              // @ts-ignore
              language={language}
            />
            {note && note}
          </Box>
        </Box>
      )}
    </Transition>
  );
};
