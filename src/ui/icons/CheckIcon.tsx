import { Box } from '@/ui/Box';
import { UIComponent } from '@/ui/types';
import { forwardRef } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FiCheck } from 'react-icons/fi';

export const CheckIcon = forwardRef<IconType & UIComponent, 'svg'>(({ size, ...rest }, ref) => (
  <Box ref={ref} width={size || rest.width} height={size || rest.height} display={'inline-block'}>
    <FiCheck size={size} {...rest} />
  </Box>
));
