'use client';

import { Icon, IconBase, IconWeight } from '@phosphor-icons/react';
import { ReactElement, forwardRef } from 'react';

const weights = new Map<IconWeight, ReactElement>([
  [
    'regular',
    <>
      <foreignObject x="-10.2832" y="-10.7832" width="85.5664" height="85.5664">
        <div></div>
      </foreignObject>
      <circle
        data-figma-bg-blur-radius="10.7832"
        cx="32.5"
        cy="32"
        r="32"
        fill="url(#paint0_linear_4954_36475)"
        fillOpacity="0.9"
      />
      <foreignObject x="-3.16404" y="-3.66404" width="71.3281" height="71.3283">
        <div></div>
      </foreignObject>
      <circle
        data-figma-bg-blur-radius="10.7832"
        cx="32.5001"
        cy="32.0001"
        r="24.881"
        fill="url(#paint1_linear_4954_36475)"
        fillOpacity="0.9"
      />
      <foreignObject x="5.00002" y="4.50051" width="55" height="54.9992">
        <div></div>
      </foreignObject>
      <circle
        data-figma-bg-blur-radius="10.7832"
        cx="32.4996"
        cy="32.0001"
        r="16.7164"
        fill="url(#paint2_linear_4954_36475)"
        fillOpacity="0.9"
      />
      <circle
        cx="18.4633"
        cy="31.9803"
        r="2.96504"
        transform="rotate(-26.1044 18.4633 31.9803)"
        fill="#2D2C2A"
      />
      <circle
        cx="40.5043"
        cy="21.179"
        r="2.96504"
        transform="rotate(-26.1044 40.5043 21.179)"
        fill="#2D2C2A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M46.5142 28.6097C46.8797 29.2429 47.9585 29.1924 48.5917 28.8268C49.8663 28.091 51.4961 28.5277 52.232 29.8023C52.9679 31.0768 52.5312 32.7067 51.2566 33.4425C49.982 34.1784 48.3522 33.7417 47.6163 32.4671C47.2247 31.7888 46.1522 31.0503 45.4739 31.4419L25.5756 42.9302C24.8974 43.3218 25.0006 44.6192 25.3922 45.2974C26.1281 46.572 25.6914 48.2018 24.4168 48.9377C23.1422 49.6735 21.5124 49.2368 20.7765 47.9622C20.0406 46.6877 20.4773 45.0578 21.7519 44.322C22.3847 43.9566 22.967 43.0485 22.6016 42.4157L22.2069 41.732C21.8648 41.1394 22.0678 40.3816 22.6604 40.0395L44.4271 27.4725C45.0196 27.1304 45.7773 27.3334 46.1193 27.9259L46.5142 28.6097Z"
        fill="#2D2C2A"
      />
      <defs>
        <clipPath id="bgblur_0_4954_36475_clip_path" transform="translate(10.2832 10.7832)">
          <circle cx="32.5" cy="32" r="32" />
        </clipPath>
        <clipPath id="bgblur_1_4954_36475_clip_path" transform="translate(3.16404 3.66404)">
          <circle cx="32.5001" cy="32.0001" r="24.881" />
        </clipPath>
        <clipPath id="bgblur_2_4954_36475_clip_path" transform="translate(-5.00002 -4.50051)">
          <circle cx="32.4996" cy="32.0001" r="16.7164" />
        </clipPath>
        <linearGradient
          id="paint0_linear_4954_36475"
          x1="32.5"
          y1="64"
          x2="32.5"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.276042" stop-color="#95918C" />
          <stop offset="0.526042" stop-color="#E5E0DC" stop-opacity="0.34" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_4954_36475"
          x1="32.5001"
          y1="56.8811"
          x2="32.5001"
          y2="7.11914"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.276042" stop-color="#95918C" />
          <stop offset="0.526042" stop-color="#E5E0DC" stop-opacity="0.34" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_4954_36475"
          x1="32.4996"
          y1="48.7165"
          x2="32.4996"
          y2="15.2837"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.276042" stop-color="#95918C" stop-opacity="0.69" />
          <stop offset="0.629036" stop-color="#E5E0DC" stop-opacity="0.34" />
        </linearGradient>
      </defs>
    </>,
  ],
]);

const StacksFrowneyIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} viewBox={'0 0 65 64'} />
));

StacksFrowneyIcon.displayName = 'StacksFrowneyIcon';

export default StacksFrowneyIcon;
