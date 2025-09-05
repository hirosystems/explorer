'use client';

import { CopyButtonRedesign } from '@/common/components/CopyButton';
import { useColorMode } from '@/components/ui/color-mode';
import { Button } from '@/ui/Button';
import { Flex, Icon, Stack } from '@chakra-ui/react';
import Editor, { BeforeMount, EditorProps, Monaco, OnMount } from '@monaco-editor/react';
import { ArrowsOutSimple } from '@phosphor-icons/react';
import Prism from 'prismjs';
import { forwardRef, memo, useCallback, useRef, useState } from 'react';

import { clarity } from './clarity';
import { autocomplete, hover } from './editor-config/autocomplete';
import { claritySyntax } from './editor-config/claritySyntax';
import { defineTheme } from './editor-config/define-theme';
import { liftOff } from './editor-config/init';
import { configLanguage } from './editor-config/language';

clarity(Prism);

export const DEFAULT_EDITOR_HEIGHT = '500px';
const BUTTONS_HEIGHT = 8;

type CodeEditorProps = {
  code: string;
} & Partial<EditorProps>;

const CodeEditorBase = forwardRef<any, CodeEditorProps>(({ code, ...editorProps }, ref) => {
  const handleEditorBeforeMount: BeforeMount = useCallback(async (monaco: Monaco) => {
    configLanguage(monaco);
    hover(monaco);
    autocomplete(monaco);
    defineTheme(monaco);
    if (claritySyntax) await liftOff(monaco, claritySyntax);
  }, []);
  const handleEditorOnMount: OnMount = useCallback(
    editor => {
      if (ref && 'current' in ref) {
        ref.current = editor;
      }
      editor.updateOptions({
        wordSeparators: '`~!@#$%^&*()=+[{]}\\|;:\'",.<>/?',
      });
    },
    [ref]
  );
  const colorMode = useColorMode();

  return (
    <Stack
      css={{ '& .monaco-editor, & .overflow-guard': { borderRadius: 'redesign.xl' } }}
      w="full"
      flexGrow={1}
      minHeight={DEFAULT_EDITOR_HEIGHT}
    >
      <Editor
        width="full"
        beforeMount={handleEditorBeforeMount}
        onMount={handleEditorOnMount}
        defaultLanguage="clarity"
        theme={colorMode.colorMode === 'light' ? 'vs-light' : 'vs-dark'}
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
          scrollbar: {
            alwaysConsumeMouseWheel: false,
          },
        }}
        {...editorProps}
      />
    </Stack>
  );
});

export const CodeEditor = memo(CodeEditorBase);

// HOC to add controls to the code editor
export function withControls(
  WrappedCodeEditor: typeof CodeEditor,
  hasCopyButton = true,
  hasExpandButton = true
) {
  return function CodeEditorWithControls({ code, ...editorProps }: CodeEditorProps) {
    const [codeHeight, setCodeHeight] = useState(DEFAULT_EDITOR_HEIGHT);
    const [isCodeHeightExpanded, setIsCodeHeightExpanded] = useState(false);
    const editorRef = useRef<any>(null);
    const toggleHeight = useCallback(() => {
      setIsCodeHeightExpanded(!isCodeHeightExpanded);
      if (isCodeHeightExpanded) {
        setCodeHeight(DEFAULT_EDITOR_HEIGHT);
      } else {
        setCodeHeight(editorRef.current?.getContentHeight());
      }
    }, [isCodeHeightExpanded]);

    return (
      <Flex position="relative" w="full">
        <Stack
          className="floating-buttons"
          position={'absolute'}
          top={4}
          right={4}
          gap={1.5}
          zIndex="docked"
        >
          {hasCopyButton && (
            <CopyButtonRedesign
              initialValue={code}
              iconProps={{
                h: 3.5,
                w: 3.5,
              }}
              buttonProps={{
                variant: 'redesignPrimary',
                p: 1.5,
                h: BUTTONS_HEIGHT,
                w: BUTTONS_HEIGHT,
                minW: BUTTONS_HEIGHT,
              }}
            />
          )}
          {hasExpandButton && (
            <Button
              variant="redesignPrimary"
              aria-label={'expand source code'}
              onClick={toggleHeight}
              p={1.5}
              h={BUTTONS_HEIGHT}
              w={BUTTONS_HEIGHT}
              minW={BUTTONS_HEIGHT}
            >
              <Icon color="iconInvert" h={3.5} w={3.5}>
                <ArrowsOutSimple />
              </Icon>
            </Button>
          )}
        </Stack>
        <Stack height={codeHeight} w="full">
          <WrappedCodeEditor code={code} ref={editorRef} {...editorProps} />
        </Stack>
      </Flex>
    );
  };
}
