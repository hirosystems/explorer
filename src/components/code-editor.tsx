import React, { Component, Fragment } from 'react';

import Editor from 'react-simple-code-editor';
import { Box, BoxProps, Highlighter } from '@blockstack/ui';

import { createGlobalStyle } from 'styled-components';

const TextAreaOverrides = createGlobalStyle`
.code-editor{
  input,
  textarea,
  [contenteditable] {
    caret-color: white;
  }
  textarea{
    width: calc(100%) !important;
    margin-left: 76px !important;
    font-size: 16px !important;
    padding-top: 2px !important;
    font-family: 'Fira Code',monospace !important;
    line-height: 24px !important;
    outline: transparent;
  }
  & > div{
  overflow: initial !important;
  }
  textarea, pre {
  white-space: pre !important;
  overflow-wrap: unset !important;
  }
}
`;

interface CodeEditorProps {
  code: string;
  disabled?: boolean;
  language?: string;
  onChange?: (code: string) => void;
  style?: object;
  name?: string;
  id?: string;
}
const CodeEditor = (props: CodeEditorProps) => {
  const [state, setState] = React.useState({ code: props.code || '' });

  const updateContent = (code: string) => {
    setState(s => {
      if (props.onChange) {
        props.onChange(code);
      }
      return {
        code,
      };
    });
  };

  const highlightCode = (code: string) => (
    <Highlighter code={code} showLineNumbers language={language as any} />
  );

  // eslint-disable-next-line no-unused-vars
  const { style, code: _code, onChange, language, id, ...rest } = props;
  const { code } = state;

  return (
    <>
      <TextAreaOverrides />
      <Box className="code-editor" bg="ink" py="base-tight" overflowX="auto" minWidth="100%">
        <Editor
          //@ts-ignore
          value={code}
          highlight={highlightCode}
          onValueChange={updateContent}
          style={{
            ...style,
            overflowWrap: 'unset',
            //@ts-ignore
            whiteSpace: 'pre !important',
          }}
          textareaId={id}
          {...rest}
        />
      </Box>
    </>
  );
};

export { CodeEditor };
