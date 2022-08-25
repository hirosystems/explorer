import * as React from 'react';
import { Global, css } from '@emotion/react';
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

  /* cyrillic-ext */
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/firacode/v9/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJV37MOzlojwUKaJO.woff)
      format('woff');
    unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
  }
  /* cyrillic */
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/firacode/v9/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVT7MOzlojwUKaJO.woff)
      format('woff');
    unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
  }
  /* greek-ext */
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/firacode/v9/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVz7MOzlojwUKaJO.woff)
      format('woff');
    unicode-range: U+1F00-1FFF;
  }
  /* greek */
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/firacode/v9/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVP7MOzlojwUKaJO.woff)
      format('woff');
    unicode-range: U+0370-03FF;
  }
  /* latin-ext */
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/firacode/v9/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJV77MOzlojwUKaJO.woff)
      format('woff');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113,
      U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/firacode/v9/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVD7MOzlojwUKQ.woff)
      format('woff');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
      U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
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

  .skeleton-outer {
    display: flex;
    align-items: center;
  }

  .skeleton-outer-full-width {
    display: flex;
    width: 100%;
    align-items: center;
  }

  .skeleton-title {
    --base-color: rgba(255, 255, 255, 0.24);
    --highlight-color: rgba(255, 255, 255, 0.74)
  }

  .dark {
    .react-loading-skeleton {
      --base-color: #1a1a1a;
    }
    .react-loading-skeleton::after {
      --base-color: #1a1a1a;
      --highlight-color: #151515;
    }
    .skeleton-title {
      --base-color: rgba(255, 255, 255, 0.24);
    }
    .skeleton-title::after {
      --base-color: rgba(255, 255, 255, 0.24);
      --highlight-color: rgba(255, 255, 255, 0.74)
    }
`;

const GlobalStyles = <Global styles={globalStyles} />;

export { TextAreaOverrides, GlobalStyles };
