// Already in the theme by default. Listing here for clarity/reference. https://www.chakra-ui.com/docs/theming/breakpoints
// export const CI_DEFAULT_BREAKPOINTS = {
//   // '2xs': '320px',
//   // xs: '375px',
//   sm: '480px',
//   md: '768px',
//   lg: '1024px',
//   xl: '1280px',
//   '2xl': '1536px',
//   // '2xl': '1440px',
//   // '3xl': '1680px',
//   // '4xl': '1920px',
// };

export const CURRENT_BREAKPOINTS = {};

/* TODO: We would have to change all the responsive styles in our app because by adding breakpoint variables lower than sm 480px the first values we specify in a responsive styling array correspond to those lower breakpoint variables. I suggest that we leave this as a comment and come back to it later.
   If we extended all of our responsive styling arrays then writing responsive styles would become much more tedious, as we would need to add breakpoint variables for each of the breakpoints we want to support.
   Or we would have to start using the var names in the breakpoints object in the responsive styling arrays. But this would also mena that we would have to change all the responsive styles in our app. */
export const NEW_BREAKPOINTS = {
  'mobile-xs': '320px',
  'mobile-sm': '375px',
  'mobile-md': '480px',
  'mobile-lg': '768px',
  xs: '1024px',
  sm: '1280px',
  md: '1440px',
  lg: '1680px',
  xl: '1920px',
};

export const BREAKPOINTS = {
  ...CURRENT_BREAKPOINTS,
  // ...NEW_BREAKPOINTS,
};
