import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Prism from 'prismjs';
import { clarity } from '@components/code-block/clarity';
clarity(Prism);
import Editor from 'react-simple-code-editor';
import { Box, BoxProps, Highlighter } from '@stacks/ui';
import { prismTheme } from '@components/code-editor/theme';
import { Global, css } from '@emotion/react';
import {
  ForwardRefExoticComponentWithAs,
  forwardRefWithAs,
  memoWithAs,
  css as _css,
  Theme,
} from '@stacks/ui-core';
import { atom, atomFamily, useRecoilState } from 'recoil';
import { useClarityRepl } from '@common/hooks/use-clarity-repl';
import { SampleContracts } from '@common/sandbox/examples';
import { StandardPrincipal } from '@stacks/transactions';
import { useUser } from '@common/hooks/use-user';

export const TextAreaOverrides = (
  <Global
    styles={css`
      ${prismTheme};
      .code-editor {
        pre {
          width: fit-content;
          min-width: 100%;
          transform: translateY(2px);
        }
        input,
        textarea,
        [contenteditable] {
          caret-color: white;
        }
        & * {
          font-size: 14px !important;
        }
        textarea {
          width: 100% !important;
          padding-left: 76px !important;
          font-size: 14px !important;
          padding-top: 2px !important;
          font-family: 'Fira Code', monospace !important;
          line-height: 24px !important;
          outline: transparent;
        }
        & > div {
          overflow: initial !important;
        }
        textarea,
        pre {
          white-space: pre !important;
          overflow-wrap: unset !important;
        }
      }
    `}
  />
);

interface CodeEditorProps extends Partial<Omit<BoxProps, 'onChange'>> {
  value?: string;
  disabled?: boolean;
  language?: string;
  onChange?: (code: string) => void;
  name?: string;
  id?: string;
}

export const codeEditorState = atomFamily({
  key: 'codeEditor',
  default: (principal: string) =>
    SampleContracts[0].source.replace('SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G', principal),
});

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
      () => (c: string) => (
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
