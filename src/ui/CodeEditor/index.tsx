import Editor, { EditorProps, Monaco } from '@monaco-editor/react';
import Prism from 'prismjs';
import { MdExpand } from 'react-icons/md';
import { clarity } from '@/ui/CodeEditor/clarity';
import 'prismjs/components/prism-json';
import { memo, useState } from 'react';

import { autocomplete, hover } from '../../appPages/sandbox/editor-config/autocomplete';
import { defineTheme } from '../../appPages/sandbox/editor-config/define-theme';
import { liftOff } from '../../appPages/sandbox/editor-config/init';
import { configLanguage } from '../../appPages/sandbox/editor-config/language';
import { Box } from '@/ui/Box';
import { IconButton } from '@/ui/IconButton';

clarity(Prism);

function CodeEditorBase({
  code,
  claritySyntax,
  height: defaultHeight = 252,
  ...editorProps
}: { code: string; claritySyntax?: Record<string, any> } & Partial<EditorProps>) {
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
    <Box position="relative">
      <Editor
        width="100%"
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
        aria-label="expand source code"
        onClick={() => {
          height === contentHeight
            ? setHeight(defaultHeightNum)
            : setHeight(Math.max(contentHeight, defaultHeightNum));
        }}
        position="absolute"
        bottom={0}
        right={0}
        icon={<MdExpand color="white" />}
      />
    </Box>
  );
}

export const CodeEditor = memo(CodeEditorBase);
