import * as React from 'react';
import { Box, Transition } from '@blockstack/ui';
import { Text } from '@components/typography';
import { Card } from '@components/card';
import { useControlledHover } from '@common/hooks/use-controlled-hover';
import { useFocus } from 'use-events';

const Option = ({ children, onFocus, onBlur, ...rest }: any) => {
  const [focus, focusBind] = useFocus();
  return (
    <Box
      py="tight"
      px="base"
      bg={focus ? 'var(--colors-bg-light)' : 'var(--colors-bg-alt)'}
      _hover={{ cursor: 'pointer', bg: 'var(--colors-bg-light)' }}
      role="listitem"
      tabIndex={0}
      outline="none"
      onKeyPress={e => {
        if (e.key === 'Enter') {
          rest.onClick(e);
        }
      }}
      {...rest}
      onFocus={e => {
        e.preventDefault();
        onFocus();
        focusBind.onFocus(e);
      }}
      onBlur={e => {
        e.preventDefault();
        onBlur();
        focusBind.onBlur(e);
      }}
    >
      <Text fontSize="14px">{children}</Text>
    </Box>
  );
};

export const Popover = ({ onOptionClick, dismiss, children, options }: any) => {
  const [isHovered, setHovered] = React.useState(false);
  const [focused, bindFocus] = useFocus();
  const [childIsInFocus, setChildFocus] = React.useState(false);

  const [hover, bindHover] = useControlledHover(isHovered, setHovered, focused);

  const timeoutRef = React.useRef<number | undefined>(undefined);
  const removeFocusRef = React.useRef<number | undefined>(undefined);

  const handleChildFocus = React.useCallback(() => {
    setChildFocus(true);
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  const handleChildBlur = React.useCallback(e => {
    timeoutRef.current = setTimeout(() => {
      setChildFocus(false);
      bindFocus.onBlur(e);
    }, 300);
  }, []);

  React.useEffect(() => {
    if (focused && !isHovered) {
      setHovered(true);
    }
    if (childIsInFocus && removeFocusRef.current) {
      clearTimeout(removeFocusRef.current);
    }
    if (!focused && !childIsInFocus) {
      removeFocusRef.current = setTimeout(() => {
        setHovered(false);
      }, 200);
    }
  }, [focused, childIsInFocus]);

  return (
    <Box position="relative" {...bindHover} {...bindFocus}>
      <Box _hover={{ cursor: 'pointer' }} {...bindHover} {...bindFocus}>
        {children}
      </Box>
      <Transition
        styles={{
          init: {
            opacity: 0,

            transform: 'translateY(5px)',
          },
          entered: {
            opacity: 1,

            transform: 'none',
          },
          exiting: {
            opacity: 0,

            transform: 'translateY(5px)',
          },
        }}
        in={hover}
        onExit={dismiss}
        timeout={180}
      >
        {styles => (
          <Box
            pt="tight"
            width="100%"
            style={styles}
            position="absolute"
            zIndex={999}
            {...bindHover}
          >
            <Card
              role="listbox"
              boxShadow="high"
              minHeight="100px"
              bg="var(--colors-bg)"
              overflow="hidden"
            >
              {options.map(({ label, value }: { label: string; value: string }, key: number) => (
                <Option
                  key={key}
                  onFocus={handleChildFocus}
                  onBlur={handleChildBlur}
                  onClick={(e: any) => {
                    e?.preventDefault();
                    bindFocus.onBlur(e);
                    setHovered(false);
                    onOptionClick(value);
                  }}
                >
                  {label}
                </Option>
              ))}
            </Card>
          </Box>
        )}
      </Transition>
    </Box>
  );
};
