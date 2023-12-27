'use client';

import Editor, { Monaco } from '@monaco-editor/react';
import { useCallback, useState } from 'react';

import { claritySyntax } from '../../../common/constants/claritySyntax';
import { useAppDispatch, useAppSelector } from '../../../common/state/hooks';
import { Box } from '../../../ui/Box';
import { HStack } from '../../../ui/HStack';
import { Icon } from '../../../ui/Icon';
import { ClarityIcon } from '../../../ui/icons/ClarityIcon';
import { Caption } from '../../../ui/typography';
import { Toolbar } from '../components/Toolbar';
import { autocomplete, hover } from '../editor-config/autocomplete';
import { defineTheme } from '../editor-config/define-theme';
import { liftOff } from '../editor-config/init';
import { configLanguage } from '../editor-config/language';
import { selectCodeBody, setCodeBody } from '../sandbox-slice';

export function RightSection() {
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
    [loaded]
  );
  return (
    <>
      <HStack alignItems="center" borderBottomWidth="1px" color="white" pb={7}>
        <Icon as={ClarityIcon} size={4} />
        <Caption transform="translateY(1px)" color="white">
          Clarity code editor
        </Caption>
      </HStack>
      <Box height={'full'} position="relative">
        <Toolbar />
        <Editor
          beforeMount={handleEditorWillMount}
          onMount={editor => {
            editor.updateOptions({
              wordSeparators: '`~!@#$%^&*()=+[{]}\\|;:\'",.<>/?',
            });
          }}
          wrapperProps={{
            className: 'clarity-editor-wrapper',
          }}
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
}
