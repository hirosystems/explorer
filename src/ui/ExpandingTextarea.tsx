'use client';

import { ClientOnly, Textarea, TextareaProps } from '@chakra-ui/react';
import { forwardRef, useEffect, useRef } from 'react';

export type ExpandingTextareaProps = TextareaProps;

export const ExpandingTextarea = forwardRef<HTMLTextAreaElement, ExpandingTextareaProps>(
  ({ children, onInput, value, placeholder, ...rest }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Adjust the height of the textarea
    const adjustHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height to calculate scrollHeight
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Apply new height
      }
    };

    useEffect(() => {
      adjustHeight(); // Adjust height whenever the component renders or value changes
    }, [value]);

    return (
      // This is a client-only component because it depends on the client-side value of `value` and the `useEffect` hook to adjust the height of the textarea
      <ClientOnly>
        <Textarea
          ref={ref || textareaRef}
          width="100%"
          resize={'none'} // Prevent manual resizing
          px={3}
          value={value}
          placeholder={placeholder}
          border="1px solid var(--stacks-colors-border-primary)"
          borderRadius="md"
          {...rest}
        >
          {children}
        </Textarea>
      </ClientOnly>
    );
  }
);
