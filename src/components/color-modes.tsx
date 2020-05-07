import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { themeGet } from '@styled-system/theme-get';

export const colorGet = (path: string, fallback?: string) => themeGet('colors.' + path, fallback);

export const ColorModes = createGlobalStyle`
html, body{
    --colors-bg: white;
    --colors-bg-alt: ${colorGet('white')};
    --colors-bg-light: ${colorGet('ink.600')};
    --colors-invert: ${colorGet('ink')};
    --colors-text-hover: ${colorGet('blue')};
    --colors-text-title:  ${colorGet('ink')};
    --colors-text-caption:  ${colorGet('ink.400')};
    --colors-text-body:  ${colorGet('ink.900')};
    --colors-border: rgb(229, 229, 236);
}
@media (prefers-color-scheme: dark) {
  html, body {
    --colors-bg: ${colorGet('ink')};
    --colors-bg-light: ${colorGet('ink.800')};
    --colors-bg-alt: #2C2E33;
    --colors-invert: white;
    --colors-text-hover: ${colorGet('blue.300')};
    --colors-text-title: white;
    --colors-text-caption: #A7A7AD;
    --colors-text-body: ${colorGet('ink.300')};
    --colors-border: rgb(39, 41, 46);
  }
}
@media (prefers-color-scheme: light) {
  html, body {
    --colors-bg: white;
    --colors-bg-alt: ${colorGet('white')};
    --colors-bg-light: ${colorGet('ink.50')};
    --colors-invert: ${colorGet('ink')};
    --colors-text-hover: ${colorGet('blue')};
    --colors-text-title:  ${colorGet('ink')};
    --colors-text-caption:  ${colorGet('ink.400')};
    --colors-text-body:  ${colorGet('ink.900')};
    --colors-border: rgb(229, 229, 236);
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
