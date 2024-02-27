import { useColorModeValue } from '@chakra-ui/react';

import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';

export const ProgressBar = ({ progressPercentage }: { progressPercentage: number }) => {
  const bgColor = useColorModeValue('purple.200', 'slate.850');
  const progressColor = useColorModeValue(
    'linear-gradient(to right, var(--stacks-colors-purple-600) 0%, var(--stacks-colors-purple-400) 100%)',
    'linear-gradient(to right, var(--stacks-colors-purple-500), var(--stacks-colors-purple-400))'
  );

  return (
    <Flex bg={bgColor} rounded={'full'} alignItems={'center'} height={3} width={'full'}>
      <Box bg={progressColor} width={`${progressPercentage}%`} height={'full'} rounded={'full'} />
    </Flex>
  );
};
