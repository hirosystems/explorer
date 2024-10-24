// Already in the theme by default. Listing here for clarity/reference. https://www.chakra-ui.com/docs/theming/radii
// export const CI_DEFAULT_BORDER_RADIUS = {
// none: '0',          // 0px
// '2xs': '0.0625rem', // 1px
// xs: '0.125rem',     // 2px
// sm: '0.25rem',      // 4px
// md: '0.375rem',     // 6px
// lg: '0.5rem',       // 8px
// xl: '0.75rem',      // 12px
// '2xl': '1rem',      // 16px
// '3xl': '1.5rem',    // 24px
// '4xl': '2rem',      // 32px
// full: '9999px',     // 9999px
// };

export const CURRENT_BORDER_RADIUS = {};

// I don't think we should use this as the same values are represented in the theme by default, and changing the naming convention will just break things and require us to fix it in a bunch of places.
export const NEW_BORDER_RADIUS = {
  xxs: '2px',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
};

export const BORDER_RADIUS = {
  //   ...NEW_BORDER_RADIUS, // TODO: BREAKING CHANGE!
  ...CURRENT_BORDER_RADIUS,
};
