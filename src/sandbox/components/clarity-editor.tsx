// @ts-nocheck
import React, { useCallback, useRef, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useCodeEditor } from '@sandbox/components/code-editor/code-editor';
import { configLanguage } from '@sandbox/components/clarity-editor/language';
import { autocomplete, hover } from '@sandbox/components/clarity-editor/autocomplete';
import { defineTheme } from '@sandbox/components/clarity-editor/define-theme';
import { liftOff } from '@sandbox/components/clarity-editor/init';
import { useSafeLayoutEffect } from '@stacks/ui';

export const ClarityCodeEditor: React.FC<{ width?: number; height?: number }> = ({
  width,
  height,
}) => {
  const editorRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const handleEditorWillMount = useCallback(
    async (monaco: Monaco) => {
      if (!loaded) {
        configLanguage(monaco);
        hover(monaco);
        autocomplete(monaco);
        defineTheme(monaco);
        await liftOff(monaco);

        setLoaded(true);
      }
    },
    [loaded, setLoaded, configLanguage, autocomplete, defineTheme, liftOff]
  );

  const [code, setCode] = useCodeEditor();

  return (
    <Editor
      beforeMount={handleEditorWillMount}
      onMount={editor => {
        if (!editorRef?.current) {
          editorRef.current = editor;
        }
        editor.updateOptions({
          wordSeparators: '`~!@#$%^&*()=+[{]}\\|;:\'",.<>/?',
        });
      }}
      wrapperClassName="clarity-editor-wrapper"
      className="clarity-editor"
      defaultLanguage="clarity"
      theme="vs-dark"
      defaultValue={code}
      value={code}
      onChange={setCode as any}
      options={{
        fontLigatures: true,
        fontSize: 14,
        minimap: {
          enabled: false,
        },
      }}
    />
  );
};
