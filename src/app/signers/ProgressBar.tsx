import { ColorMode } from '@chakra-ui/react';
import styled from '@emotion/styled';

import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { useColorMode } from '../../ui/hooks/useColorMode';

const ProgressBarContainer = styled(Flex)<{
  $colorMode: ColorMode;
  $progressPercentage: number;
  $height: string;
}>`
  background-color: ${props =>
    props.$colorMode === 'light'
      ? 'var(--stacks-colors-purple-200)'
      : 'var(--stacks-colors-slate-850)'};
  border-radius: 10px;
  align-items: center;
  height: ${props => props.$height};
  width: 100%;

  .progress-bar-fill {
    width: ${props => `${props.$progressPercentage}%`};
    height: 100%;
    border-radius: 8px;
    background: ${props =>
      props.$colorMode === 'light'
        ? ' linear-gradient(to right, #5546ff 0%, rgba(85, 70, 255, 0.37) 100%);'
        : 'linear-gradient(to right, #5C6CF2, #7F97F1)'};
  }
`;
export const ProgressBar = ({
  progressPercentage,
  height,
}: {
  progressPercentage: number;
  height: string;
}) => {
  const colorModeContext = useColorMode();
  const colorMode = colorModeContext.colorMode;

  return (
    <ProgressBarContainer
      $colorMode={colorMode}
      $progressPercentage={progressPercentage}
      $height={height}
    >
      <Box className="progress-bar-fill" />
    </ProgressBarContainer>
  );
};
