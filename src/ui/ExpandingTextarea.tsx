'use client';

import { Textarea, TextareaProps, chakra } from '@chakra-ui/react';
import { forwardRef, useCallback, useEffect, useRef } from 'react';
import AutoResize from 'react-textarea-autosize';

const StyledAutoResize = chakra(AutoResize);

export type ExpandingTextareaProps = TextareaProps;

export const ExpandingTextarea = forwardRef<HTMLTextAreaElement, ExpandingTextareaProps>(
  ({ children, onInput, value, placeholder, ...rest }, ref) => {
    // const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // const adjustHeight = useCallback(() => {
    //   const textarea = textareaRef.current;
    //   if (!textarea) return;
    //   textarea.style.height = 'auto';
    //   textarea.style.height = `${textarea.scrollHeight}px`;
    // }, []);

    // useEffect(() => {
    //   adjustHeight();
    //   const timer = setTimeout(adjustHeight, 100);
    //   return () => clearTimeout(timer);
    // }, [value, adjustHeight]);

    return (
      // TODO: fix this
      <StyledAutoResize
        // ref={ref || textareaRef}
        width="100%"
        overflow={'hidden'}
        rows={1}
        resize={'none'}
        px={3}
        lineHeight="inherit"
        css={{
          // Add this separate prop
          '&::placeholder': {
            textAlign: 'center',
          },
        }}
        value={value}
        // h="auto"
        minH={10}
        border="1px solid var(--stacks-colors-border-primary)"
        borderRadius="md"
        placeholder={placeholder}
        {...rest}
      >
        {children}
      </StyledAutoResize>
    );
  }
);
