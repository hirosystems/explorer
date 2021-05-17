import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Prism from 'prismjs';
import { clarity } from '@components/code-block/clarity';
import Editor from 'react-simple-code-editor';
import { Box, BoxProps, Highlighter } from '@stacks/ui';

import {
  css as _css,
  ForwardRefExoticComponentWithAs,
  forwardRefWithAs,
  memoWithAs,
  Theme,
} from '@stacks/ui-core';
import { useRecoilState } from 'recoil';
import { useClarityRepl } from '@sandbox/hooks/use-clarity-repl';
import { useUser } from '@sandbox/hooks/use-user';
import { codeEditorState } from '@sandbox/store/sandbox';

clarity(Prism);

interface CodeEditorProps extends Partial<Omit<BoxProps, 'onChange'>> {
  value?: string;
  disabled?: boolean;
  language?: string;
  onChange?: (code: string) => void;
  name?: string;
  id?: string;
}

export const useCodeEditor = (): [string, (value: string) => void] => {
  const { principal } = useUser();
  const [codeBody, setCodeBody] = useRecoilState<string>(codeEditorState(principal as string));

  return [codeBody, setCodeBody as (value: string) => void];
};

const CodeEditor: ForwardRefExoticComponentWithAs<CodeEditorProps, 'div'> = memoWithAs<
  CodeEditorProps,
  'div'
>(
  forwardRefWithAs<CodeEditorProps, 'div'>((props, ref) => {
    const { style, value, onChange, language, id, disabled, maxHeight, ...rest } = props;
    const [code, setCode] = useCodeEditor();
    const { result } = useClarityRepl();

    React.useEffect(() => {
      if (typeof value !== 'undefined' && code !== value) {
        setCode(value);
      }
    }, []);

    const updateContent = React.useCallback((c: string) => setCode(c), []);

    const errorLine = () => {
      if (result && result?.error) {
        return {
          [`.token-line:nth-child(${result?.error?.line})`]: {
            bg: 'transparent',
            position: 'relative',
            '&::before': {
              content: `''`,
              position: 'absolute',
              width: '100%',
              height: '100%',
              left: 0,
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
            },

            '& > div:nth-child(2)': {
              pl: '24px',
            },
            '& > div:first-child': {
              '::before': {
                content: `''`,
                width: '10px',
                height: '10px',
                right: '-5px',
                position: 'absolute',
                bg: 'red',
                borderRadius: '10px',
              },
              color: 'white',
              bg: 'rgba(255,255,255,0.08)',
              position: 'relative',
            },
          },
        };
        return {};
      }
    };

    const highlighter = React.useMemo(
      () => (c: string) =>
        (
          <Box
            css={(theme: Theme) =>
              _css({
                '.token-line': {
                  alignItems: 'center',
                  '& > div:first-child': {
                    alignItems: 'center',
                  },
                },
                ...errorLine(),
              })(theme)
            }
          >
            <Highlighter Prism={Prism as any} code={c} showLineNumbers language={language as any} />
          </Box>
        ),
      [result]
    );

    return (
      <>
        <Box
          className="code-editor"
          bg="ink"
          borderRadius="6px"
          py="base-tight"
          // border="1px solid var(--colors-border)"
          overflowX="auto"
          minWidth="100%"
          maxWidth="100%"
          flexGrow={1}
          flexShrink={1}
          maxHeight={maxHeight}
        >
          <Editor
            textareaId={id}
            language={language}
            onValueChange={updateContent}
            ref={ref}
            highlight={highlighter}
            style={{
              ...style,
              overflowWrap: 'unset',
              //@ts-ignore
              whiteSpace: 'pre !important',
            }}
            value={code}
            {...rest}
          />
        </Box>
      </>
    );
  })
);

export default CodeEditor;
