import React from 'react';
// @ts-ignore
import Prism from 'prismjs/components/prism-core';
import Editor from 'react-simple-code-editor';
import { Box, BoxProps, Highlighter } from '@stacks/ui';
import { Global, css } from '@emotion/react';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs, memoWithAs } from '@stacks/ui-core';

export const TextAreaOverrides = (
  <Global
    styles={css`
      .code-editor {
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
  value: string;
  disabled?: boolean;
  language?: string;
  onChange?: (code: string) => void;
  name?: string;
  id?: string;
}

const CodeEditor: ForwardRefExoticComponentWithAs<CodeEditorProps, 'div'> = memoWithAs<
  CodeEditorProps,
  'div'
>(
  forwardRefWithAs<CodeEditorProps, 'div'>((props, ref) => {
    const { style, value, onChange, language, id, disabled, maxHeight, ...rest } = props;
    const [code, setState] = React.useState(value);

    const updateContent = (c: string) => {
      if (c === code) {
        return;
      }
      setState(s => {
        if (props.onChange) {
          props.onChange(c);
        }
        return c;
      });
    };

    React.useEffect(() => {
      if (value !== code) {
        updateContent(value);
      }
    }, [value]);

    return (
      <>
        <Box
          className="code-editor"
          bg="ink"
          borderRadius="6px"
          py="base-tight"
          border="1px solid var(--colors-border)"
          overflowX="auto"
          minWidth="100%"
          maxHeight={maxHeight}
        >
          <Editor
            textareaId={id}
            language={language}
            onValueChange={updateContent}
            ref={ref}
            highlight={c => (
              <Highlighter
                Prism={Prism as any}
                code={c}
                showLineNumbers
                language={language as any}
              />
            )}
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
