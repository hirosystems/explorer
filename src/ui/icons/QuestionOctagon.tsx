import { IconBaseProps } from 'react-icons';

export function QuestionOctagon({ color = '#C83532', size = 26, ...rest }: IconBaseProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M8.032 1.11218H17.968L25 8.14418V18.0802L17.968 25.1122H8.032L1 18.0802V8.14418L8.032 1.11218Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.7829 18.5788C13.4299 18.5788 13.9544 18.0544 13.9544 17.4074C13.9544 16.7604 13.4299 16.236 12.7829 16.236C12.136 16.236 11.6115 16.7604 11.6115 17.4074C11.6115 18.0544 12.136 18.5788 12.7829 18.5788Z"
        fill={color}
      />
      <path
        d="M12.7829 13.8931V13.1122C14.5079 13.1122 15.9068 11.888 15.9068 10.3789C15.9068 8.86966 14.5079 7.64551 12.7829 7.64551C11.058 7.64551 9.65912 8.86966 9.65912 10.3789V10.7693"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
