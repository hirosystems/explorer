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
  base: { value: 1.15 },
};

export const NEW_LINEHEIGHTS = {
  redesign: {
    normal: { value: 'normal' }, // default
    none: { value: '1' }, // default
    tighter: { value: '1.15' }, // custom
    tight: { value: '1.2' }, // custom
    shorter: { value: '1.25' }, // default
    snug: { value: '1.3' }, // custom
    short: { value: '1.375' }, // default
    medium: { value: '1.4' }, // custom
    base: { value: '1.5' }, // default
    tall: { value: '1.625' }, // default
    taller: { value: '2' }, // default
  },
};

export const LINEHEIGHTS = {
  ...NEW_LINEHEIGHTS,
  ...CURRENT_LINEHEIGHTS, // TODO: To remove, reconcile new base moving from 1.15 to 1.5
};
