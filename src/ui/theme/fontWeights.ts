// Already in the theme by default. Listing here for clarity/reference. https://www.chakra-ui.com/docs/theming/typography
// export const CI_DEFAULT_FONT_WEIGHTS = {
//   thin: 100,
//   extralight: 200,
//   light: 300,
//   normal: 400,
//   medium: 500,
//   semibold: 600,
//   bold: 700,
//   extrabold: 800,
//   black: 900,
// };

export const CURRENT_FONT_WEIGHTS = {
  medium: { value: 500 },
};

export const NEW_FONT_WEIGHTS = {
  thin: { value: 100 },
  extralight: { value: 200 },
  light: { value: 300 },
  regular: { value: 400 },
  medium: { value: 500 },
  semibold: { value: 600 },
  bold: { value: 700 },
  extrabold: { value: 800 },
  black: { value: 900 },
};

export const FONT_WEIGHTS = {
  ...NEW_FONT_WEIGHTS,
  ...CURRENT_FONT_WEIGHTS,
};
