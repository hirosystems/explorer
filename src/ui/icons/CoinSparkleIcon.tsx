'use client';

import { Icon, IconBase, IconWeight } from '@phosphor-icons/react';
import { ReactElement, forwardRef } from 'react';

const weights = new Map<IconWeight, ReactElement>([
  [
    'regular',
    <>
      <path
        d="M12.7707 7.16431C14.2831 10.3267 14.3991 13.334 12.9354 14.1791C11.3033 15.1214 8.32521 13.0186 6.28361 9.48249C4.24201 5.94634 3.91003 2.31585 5.5421 1.37357C6.75432 0.673695 8.70911 1.65369 10.4712 3.65318"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.28363 9.48267L3.3285 11.1888"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.54224 1.37354L2.58711 3.07968C1.10954 3.93275 1.05377 7.24843 3.32863 11.1886C5.60348 15.1288 8.50283 16.7383 9.9804 15.8852L12.9355 14.1791"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.1673 13.0712L6.21217 14.7773"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.61761 5.1908L1.66249 6.89694"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2716 5.46459L9.42394 4.78506C9.36961 4.76501 9.32274 4.72878 9.28963 4.68127C9.25652 4.63376 9.23877 4.57724 9.23877 4.51933C9.23877 4.46142 9.25652 4.4049 9.28963 4.35738C9.32274 4.30987 9.36961 4.27365 9.42394 4.25359L11.2716 3.57406C11.31 3.55997 11.345 3.53767 11.3739 3.5087C11.4029 3.47973 11.4252 3.44479 11.4393 3.40632L12.1188 1.55871C12.1389 1.50438 12.1751 1.4575 12.2226 1.42439C12.2701 1.39129 12.3267 1.37354 12.3846 1.37354C12.4425 1.37354 12.499 1.39129 12.5465 1.42439C12.594 1.4575 12.6302 1.50438 12.6503 1.55871L13.3298 3.40632C13.3439 3.44479 13.3662 3.47973 13.3952 3.5087C13.4242 3.53767 13.4591 3.55997 13.4976 3.57406L15.3452 4.25359C15.3995 4.27365 15.4464 4.30987 15.4795 4.35738C15.5126 4.4049 15.5304 4.46142 15.5304 4.51933C15.5304 4.57724 15.5126 4.63376 15.4795 4.68127C15.4464 4.72878 15.3995 4.76501 15.3452 4.78506L13.4976 5.46459C13.4591 5.47868 13.4242 5.50099 13.3952 5.52995C13.3662 5.55892 13.3439 5.59386 13.3298 5.63233L12.6503 7.47995C12.6302 7.53428 12.594 7.58115 12.5465 7.61426C12.499 7.64737 12.4425 7.66512 12.3846 7.66512C12.3267 7.66512 12.2701 7.64737 12.2226 7.61426C12.1751 7.58115 12.1389 7.53428 12.1188 7.47995L11.4393 5.63233C11.4252 5.59386 11.4029 5.55892 11.3739 5.52995C11.345 5.50099 11.31 5.47868 11.2716 5.46459Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>,
  ],
]);

const CoinSparkleIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} viewBox={'0 0 17 17'} fill={'none'} />
));

CoinSparkleIcon.displayName = 'CoinSparkleIcon';

export default CoinSparkleIcon;
