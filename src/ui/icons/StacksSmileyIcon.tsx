import { IconBase, IconWeight } from '@phosphor-icons/react';
import { ReactElement, forwardRef } from 'react';

interface StacksSmileyIconWeightProps {
  circleColor: string;
  linearGradientColor: string;
  laserEyesOn?: boolean;
}

const createWeight = ({
  circleColor,
  linearGradientColor,
}: StacksSmileyIconWeightProps): ReactElement => (
  <svg viewBox="0 0 68 68" fill="none" className="stacks-smiley">
    <circle cx="34" cy="34" r="28" fill={circleColor} />
    <g filter="url(#filter0_b_2985_1972)">
      <circle
        cx="34"
        cy="34"
        r="19.8028"
        stroke="url(#paint0_linear_2985_1972)"
        stroke-width="16.3943"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <g filter="url(#filter1_b_2985_1972)">
      <circle cx="34.0004" cy="34" r="21.7709" fill="url(#paint1_linear_2985_1972)" />
      <circle
        cx="34.0004"
        cy="34"
        r="13.5737"
        stroke="url(#paint2_linear_2985_1972)"
        stroke-opacity="0.4"
        stroke-width="16.3943"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <g filter="url(#filter2_b_2985_1972)">
      <circle cx="33.9989" cy="34.0001" r="14.6268" fill="url(#paint3_linear_2985_1972)" />
      <circle
        cx="33.9989"
        cy="34.0001"
        r="7.37684"
        stroke="url(#paint4_linear_2985_1972)"
        stroke-width="14.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <g className="laser-eye-1">
      <circle
        cx="22.0763"
        cy="34.5868"
        r="2.59441"
        transform="rotate(-26.1044 22.0763 34.5868)"
        fill={'#141414'}
      />
    </g>
    <g className="laser-eye-2">
      <circle
        cx="41.3654"
        cy="25.1358"
        r="2.59441"
        transform="rotate(-26.1044 41.3654 25.1358)"
        fill={'#141414'}
      />
    </g>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M27.1724 46.4874C26.8909 45.913 25.9464 45.8929 25.372 46.1744V46.1744C24.2155 46.741 22.8187 46.2629 22.2521 45.1065C21.6854 43.95 22.1636 42.5532 23.32 41.9866C24.4764 41.4199 25.8733 41.8981 26.4399 43.0545V43.0545C26.7414 43.6699 27.6336 44.3781 28.249 44.0766L46.3034 35.2301C46.9187 34.9286 46.9058 33.7902 46.6043 33.1749V33.1749C46.0376 32.0185 46.5158 30.6216 47.6722 30.055C48.8286 29.4883 50.2255 29.9665 50.7921 31.1229C51.3588 32.2793 50.8806 33.6762 49.7242 34.2428V34.2428C49.1498 34.5242 48.587 35.2829 48.8685 35.8572L49.1722 36.4771C49.4356 37.0146 49.2134 37.6639 48.6759 37.9273L28.9267 47.6042C28.3891 47.8676 27.7397 47.6453 27.4763 47.1077L27.1724 46.4874Z"
      fill="#141414"
    />
    <defs>
      <filter
        id="filter0_b_2985_1972"
        x="-3.43529"
        y="-3.43529"
        width="74.8706"
        height="74.8706"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="4.71764" />
        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_2985_1972" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_backgroundBlur_2985_1972"
          result="shape"
        />
      </filter>
      <filter
        id="filter1_b_2985_1972"
        x="2.79421"
        y="2.79384"
        width="62.4121"
        height="62.4123"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="4.71764" />
        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_2985_1972" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_backgroundBlur_2985_1972"
          result="shape"
        />
      </filter>
      <filter
        id="filter2_b_2985_1972"
        x="9.93678"
        y="9.93794"
        width="48.1245"
        height="48.1242"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="4.71764" />
        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_2985_1972" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_backgroundBlur_2985_1972"
          result="shape"
        />
      </filter>
      <filter
        id="filter3_d_2985_1972"
        x="1.48145"
        y="13.9918"
        width="41.1899"
        height="41.19"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="6"
          operator="dilate"
          in="SourceAlpha"
          result="effect1_dropShadow_2985_1972"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="6" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.992157 0 0 0 0 0.376471 0 0 0 0 0.0666667 0 0 0 0.6 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2985_1972" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_2985_1972"
          result="shape"
        />
      </filter>
      <filter
        id="filter4_d_2985_1972"
        x="20.7705"
        y="4.54083"
        width="41.1899"
        height="41.19"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="6"
          operator="dilate"
          in="SourceAlpha"
          result="effect1_dropShadow_2985_1972"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="6" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.992157 0 0 0 0 0.376471 0 0 0 0 0.0666667 0 0 0 0.6 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2985_1972" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_2985_1972"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_2985_1972"
        x1="34"
        y1="62"
        x2="34"
        y2="6"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.276042" stop-color="#FC6432" stop-opacity="0.69" />
        <stop offset="0.526042" stop-color={linearGradientColor} stop-opacity="0.44" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_2985_1972"
        x1="34.0004"
        y1="55.7708"
        x2="34.0004"
        y2="12.2291"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.276042" stop-color="#FC6432" stop-opacity="0.69" />
        <stop offset="0.526042" stop-color={linearGradientColor} stop-opacity="0.34" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_2985_1972"
        x1="34.0004"
        y1="55.7708"
        x2="34.0004"
        y2="12.2291"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.276042" stop-color="#FC6432" stop-opacity="0.69" />
        <stop offset="0.526042" stop-color={linearGradientColor} stop-opacity="0.34" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_2985_1972"
        x1="33.9989"
        y1="48.6269"
        x2="33.9989"
        y2="19.3732"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.276042" stop-color="#FC6432" stop-opacity="0.69" />
        <stop offset="0.629036" stop-color={linearGradientColor} stop-opacity="0.34" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_2985_1972"
        x1="33.9989"
        y1="48.6269"
        x2="33.9989"
        y2="19.3732"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.276042" stop-color="#FC6432" stop-opacity="0.69" />
        <stop offset="0.526042" stop-color={linearGradientColor} stop-opacity="0.34" />
      </linearGradient>
    </defs>
  </svg>
);

const weights = new Map<IconWeight, (props: StacksSmileyIconWeightProps) => ReactElement>([
  ['regular', createWeight],
]);

interface StacksSmileyIconProps extends StacksSmileyIconWeightProps {
  weight?: IconWeight;
}

export const StacksSmileyIcon = forwardRef<SVGSVGElement, StacksSmileyIconProps>((props, ref) => {
  const { circleColor, linearGradientColor, laserEyesOn, weight = 'regular', ...restProps } = props;
  const weightFn = weights.get(weight);
  const weightElement = weightFn?.({ circleColor, linearGradientColor, laserEyesOn });

  if (!weightElement) return null;

  return (
    <IconBase
      ref={ref}
      {...restProps}
      weights={new Map([[weight, weightElement]])}
      viewBox="0 0 68 68"
    />
  );
});

StacksSmileyIcon.displayName = 'StacksSmileyIcon';
