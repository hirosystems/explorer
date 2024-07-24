'use client';

import {
  Textarea as CUITextarea,
  TextareaProps as CUITextareaProps,
  forwardRef,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

export type ExpandingTextareaProps = CUITextareaProps;
export const ExpandingTextarea = forwardRef<ExpandingTextareaProps, 'textarea'>(
  ({ children, onInput, value, ...rest }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      }
    }, [value]);

    return (
      <CUITextarea
        ref={ref || textareaRef}
        overflow={'hidden'}
        rows={1}
        resize={'none'}
        px={3}
        onInput={e => {
          e.currentTarget.style.height = 'auto';
          e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
          onInput?.(e);
        }}
        value={value}
        {...rest}
      >
        {children}
      </CUITextarea>
    );
  }
);
