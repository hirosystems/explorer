// Already in the theme by default. Listing here for clarity/reference. https://www.chakra-ui.com/docs/theming/typography
// export const CI_DEFAULT_FONT_SIZES = {
//   '2xs': '0.625rem',
//   xs: '0.75rem',
//   sm: '0.875rem',
//   md: '1rem',
//   lg: '1.125rem',
//   xl: '1.25rem',
//   '2xl': '1.5rem',
//   '3xl': '1.875rem',
//   '4xl': '2.25rem',
//   '5xl': '3rem',
//   '6xl': '3.75rem',
//   '7xl': '4.5rem',
//   '8xl': '6rem',
//   '9xl': '8rem',
// };

export const CURRENT_FONT_SIZES = {};

export const NEW_FONT_SIZES = {
  '2xs': { value: '0.625rem' }, // 10px
  xs: { value: '0.75rem' }, // 12px
  sm: { value: '0.875rem' }, // 14px
  md: { value: '1rem' }, // 16px
  lg: { value: '1.125rem' }, // 18px
  xl: { value: '1.25rem' }, // 20px
  '2xl': { value: '1.5rem' }, // 24px
  '3xl': { value: '1.875rem' }, // 30px
  '3.5xl': { value: '2rem' }, // 32px
  '4xl': { value: '2.25rem' }, // 36px
  '4.5xl': { value: '2.5rem' }, // 40px
  '5xl': { value: '3rem' }, // 48px
  '5.75xl': { value: '3.75rem' }, // 60px
  '6xl': { value: '4rem' }, // 64px // BREAKING CHANGE: changes 3.75 to 4. I think CI is wrong
  '6.5xl': { value: '4.5rem' }, // 72px
  '7xl': { value: '5rem' }, // 80px // BREAKING CHANGE: changes 4.5 to 5. I think CI is wrong.
};

export const FONT_SIZES = {
  ...NEW_FONT_SIZES,
  ...CURRENT_FONT_SIZES,
};
