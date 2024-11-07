import type { IconButtonProps } from '@chakra-ui/react';
import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react';
import { Moon, SunDim } from '@phosphor-icons/react';
import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider, useTheme } from 'next-themes';
import * as React from 'react';
import { useCallback } from 'react';
import { useCookies } from 'react-cookie';

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange enableSystem={false} {...props} />
  );
}

export const useUpdateThemeCookie = () => {
  const [_, setCookie] = useCookies(['stacks-explorer-theme']);

  const setThemeCookie = useCallback(
    (theme: 'light' | 'dark') => {
      setCookie('stacks-explorer-theme', theme, {
        path: '/',
        maxAge: 31536000, // 1 year in seconds
        sameSite: 'lax',
      });
    },
    [setCookie]
  );

  return setThemeCookie;
};

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const setThemeCookie = useUpdateThemeCookie();

  const toggleColorMode = useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    setThemeCookie(resolvedTheme === 'light' ? 'dark' : 'light');
  }, [setTheme, setThemeCookie, resolvedTheme]);

  const setColorMode = useCallback(
    (theme: 'light' | 'dark') => {
      setTheme(theme);
      setThemeCookie(theme);
    },
    [setTheme, setThemeCookie]
  );

  return {
    colorMode: resolvedTheme || 'light',
    setColorMode,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === 'light' ? light : dark;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === 'light' ? <SunDim /> : <Moon />;
}

interface ColorModeButtonProps extends Omit<IconButtonProps, 'aria-label'> {}

export const ColorModeButton = React.forwardRef<HTMLButtonElement, ColorModeButtonProps>(
  function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode();
    return (
      <ClientOnly fallback={<Skeleton boxSize="8" />}>
        <IconButton
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="Toggle color mode"
          size="sm"
          ref={ref}
          {...props}
          css={{
            _icon: {
              width: '5',
              height: '5',
            },
          }}
        >
          <ColorModeIcon />
        </IconButton>
      </ClientOnly>
    );
  }
);
