import React, { useCallback } from 'react';
import { createGlobalStyle } from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { colorModeStorage, COLOR_MODE_COOKIE } from '@common/utils';
import { useMediaQuery } from '@common/hooks/use-media-query';

export const colorGet = (path: string, fallback?: string) => themeGet('colors.' + path, fallback);

const colors = (props: any) => ({
  light: {
    ['accent']: colorGet('blue')(props),
    ['bg']: 'white',
    ['bg-alt']: colorGet('white')(props),
    ['bg-light']: colorGet('ink.600')(props),
    ['invert']: colorGet('ink')(props),
    ['text-hover']: colorGet('blue')(props),
    ['text-title']: colorGet('ink')(props),
    ['text-caption']: colorGet('ink.400')(props),
    ['text-body']: colorGet('ink.900')(props),
    ['border']: 'rgb(229, 229, 236)',
    ['feedback-alert']: colorGet('orange')(props),
    ['feeback-error']: colorGet('red')(props),
    ['feeback-success']: colorGet('green')(props),
  },
  dark: {
    ['accent']: colorGet('cyan')(props),
    ['bg']: colorGet('ink')(props),
    ['bg-alt']: colorGet('ink.800')(props),
    ['bg-light']: '#2c2e33',
    ['invert']: 'white',
    ['text-hover']: colorGet('blue.300')(props),
    ['text-title']: 'white',
    ['text-caption']: '#a7a7ad',
    ['text-body']: colorGet('ink.300')(props),
    ['border']: 'rgb(39, 41, 46)',
    ['feedback-alert']: colorGet('orange')(props),
    ['feeback-error']: colorGet('red')(props),
    ['feeback-success']: colorGet('green')(props),
  },
});

// @ts-ignore
const colorModeStyles = (props: any) => colors(props)[props.colorMode];
// @ts-ignore
const colorMap = (props: any) => Object.keys(colors(props)[props.colorMode]);

export const ColorModes = createGlobalStyle`
${({ colorMode = 'light', ...rest }: any) =>
  colorMap({ colorMode, ...rest }).map(key => {
    return `--colors-${key}: ${
      //@ts-ignore
      colorModeStyles({ colorMode, ...rest })[key as string]
    };`;
  })}

  @media (prefers-color-scheme: dark) {
    html,
    body {
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
    html,
    body {
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
