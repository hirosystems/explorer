import { makeButton, makeFolder, useTweaks } from 'use-tweaks';

const useTweakGradients = ({ handleGenerateNames }: any) => {
  const values = useTweaks({
    lightness: { value: 55, min: 20, max: 100 },
    saturation: { value: 65, min: 20, max: 100 },
    ...makeFolder('Color 1', {
      gradientStop1: { value: 0, min: 0, max: 100 },
      saturationFactor1: { value: 1.25, min: 0, max: 3 },
      lightnessFactor1: { value: 1.4, min: 0, max: 3 },
    }),
    ...makeFolder('Color 2', {
      gradientStop2: { value: 60, min: 0, max: 100 },
      saturationFactor2: { value: 1.2, min: 0, max: 3 },
      lightnessFactor2: { value: 0.9, min: 0, max: 3 },
    }),
    ...makeFolder('Color 3', {
      gradientStop3: { value: 100, min: 0, max: 100 },
      saturationFactor3: { value: 1, min: 0, max: 3 },
      lightnessFactor3: { value: 1, min: 0, max: 3 },
    }),
    ...makeButton('Regenerate', () => handleGenerateNames()),
  });

  return values;
};
