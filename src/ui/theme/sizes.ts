import { SPACE } from './space';

// Already in the theme by default. Listing here for clarity/reference. https://chakra-ui-git-fix-typescript-autocomplete.chakra-ui.vercel.app/docs/theming/theme
// export const CI_DEFAULT_SIZES = {
//   //   ...theme.space, // imports all the space values
//   full: '100%',
//   '3xs': '14rem',
//   '2xs': '16rem',
//   xs: '20rem',
//   sm: '24rem',
//   md: '28rem',
//   lg: '32rem',
//   xl: '36rem',
//   '2xl': '42rem',
//   '3xl': '48rem',
//   '4xl': '56rem',
//   '5xl': '64rem',
//   '6xl': '72rem',
// };

export const CURRENT_SIZES = {
  3.5: { value: '0.875rem' }, // 14px
  4.5: { value: '1.125rem' }, // 18px
  18: { value: '4.5rem' }, // 72px
  60: { value: '3.75rem' }, // 60px
  150: { value: '9.375rem' }, // 150px
};

export const NEW_SIZES = {
  ...SPACE,
};

export const SIZES = {
  //   ...NEW_SIZES, // TODO: BREAKING CHANGE!
  ...CURRENT_SIZES,
};
