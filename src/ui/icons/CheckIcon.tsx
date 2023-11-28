'use client';

import { forwardRef } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FiCheck } from 'react-icons/fi';

import { Box } from '../Box';
import { UIComponent } from '../types';

export const CheckIcon = forwardRef<IconType & UIComponent, 'svg'>(({ size, ...rest }, ref) => (
  <Box ref={ref} width={size || rest.width} height={size || rest.height} display={'inline-block'}>
    <FiCheck size={size} {...rest} />
  </Box>
));
