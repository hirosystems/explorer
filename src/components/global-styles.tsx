import * as React from 'react';
import { Global, css } from '@emotion/react';
import { ProgressBarStyles } from '@components/progress-bar';
import { prismTheme } from '@components/prism-theme';

const TextAreaOverrides = (
  <Global
    styles={css`
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
          font-size: 14px !important;
        }

        textarea {
          width: 100% !important;
          padding-left: 76px !important;
          font-size: 14px !important;
          padding-top: 2px !important;
          font-family: 'Fira Code', monospace !important;
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

  @font-face {
    font-family: 'Open Sauce';
    src: url('/static/fonts/opensaucesans-medium-webfont.woff2') format('woff2'),
      url('/static/fonts/opensaucesans-medium-webfont.woff') format('woff');
    font-weight: 500;
    font-display: swap;
    font-style: normal;
  }

  @font-face {
    font-family: 'Open Sauce';
    src: url('/static/fonts/opensaucesans-regular-webfont.woff2') format('woff2'),
      url('/static/fonts/opensaucesans-regular-webfont.woff') format('woff');
    font-weight: 400;
    font-weight: normal;
    font-style: normal;
  }
`;

const GlobalStyles = <Global styles={globalStyles} />;

export { TextAreaOverrides, GlobalStyles, ProgressBarStyles };
