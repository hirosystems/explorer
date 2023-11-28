'use client';

import React from 'react';

export const TokenVideo = ({ url }: { url: string }) => {
  return (
    <video width={'36px'} height={'36px'} src={encodeURI(url)} style={{ marginRight: '16px' }} />
  );
};
