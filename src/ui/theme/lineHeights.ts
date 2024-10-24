// Already in the theme by default. Listing here for clarity/reference.
// export const CI_DEFAULT_BREAKPOINTS = {
//   normal: 'normal',
//   none: '1',
//   shorter: '1.25',
//   short: '1.375',
//   base: '1.5',
//   tall: '1.625',
//   taller: '2',
// };

export const CURRENT_LINEHEIGHTS = {
  base: 1.15,
};

export const NEW_LINEHEIGHTS = {
  normal: 'normal', // default
  none: '1', // default
  tighter: '1.15', // custom
  tight: '1.2', // custom
  shorter: '1.25', // default
  snug: '1.3', // custom
  short: '1.375', // default
  medium: '1.4', // custom
  base: '1.5', // default
  tall: '1.625', // default
  taller: '2', // default
};

export const LINEHEIGHTS = {
  ...NEW_LINEHEIGHTS,
  ...CURRENT_LINEHEIGHTS, // TODO: To remove, reconcile new base moving from 1.15 to 1.5
};
