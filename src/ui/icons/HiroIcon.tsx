import { Icon, IconProps } from '@chakra-ui/react';

export const HiroIcon = ({ color, ...rest }: IconProps) => {
  return (
    <Icon {...rest}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 16" fill="none">
        <rect x="0.613281" width="16" height="16" rx="4" fill={(color as string) ?? '#95918C'} />
        <path
          d="M9.78612 11.2553C9.78097 11.2706 9.78348 11.2874 9.79288 11.3005C9.80227 11.3136 9.81739 11.3213 9.8335 11.3213H10.675C10.6965 11.3213 10.7155 11.3076 10.7224 11.2873L12.9318 4.74464C12.9369 4.72938 12.9344 4.71257 12.925 4.69949C12.9156 4.6864 12.9005 4.67865 12.8844 4.67865H12.0429C12.0214 4.67865 12.0024 4.69233 11.9955 4.71265L9.78612 11.2553Z"
          fill="#F3F2F0"
          stroke="#F3F2F0"
          strokeWidth="0.1"
          strokeLinejoin="round"
        />
        <path
          d="M4.34276 11.3214H5.18357C5.20502 11.3214 5.22408 11.3077 5.23094 11.2874L7.44032 4.74467C7.44547 4.72941 7.44296 4.7126 7.43357 4.69952C7.42418 4.68643 7.40906 4.67867 7.39295 4.67867H6.55214C6.53069 4.67867 6.51163 4.69235 6.50476 4.71268L4.29796 11.2477C4.29418 11.2548 4.29204 11.2628 4.29204 11.2714C4.29204 11.299 4.31443 11.3214 4.34204 11.3214H4.34276Z"
          fill="#F3F2F0"
          stroke="#F3F2F0"
          strokeWidth="0.1"
          strokeLinejoin="round"
        />
        <path
          d="M9.90967 7.66701C9.91482 7.65175 9.91231 7.63494 9.90292 7.62185C9.89353 7.60877 9.8784 7.60101 9.8623 7.60101H7.6005C7.57906 7.60101 7.56 7.61469 7.55313 7.63501L7.31762 8.33222C7.31246 8.34748 7.31498 8.36428 7.32437 8.37737C7.33376 8.39046 7.34888 8.39822 7.36499 8.39822H9.62678C9.64823 8.39822 9.66729 8.38454 9.67415 8.36422L9.90967 7.66701Z"
          fill="#F3F2F0"
          stroke="#F3F2F0"
          strokeWidth="0.1"
          strokeLinejoin="round"
        />
      </svg>
    </Icon>
  );
};
