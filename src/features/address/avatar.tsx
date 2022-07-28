import React, { Component, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const identIcon = require('blockies-identicon');

interface IdentIconProps {
  seed: string;
  size?: number; 
  scale?: number;
}

export const IdentIcon: React.FC<IdentIconProps> = ({ seed, size, scale }) => {
  let realSize = size===undefined ? 8 : size; 
  let realScale = scale===undefined ? 27 : scale;
  const options = {
    seed: seed,
    color: '#5546FF',
    bgcolor: '#fff',
    size: realSize,
    scale: realScale,
    spotcolor: '#000',
  };

  let canvas: React.FC;

  useEffect(() => {
    identIcon.render(options, canvas);
  });

  return React.createElement('canvas', { ref: (c: React.FC) => (canvas = c) });
};
