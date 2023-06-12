export const hexToRgba = (hexColor: string, alpha: number) => {
  const validHexRegex = /^#?([a-f\d]{3}|[a-f\d]{6})$/i;
  if (!validHexRegex.test(hexColor)) {
    throw new Error('Invalid hex color');
  }

  const sixDigitHexColor = hexColor
    .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`)
    .slice(1);

  const r = parseInt(sixDigitHexColor.slice(0, 2), 16);
  const g = parseInt(sixDigitHexColor.slice(2, 4), 16);
  const b = parseInt(sixDigitHexColor.slice(4, 6), 16);

  if (alpha !== undefined) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return `rgb(${r}, ${g}, ${b})`;
};
