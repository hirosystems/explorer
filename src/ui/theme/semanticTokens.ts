export const SEMANTIC_TOKENS = {
  colors: {
    brand: { value: '#FC6432' },
    borderPrimary: {
      value: { base: '{colors.slate.250}', _dark: '{colors.slate.850}' },
    },
    borderSecondary: {
      value: { base: '{colors.slate.150}', _dark: '{colors.slate.900}' },
    },
    error: {
      value: { base: '{colors.red.600}', _dark: '{colors.red.500}' },
    },
    success: {
      value: { base: '{colors.green.600}', _dark: '{colors.green.500}' },
    },
    surface: {
      value: { base: '{colors.white}', _dark: '{colors.black}' },
    },
    surfaceOpposite: {
      value: { base: '{colors.black}', _dark: '{colors.white}' },
    },
    surfaceHighlight: {
      value: { base: '{colors.slate.150}', _dark: '{colors.slate.900}' },
    },
    text: {
      value: { base: '{colors.slate.900}', _dark: '{colors.slate.50}' },
    },
    textSubdued: {
      value: { base: '{colors.slate.700}', _dark: '{colors.slate.600}' },
    },
    buttonText: {
      value: { base: '{colors.brand}', _dark: '{colors.purple.400}' },
    },
    interactive: {
      value: { base: '{colors.purple.600}', _dark: '{colors.purple.400}' },
    },
    hoverBackground: {
      value: { base: '{colors.slate.150}', _dark: '{colors.slate.850}' },
    },
    icon: {
      value: { base: '{colors.slate.900}', _dark: '{colors.slate.50}' },
    },
    iconSubdued: {
      value: { base: '{colors.slate.700}', _dark: '{colors.slate.600}' },
    },
    invert: {
      value: { base: '{colors.black}', _dark: '{colors.white}' },
    },
  },
};
