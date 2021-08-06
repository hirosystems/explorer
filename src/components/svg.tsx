import * as React from 'react';
import { Box, BoxProps, color } from '@stacks/ui';

import { BaseSvg, SvgProps } from '@components/icons/_base';
import { TransferIcon } from '@components/icons/transfer';
export { TransferIcon };
export const CheckmarkCircleIcon: React.FC<BoxProps> = props => (
  <Box {...props}>
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
      <path
        d="M7.99613 16.9961C12.3809 16.9961 16 13.377 16 8.99996C16 4.61523 12.3731 0.996094 7.9884 0.996094C3.61141 0.996094 0 4.61523 0 8.99996C0 13.377 3.61914 16.9961 7.99613 16.9961ZM6.94442 13.0367C6.65056 13.0367 6.41856 12.9052 6.1943 12.6423L3.96713 9.92794C3.82794 9.75781 3.75834 9.56448 3.75834 9.37889C3.75834 8.96129 4.08313 8.64423 4.47753 8.64423C4.71725 8.64423 4.91832 8.74476 5.11165 8.97676L6.92122 11.2581L10.4089 5.69015C10.579 5.41175 10.8033 5.28029 11.043 5.28029C11.4297 5.28029 11.8009 5.55095 11.8009 5.96081C11.8009 6.14641 11.7081 6.33974 11.5998 6.50987L7.67134 12.6191C7.48574 12.8975 7.23828 13.0367 6.94442 13.0367Z"
        fill="currentColor"
      />
    </svg>
  </Box>
);

export const ExclamationMarkCircleIcon: React.FC<BoxProps> = props => (
  <Box {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM7.9983 4C8.46541 4 8.84049 4.38536 8.82787 4.8523L8.72037 8.82986C8.70981 9.22031 8.39026 9.53134 7.99967 9.53134C7.60928 9.53134 7.28981 9.2206 7.279 8.83036L7.16874 4.85287C7.15579 4.38572 7.53096 4 7.9983 4ZM8.9199 11.0743C8.91607 11.5873 8.49058 12 7.99992 12C7.49392 12 7.0761 11.5873 7.07993 11.0743C7.0761 10.569 7.49392 10.1562 7.99992 10.1562C8.49058 10.1562 8.91607 10.569 8.9199 11.0743Z"
        fill="currentColor"
      />
    </svg>
  </Box>
);

export const CodeIcon: React.FC<BoxProps> = props => (
  <Box {...props}>
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.09871 13.4663C7.55475 13.594 7.98742 13.3501 8.12774 12.8797L11.4487 1.57859C11.5832 1.10239 11.3552 0.666836 10.8991 0.533267C10.4489 0.405504 10.0162 0.655221 9.87592 1.11981L6.55496 12.4268C6.42048 12.8972 6.64851 13.3327 7.09871 13.4663ZM13.5301 11.3872L17.693 7.6473C18.1023 7.28143 18.1023 6.71231 17.693 6.34645L13.5301 2.61231C13.1618 2.28129 12.6648 2.2929 12.3491 2.64134C12.0334 2.98978 12.0685 3.48341 12.4251 3.80862L15.9741 6.99687L12.4251 10.1851C12.0685 10.5103 12.0334 11.004 12.3491 11.3524C12.6648 11.7008 13.1618 11.7183 13.5301 11.3872ZM4.47351 11.3931C4.83601 11.7241 5.33883 11.7125 5.65456 11.3582C5.97028 11.0098 5.9352 10.5161 5.5727 10.1909L2.02372 7.00268L5.5727 3.82024C5.9352 3.48922 5.97028 3.0014 5.65456 2.64715C5.33883 2.29871 4.84186 2.28709 4.47351 2.61811L0.304767 6.35225C-0.104507 6.71812 -0.0986602 7.29305 0.304767 7.65311L4.47351 11.3931Z"
        fill="currentColor"
      />
    </svg>
  </Box>
);

export const MintIcon: SvgProps = props => (
  <BaseSvg size="20px" {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </BaseSvg>
);
export const BurnIcon: SvgProps = props => (
  <BaseSvg size="20px" {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18.918 8.174c2.56 4.982 .501 11.656 -5.38 12.626c-7.702 1.687 -12.84 -7.716 -7.054 -13.229c.309 -.305 1.161 -1.095 1.516 -1.349c0 .528 .27 3.475 1 3.167c3 0 4 -4.222 3.587 -7.389c2.7 1.411 4.987 3.376 6.331 6.174z" />
  </BaseSvg>
);

export const LogIcon: SvgProps = props => (
  <BaseSvg size="20px" {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="14" y2="12" />
    <line x1="4" y1="18" x2="18" y2="18" />
  </BaseSvg>
);

export const InfoIcon: React.FC<BoxProps> = props => (
  <Box {...props}>
    <svg width="100%" viewBox="0 0 12 12" fill="none">
      <path
        d="M5.9971 12C9.28565 12 12 9.28565 12 6.0029C12 2.71435 9.27985 0 5.9913 0C2.70855 0 0 2.71435 0 6.0029C0 9.28565 2.71435 12 5.9971 12ZM5.9623 4.03673C5.52731 4.03673 5.17351 3.67714 5.17351 3.24215C5.17351 2.79555 5.52731 2.44176 5.9623 2.44176C6.40889 2.44176 6.75689 2.79555 6.75689 3.24215C6.75689 3.67714 6.40889 4.03673 5.9623 4.03673ZM4.97052 9.15225C4.71532 9.15225 4.50653 8.96085 4.50653 8.69985C4.50653 8.45046 4.71532 8.25326 4.97052 8.25326H5.66651V5.8347H5.07492C4.81392 5.8347 4.61092 5.64911 4.61092 5.38231C4.61092 5.13291 4.81392 4.93572 5.07492 4.93572H6.1827C6.50749 4.93572 6.68149 5.16771 6.68149 5.51571V8.25326H7.32528C7.58627 8.25326 7.78927 8.45046 7.78927 8.69985C7.78927 8.96085 7.58627 9.15225 7.32528 9.15225H4.97052Z"
        fill="currentColor"
      />
    </svg>
  </Box>
);