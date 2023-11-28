'use client';

import { useParams } from 'next/navigation';

export function useParamsBlockHash() {
  const params = useParams();
  if (typeof params?.hash !== 'string') {
    throw new Error('Bad block hash param');
  }
  return params.hash;
}
