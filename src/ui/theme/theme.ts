import { StyleFunctionProps, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const lightColors = {
  accent: '#5546FF',
  brand: '#5546FF',
  bg: '#fff',
  bg2: '#fff',
  bg3: '#fff',
  bg4: '#F7F7FA',
  bgAlt: '#F7F7FA',
  bgLight: '#fff',
  invert: '#040404',
  textHover: '#5546FF',
  textTitle: '#141416',
  textCaption: '#747478',
  textBody: '#424248',
  icon: '#9C9CA2',
  inputPlaceholder: '#747478',
  border: '#F0F0F2',
  feedbackAlert: '#FE9000',
  feedbackError: '#CF0000',
  feedbackSuccess: '#00A200',
  textInvert: '#fff',
};

const darkColors = {
  accent: '#7F80FF',
  brand: '#7F80FF',
  bg: '#040404',
  bg2: '#0A0A0A',
  bg3: '#141416',
  bg4: '#1E1E20',
  bgAlt: '#1E1E20',
  bgLight: '#1E1E20',
  invert: '#ffffff',
  textHover: '#7F80FF',
  textTitle: '#ffffff',
  textCaption: '#9C9CA2',
  textBody: '#F7F7FA',
  icon: '#9C9CA2',
  inputPlaceholder: '#9C9CA2',
  border: '#202020',
  feedbackAlert: '#FFB44D',
  feedbackError: '#F34D4D',
  feedbackSuccess: '#49CE49',
  textInvert: '#040404',
};

export const colors = {
  accent: { light: '#5546FF', dark: '#7F80FF' },
  brand: { light: '#5546FF', dark: '#8F91FF' },
  bg: { light: '#fff', dark: '#040404' },
  bg2: { light: '#fff', dark: '#0A0A0A' },
  bg3: { light: '#fff', dark: '#141416' },
  bg4: { light: '#F7F7FA', dark: '#1E1E20' },
  block: { light: '#f0f0f0', dark: '#202023' },
  lightBlock: { light: '#fff', dark: '#35353a' },
  bgAlt: { light: '#F7F7FA', dark: '#1E1E20' },
  bgLight: { light: '#fff', dark: '#1E1E20' },
  invert: { light: '#040404', dark: '#ffffff' },
  textHover: { light: '#5546FF', dark: '#7F80FF' },
  textTitle: { light: '#141416', dark: '#ffffff' },
  midnight: '#040404',
  textCaption: { light: '#747478', dark: '#9C9CA2' },
  textBody: { light: '#424248', dark: '#F7F7FA' },
  icon: { light: '#9C9CA2', dark: '#9C9CA2' },
  inputPlaceholder: { light: '#747478', dark: '#9C9CA2' },
  border: { light: '#F0F0F2', dark: '#202020' },
  feedbackAlert: { light: '#FE9000', dark: '#FFB44D' },
  feedbackError: { light: '#CF0000', dark: '#F34D4D' },
  feedbackSuccess: { light: '#00A200', dark: '#49CE49' },
  textInvert: { light: '#fff', dark: '#040404' },
  links: { light: '#47409c', dark: '#8F91FF' },
};

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
    cssVarPrefix: 'stacks',
  },
  colors,
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode('#fff', 'rgb(4, 4, 4)')(props),
      },
    }),
  },
  lineHeights: {
    base: 1.15,
  },
  zIndices: {
    tooltip: 10000,
  },
  fonts: {
    body: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
  },
  components: {
    // Tabs: tabsTheme,
  },
});
