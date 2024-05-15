import { hexToRgb } from '../SignerDistributionPieChart';

describe('hexToRgb', () => {
  test('converts hex color #ffffff to RGB', () => {
    const result = hexToRgb('#ffffff');
    expect(result).toEqual({ r: 255, g: 255, b: 255 });
  });

  test('converts hex color #000000 to RGB', () => {
    const result = hexToRgb('#000000');
    expect(result).toEqual({ r: 0, g: 0, b: 0 });
  });

  test('converts hex color #ff5733 to RGB', () => {
    const result = hexToRgb('#ff5733');
    expect(result).toEqual({ r: 255, g: 87, b: 51 });
  });

  test('converts hex color without hash prefix #7F8C8D to RGB', () => {
    const result = hexToRgb('7F8C8D');
    expect(result).toEqual({ r: 127, g: 140, b: 141 });
  });
});
