'use client';

import {
  AlertIcon as CUIAlertIcon,
  AlertIconProps as CUIAlertIconProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type AlertIconProps = CUIAlertIconProps & UIComponent;
export const AlertIcon = ({ ...props }) => <CUIAlertIcon {...props} />;
