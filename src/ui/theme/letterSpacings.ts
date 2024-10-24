// Already in the theme by default. Listing here for clarity/reference. https://chakra-ui-git-fix-typescript-autocomplete.chakra-ui.vercel.app/docs/theming/theme
// export const CI_DEFAULT_LETTER_SPACINGS = {
//   tighter: '-0.05em',
//   tight: '-0.025em',
//   normal: '0',
//   wide: '0.025em',
//   wider: '0.05em',
//   widest: '0.1em',
// };

export const CURRENT_LETTER_SPACINGS = {};

export const NEW_LETTER_SPACINGS = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
};

export const LETTER_SPACINGS = {
  ...NEW_LETTER_SPACINGS,
  ...CURRENT_LETTER_SPACINGS,
};
