'use client';

import Editor, { EditorProps, Monaco } from '@monaco-editor/react';
import Prism from 'prismjs';
import { FC, memo, useState } from 'react';
import { MdExpand } from 'react-icons/md';

import { autocomplete, hover } from '../../app/sandbox/editor-config/autocomplete';
import { defineTheme } from '../../app/sandbox/editor-config/define-theme';
import { liftOff } from '../../app/sandbox/editor-config/init';
import { configLanguage } from '../../app/sandbox/editor-config/language';
import { claritySyntax } from '../../common/constants/claritySyntax';
import { Box } from '../Box';
import { IconButton } from '../IconButton';
import { clarity } from './clarity';

clarity(Prism);

const CodeEditorBase: FC<{ code: string } & Partial<EditorProps>> = ({
  code,
  height: defaultHeight = 252,
  ...editorProps
}) => {
  const handleEditorWillMount = async (monaco: Monaco) => {
    configLanguage(monaco);
    hover(monaco);
    autocomplete(monaco);
    defineTheme(monaco);
    if (claritySyntax) await liftOff(monaco, claritySyntax);
  };
  const defaultHeightNum = Number(defaultHeight);
  const [height, setHeight] = useState<number>(defaultHeightNum);
  const [contentHeight, setContentHeight] = useState<number>(defaultHeightNum);
  return (
    <Box position={'relative'}>
      <Editor
        width={'100%'}
        height={height}
        beforeMount={handleEditorWillMount}
        onMount={editor => {
          setContentHeight(Math.max(editor.getContentHeight(), defaultHeightNum));
          editor.updateOptions({
            wordSeparators: '`~!@#$%^&*()=+[{]}\\|;:\'",.<>/?',
          });
        }}
        defaultLanguage="clarity"
        theme="vs-dark"
        value={code.replace(/^\s+|\s+$/g, '')}
        keepCurrentModel
        options={{
          fontLigatures: true,
          fontSize: 14,
          minimap: {
            enabled: false,
          },
          readOnly: true,
          folding: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
        {...editorProps}
      />
      <IconButton
        aria-label={'expand source code'}
        onClick={() => {
          height === contentHeight
            ? setHeight(defaultHeightNum)
            : setHeight(Math.max(contentHeight, defaultHeightNum));
        }}
        position={'absolute'}
        bottom={0}
        right={0}
        icon={<MdExpand color={'white'} />}
      ></IconButton>
    </Box>
  );
};

export const CodeEditor = memo(CodeEditorBase);
