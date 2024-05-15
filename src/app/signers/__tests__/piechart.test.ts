// calculateLabelRadius.test.ts
import { calculateLabelRadius } from '../SignerDistributionPieChart';

describe('calculateLabelRadius', () => {
  const dynamicOuterRadius = 80; // Example dynamicOuterRadius value

  test('returns the longest radius for angle 0 degrees', () => {
    const result = calculateLabelRadius(dynamicOuterRadius, 0);
    expect(result).toBe(90); // Base radius at 0 degrees
  });

  test('returns the second longest radius for angle 45 degrees', () => {
    const result = calculateLabelRadius(dynamicOuterRadius, 45);
    expect(result).toBe(125); // Midpoint between 0 and 90
  });

  test('returns the shortest radius for angle 90 degrees', () => {
    const result = calculateLabelRadius(dynamicOuterRadius, 90);
    expect(result).toBe(160); // Max offset at 90 degrees
  });

  test('returns the second shortest radius for angle 135 degrees', () => {
    const result = calculateLabelRadius(dynamicOuterRadius, 135);
    expect(result).toBe(125); // Midpoint between 90 and 180
  });

  test('returns the longest radius for angle 180 degrees', () => {
    const result = calculateLabelRadius(dynamicOuterRadius, 180);
    expect(result).toBe(90); // Base radius at 180 degrees
  });

  test('returns the second shortest radius for angle 225 degrees', () => {
    const result = calculateLabelRadius(dynamicOuterRadius, 225);
    expect(result).toBe(125); // Midpoint between 180 and 270
  });

  test('returns the shortest radius for angle 270 degrees', () => {
    const result = calculateLabelRadius(dynamicOuterRadius, 270);
    expect(result).toBe(160); // Max offset at 270 degrees
  });

  test('returns the second longest radius for angle 315 degrees', () => {
    const result = calculateLabelRadius(dynamicOuterRadius, 315);
    expect(result).toBe(125); // Midpoint between 270 and 0
  });

  test('returns the longest radius for angle 360 degrees', () => {
    const result = calculateLabelRadius(dynamicOuterRadius, 360);
    expect(result).toBe(90); // Base radius at 360 degrees (same as 0 degrees)
  });

  // Add additional tests to show gradual increase
  test('returns gradually increasing radius from 90 to 0 degrees', () => {
    const angles = [90, 75, 60, 45, 30, 15, 0];
    const results = angles.map(angle => calculateLabelRadius(dynamicOuterRadius, angle));
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i]).toBeGreaterThan(results[i + 1]);
    }
  });

  test('returns gradually increasing radius from 270 to 180 degrees', () => {
    const angles = [270, 255, 240, 225, 210, 195, 180];
    const results = angles.map(angle => calculateLabelRadius(angle, dynamicOuterRadius));
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i]).toBeGreaterThan(results[i + 1]);
    }
  });

  test('returns gradually decreasing radius from 0 to 90 degrees', () => {
    const angles = [0, 15, 30, 45, 60, 75, 90];
    const results = angles.map(angle => calculateLabelRadius(angle, dynamicOuterRadius));
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i]).toBeLessThan(results[i + 1]);
    }
  });

  test('returns gradually decreasing radius from 180 to 270 degrees', () => {
    const angles = [180, 195, 210, 225, 240, 255, 270];
    const results = angles.map(angle => calculateLabelRadius(angle, dynamicOuterRadius));
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i]).toBeLessThan(results[i + 1]);
    }
  });
});
