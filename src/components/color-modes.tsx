import React, { useCallback } from 'react';
import { createGlobalStyle } from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { colorModeStorage, COLOR_MODE_COOKIE } from '@common/utils';
import { useMediaQuery } from '@common/hooks/use-media-query';
import { Theme } from '@blockstack/ui';

export const colorGet = (path: string, fallback?: string) => themeGet('colors.' + path, fallback);

interface colorModeTypes {
  ['accent']: string;
  ['bg']: string;
  ['bg-alt']: string;
  ['bg-light']: string;
  ['invert']: string;
  ['text-hover']: string;
  ['text-title']: string;
  ['text-caption']: string;
  ['text-body']: string;
  ['input-placeholder']: string;
  ['border']: string;
  ['feedback-alert']: string;
  ['feedback-error']: string;
  ['feedback-success']: string;
}

interface ColorModesInterface {
  light: colorModeTypes;
  dark: colorModeTypes;
}

const colors = (props: { theme: Theme }): ColorModesInterface => ({
  light: {
    ['accent']: colorGet('blue')(props),
    ['bg']: 'white',
    ['bg-alt']: colorGet('ink.50')(props),
    ['bg-light']: 'white',
    ['invert']: colorGet('ink')(props),
    ['text-hover']: colorGet('blue')(props),
    ['text-title']: colorGet('ink')(props),
    ['text-caption']: colorGet('ink.600')(props),
    ['text-body']: colorGet('ink.900')(props),
    ['input-placeholder']: colorGet('ink.400')(props),
    ['border']: 'rgb(229, 229, 236)',
    ['feedback-alert']: colorGet('orange')(props),
    ['feedback-error']: colorGet('red')(props),
    ['feedback-success']: colorGet('green')(props),
  },
  dark: {
    ['accent']: colorGet('blue.400')(props),
    ['bg']: colorGet('ink')(props),
    ['bg-light']: 'rgba(255,255,255,0.05)',
    ['bg-alt']: 'rgba(255,255,255,0.08)',
    ['invert']: 'white',
    ['text-hover']: colorGet('blue.300')(props),
    ['text-title']: 'white',
    ['text-caption']: '#a7a7ad',
    ['text-body']: colorGet('ink.300')(props),
    ['input-placeholder']: 'rgba(255,255,255,0.3)',
    ['border']: 'rgb(39, 41, 46)',
    ['feedback-alert']: colorGet('orange')(props),
    ['feedback-error']: colorGet('red')(props),
    ['feedback-success']: colorGet('green')(props),
  },
});

const colorModeStyles = (props: { theme: Theme; colorMode: 'light' | 'dark' }) =>
  colors(props)[props.colorMode];

const colorMap = (props: { theme: Theme; colorMode: 'light' | 'dark' }) =>
  Object.keys(colors(props)[props.colorMode]);

export const ColorModes = createGlobalStyle`

:root{
${({ colorMode = 'light', ...rest }: any) =>
  colorMap({ colorMode, ...rest }).map(key => {
    return `--colors-${key}: ${
      //@ts-ignore
      colorModeStyles({ colorMode, ...rest })[key as string]
    };`;
  })}
}
  @media (prefers-color-scheme: dark) {
    :root {
    ${({ colorMode = 'dark', ...rest }: any) =>
      colorMap({ colorMode, ...rest }).map(key => {
        return `--colors-${key}: ${
          //@ts-ignore
          colorModeStyles({ colorMode, ...rest })[key as string]
        };`;
      })}
    }
  }
  
  @media (prefers-color-scheme: light) {
    :root {
    ${({ colorMode = 'light', ...rest }: any) =>
      colorMap({ colorMode, ...rest }).map(key => {
        return `--colors-${key}: ${
          //@ts-ignore
          colorModeStyles({ colorMode, ...rest })[key as string]
        };`;
      })}
    }
  }
    
  html, body, #__next {
    background: var(--colors-bg);
    border-color: var(--colors-border);
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--colors-text-body);
    font-size: 16px !important;
    transition: background-color 5000s ease-in-out 0s;
  }
  
  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: var(--colors-input-placeholder) !important;
  }

  input::-ms-input-placeholder,
  textarea::-ms-input-placeholder {
    color:  var(--colors-input-placeholder) !important;
  }

  input::placeholder,
  textarea::placeholder {
    color:  var(--colors-input-placeholder) !important;
  }
  `;

export const ColorModeContext = React.createContext<{ colorMode?: string; toggleColorMode?: any }>({
  colorMode: undefined,
});

export const ColorModeProvider = ({
  colorMode,
  children,
}: {
  colorMode?: string;
  children: any;
}) => {
  const [mode, setMode] = React.useState(colorMode);
  const [darkmode] = useMediaQuery('(prefers-color-scheme: dark)');
  const [lightmode] = useMediaQuery('(prefers-color-scheme: light)');

  const setColorMode = useCallback(
    (mode: 'light' | 'dark') => {
      setMode(mode);
      colorModeStorage.set(COLOR_MODE_COOKIE, mode);
    },
    [mode]
  );

  const toggleColorMode = useCallback(() => {
    if (mode === 'light') {
      setColorMode('dark');
      return;
    }
    if (mode === 'dark') {
      setColorMode('light');
      return;
    }
    if (!colorMode && darkmode) {
      setColorMode('light');
      return;
    }
    if (!mode && lightmode) {
      setColorMode('dark');
      return;
    }
  }, [mode, lightmode, darkmode]);

  return (
    <ColorModeContext.Provider value={{ colorMode: mode, toggleColorMode }}>
      <ColorModes colorMode={mode} />
      {children}
    </ColorModeContext.Provider>
  );
};
