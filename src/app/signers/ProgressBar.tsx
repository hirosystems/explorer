import styled from '@emotion/styled';

import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';

const ProgressBarContainer = styled(Flex)<{
  $progressPercentage: number;
  $height: string;
}>`
  background-color: #e0e1e6; /* The lighter grey background */
  border-radius: 10px; /* Adjust for desired roundness */
  align-items: center;
  height: ${props => props.$height};
  width: 100%;

  .progress-bar-fill {
    /* background-color: #5546ff; The fill color */
    width: ${props => `${props.$progressPercentage}%`};
    height: 100%;
    border-radius: 8px; /* Adjust for desired roundness on the fill */
    background: linear-gradient(
      to right,
      #5546ff 0%,
      rgba(85, 70, 255, 0.37) 100%
    ); /* The linear gradient */
  }

  .progress-bar-text {
    margin-left: 10px; /* Space between the bar and the text */
    font-size: 0.9em;
  }
`;

export const ProgressBar = ({
  progressPercentage,
  height,
}: {
  progressPercentage: number;
  height: string;
}) => {
  return (
    <ProgressBarContainer $progressPercentage={progressPercentage} $height={height}>
      <Box className="progress-bar-fill" />
    </ProgressBarContainer>
  );
};
