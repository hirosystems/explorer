import { clarity } from '@/ui/CodeEditor/clarity';
import { useColorMode } from '@chakra-ui/react';
import Editor, { Monaco } from '@monaco-editor/react';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { FC, memo } from 'react';

import { autocomplete, hover } from '../../app/sandbox/editor-config/autocomplete';
import { defineTheme } from '../../app/sandbox/editor-config/define-theme';
import { liftOff } from '../../app/sandbox/editor-config/init';
import { configLanguage } from '../../app/sandbox/editor-config/language';

clarity(Prism);

const CodeEditorBase: FC<{ code: string; claritySyntax?: Record<string, any> }> = ({
  code,
  claritySyntax,
}) => {
  const handleEditorWillMount = async (monaco: Monaco) => {
    configLanguage(monaco);
    hover(monaco);
    autocomplete(monaco);
    defineTheme(monaco);
    if (claritySyntax) await liftOff(monaco, claritySyntax);
  };
  return (
    <Editor
      width={'100%'}
      height={'252px'}
      beforeMount={handleEditorWillMount}
      onMount={editor => {
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
    />
  );
};

export const CodeEditor = memo(CodeEditorBase);
