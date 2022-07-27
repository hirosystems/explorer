import React, { Component, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const identIcon = require('blockies-identicon');

interface IdentIconProps {
  seed: string;
}

export const IdentIcon: React.FC<IdentIconProps> = ({ seed }) => {
  const options = {
    seed: seed,
    color: '#5546FF',
    bgcolor: '#fff',
    size: 8,
    scale: 27,
    spotcolor: '#000',
  };

  let canvas: React.FC;

  useEffect(() => {
    identIcon.render(options, canvas);
  });

  return React.createElement('canvas', { ref: (c: React.FC) => (canvas = c) });
};
