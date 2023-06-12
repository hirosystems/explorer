import { hexToRgba } from '../colors';

// unit test for hexToRgba
describe('hexToRgba', () => {
  test('should return rgba value for 3 digit hex', () => {
    const hex = '#fff';
    const alpha = 0.5;
    const expectedRgba = 'rgba(255, 255, 255, 0.5)';
    const actualRgba = hexToRgba(hex, alpha);

    expect(actualRgba).toEqual(expectedRgba);
  });
  test('should return rgba value for 3 digit hex with no alpha', () => {
    const hex = '#fff';
    const expectedRgba = 'rgb(255, 255, 255)';
    const actualRgba = hexToRgba(hex);

    expect(actualRgba).toEqual(expectedRgba);
  });
  test('should return rgba value for 6 digit hex', () => {
    const hex = '#ffffff';
    const alpha = 0.5;
    const expectedRgba = 'rgba(255, 255, 255, 0.5)';
    const actualRgba = hexToRgba(hex, alpha);

    expect(actualRgba).toEqual(expectedRgba);
  });
  test('should return rgba value for 6 digit hex with no alpha', () => {
    const hex = '#ffffff';
    const expectedRgba = 'rgb(255, 255, 255)';
    const actualRgba = hexToRgba(hex);

    expect(actualRgba).toEqual(expectedRgba);
  });
  test('should throw error for invalid hex', () => {
    const hex = '#ffff';
    const alpha = 0.5;

    expect(() => hexToRgba(hex, alpha)).toThrowError('Invalid hex color');
  });
});
