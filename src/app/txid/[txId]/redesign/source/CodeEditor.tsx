'use client';

import { Box } from '@chakra-ui/react';
import Editor, { BeforeMount, EditorProps, Monaco, OnMount } from '@monaco-editor/react';
import Prism from 'prismjs';
import { forwardRef, memo, useCallback } from 'react';

import { clarity } from './clarity';
import { autocomplete, hover } from './editor-config/autocomplete';
import { claritySyntax } from './editor-config/claritySyntax';
import { defineTheme } from './editor-config/define-theme';
import { liftOff } from './editor-config/init';
import { configLanguage } from './editor-config/language';

clarity(Prism);

const CodeEditorBase = forwardRef<any, { code: string } & Partial<EditorProps>>(
  ({ code, ...editorProps }, ref) => {
    const handleEditorBeforeMount: BeforeMount = useCallback(async (monaco: Monaco) => {
      configLanguage(monaco);
      hover(monaco);
      autocomplete(monaco);
      defineTheme(monaco);
      if (claritySyntax) await liftOff(monaco, claritySyntax);
    }, []);
    const handleEditorOnMount: OnMount = useCallback(editor => {
      if (ref && 'current' in ref) {
        ref.current = editor;
      }
      editor.updateOptions({
        wordSeparators: '`~!@#$%^&*()=+[{]}\\|;:\'",.<>/?',
      });
    }, []);

    return (
      <Box
        css={{ '& .monaco-editor, & .overflow-guard': { borderRadius: 'redesign.xl' } }}
        w="full"
        h="full"
      >
        <Editor
          width="full"
          beforeMount={handleEditorBeforeMount}
          onMount={handleEditorOnMount}
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
      </Box>
    );
  }
);

export const CodeEditor = memo(CodeEditorBase);
