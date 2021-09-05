import * as React from 'react';
import { Global, css } from '@emotion/react';
import { ProgressBarStyles } from '@components/progress-bar';
import { prismTheme } from '@components/prism-theme';
import { theme, generateCssVariables } from '@stacks/ui';

const TextAreaOverrides = (
  <Global
    styles={css`
      @import url('https://x.syvita.org/fonts/roobert/importme.css');
      @import url('https://x.syvita.org/fonts/inter/importme.css');
      ${prismTheme};

      .code-editor {
        pre {
          width: fit-content;
          min-width: 100%;
          transform: translateY(2px);
        }

        input,
        textarea,
        [contenteditable] {
          caret-color: white;
        }

        & * {
          font-size: 18px !important;
        }

        textarea {
          width: 100% !important;
          padding-left: 76px !important;
          font-size: 18px !important;
          padding-top: 2px !important;
          font-family: 'Menlo', monospace !important;
          line-height: 24px !important;
          outline: transparent;
        }

        & > div {
          overflow: initial !important;
        }

        textarea,
        pre {
          white-space: pre !important;
          overflow-wrap: unset !important;
        }
      }
    `}
  />
);

const globalStyles = css`
  connect-modal {
    .modal-container {
      z-index: 999999999;
      pointer-events: none;
    }

    .modal-body {
      pointer-events: all;
    }
  }

  html,
  body,
  #__next {
    height: 100%;
  }

  div[data-tippy-root] {
    z-index: 999999999999 !important;
  }

  .prism-code *::selection {
    background-color: #aab3ff;
    color: white !important;
  }

  .portal {
    position: relative;
    z-index: 99;
  }

  a {
    text-decoration: none;
  }

  * {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:root {
  @media (prefers-color-scheme: light) {
    ${generateCssVariables('light')({ colorMode: 'light', theme })};
    --colors-highlight-line-bg: rgba(255, 255, 255, 0.1);
    --colors-accent: #9146ff !important;
    --colors-brand: #9146ff !important;
    --colors-text-hover: #9146ff !important;
  }
  @media (prefers-color-scheme: dark) {
    ${generateCssVariables('dark')({ colorMode: 'dark', theme })};
    --colors-highlight-line-bg: rgba(255, 255, 255, 0.05);
    --colors-accent: #bfabff !important;
    --colors-brand: #bfabff !important;
  }
}

html,
body,
#__next {
  background: var(--colors-bg);
  border-color: var(--colors-border);

  @media (prefers-color-scheme: light) {
    :root {
      ${generateCssVariables('light')({ colorMode: 'light', theme })};
      --colors-highlight-line-bg: rgba(255, 255, 255, 0.1);
    }
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }

  @media (prefers-color-scheme: dark) {
    :root {
      ${generateCssVariables('dark')({ colorMode: 'dark', theme })};
      --colors-highlight-line-bg: rgba(255, 255, 255, 0.04);
    }
    * {
      -webkit-font-smoothing: subpixel-antialiased;
      -moz-osx-font-smoothing: auto;
    }
  }
}
`;

const GlobalStyles = <Global styles={globalStyles} />;

export { TextAreaOverrides, GlobalStyles, ProgressBarStyles };
