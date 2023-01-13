'use client';

import { useAppDispatch, useAppSelector } from '@/common/state/hooks';
import { Box, Stack } from '@/ui/components';
import { Caption } from '@/ui/typography';
import Editor, { Monaco } from '@monaco-editor/react';
import { FC, useCallback, useState } from 'react';

import { ClarityIcon } from '../components/ClarityIcon';
import { Toolbar } from '../components/Toolbar';
import { autocomplete, hover } from '../editor-config/autocomplete';
import { defineTheme } from '../editor-config/define-theme';
import { liftOff } from '../editor-config/init';
import { configLanguage } from '../editor-config/language';
import { selectCodeBody, setCodeBody } from '../sandbox-slice';

interface LeftSectionProps {
  claritySyntax: Record<string, any>;
}

export const RightSection: FC<LeftSectionProps> = ({ claritySyntax }) => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const codeBody = useAppSelector(selectCodeBody);
  const handleEditorWillMount = useCallback(
    async (monaco: Monaco) => {
      if (!loaded) {
        configLanguage(monaco);
        hover(monaco);
        autocomplete(monaco);
        defineTheme(monaco);
        await liftOff(monaco, claritySyntax);

        setLoaded(true);
      }
    },
    [loaded, claritySyntax]
  );
  return (
    <>
      <Box
        px="32px"
        pb="16px"
        borderBottomWidth="1px"
        borderBottomColor="rgba(255,255,255,0.1)"
        color="white"
      >
        <Stack alignItems="center" isInline>
          <ClarityIcon size="16px" />
          <Caption transform="translateY(1px)" color="white">
            Clarity code editor
          </Caption>
        </Stack>
      </Box>
      <Box size="100%" position="relative">
        <Toolbar />
        <Editor
          beforeMount={handleEditorWillMount}
          onMount={editor => {
            editor.updateOptions({
              wordSeparators: '`~!@#$%^&*()=+[{]}\\|;:\'",.<>/?',
            });
          }}
          wrapperClassName="clarity-editor-wrapper"
          className="clarity-editor"
          defaultLanguage="clarity"
          theme="vs-dark"
          defaultValue={codeBody}
          value={codeBody}
          onChange={updatedCodeBody => dispatch(setCodeBody({ codeBody: updatedCodeBody || '' }))}
          options={{
            fontLigatures: true,
            fontSize: 14,
            minimap: {
              enabled: false,
            },
          }}
        />
      </Box>
    </>
  );
};
