// @ts-nocheck
import React, { memo, useCallback, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useCodeEditor } from '@sandbox/components/code-editor/code-editor';
import { configLanguage } from '@sandbox/components/clarity-editor/language';
import { autocomplete } from '@sandbox/components/clarity-editor/autocomplete';
import { defineTheme } from '@sandbox/components/clarity-editor/define-theme';
import { liftOff } from '@sandbox/components/clarity-editor/init';

export const ClarityCodeEditor: React.FC = memo(() => {
  const [loaded, setLoaded] = useState(false);
  const handleEditorWillMount = useCallback(
    async (monaco: Monaco) => {
      if (!loaded) {
        configLanguage(monaco);
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
      defaultLanguage="clarity"
      theme="vs-dark"
      defaultValue={code}
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
});
